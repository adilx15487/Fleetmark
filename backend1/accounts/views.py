import logging

import requests as http_requests
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from typing import cast

from accounts.permissions import IsSuperAdminorOrgAdmin, IsOwnerOrAdmin
from organization.models import Organization
from .models import User
from .serializers import UserCreateSerializer, UserSerializer

logger = logging.getLogger(__name__)


class UserViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def get_queryset(self):
        user = self.request.user
        # Only allow access if authenticated
        if not user.is_authenticated:
            return User.objects.none()

        # Type cast for static analysis
        user = cast(User, user)

        if user.is_superuser:
            return User.objects.all()
        elif user.is_org_admin:
            if user.organization:
                return User.objects.filter(organization=user.organization)
            else:
                return User.objects.none()
        else:
            if user.id:
                return User.objects.filter(id=user.id)
            else:
                return User.objects.none()
    
    def get_permissions(self):
        if self.action in ['list', 'create', 'destroy']:
            return [IsSuperAdminorOrgAdmin()]
        elif self.action == 'retrieve':
            return [IsAuthenticated()]
        elif self.action in ['update', 'partial_update']:
            return [IsOwnerOrAdmin()]
        return [IsAuthenticated()]


# ── 42 OAuth Callback ──────────────────────────────────────────────
class OAuth42CallbackView(APIView):
    """
    POST /api/v1/accounts/42/callback/
    Body: { "code": "<authorization_code>" }

    Flow:
    1. Exchange code for 42 access token
    2. Get user info from 42 API
    3. Create or get user in DB
    4. Return Fleetmark JWT tokens + user info
    """
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response(
                {'error': 'Authorization code is required', 'code': 'missing_code'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 1 — Exchange code for 42 access token
        try:
            token_resp = http_requests.post(
                'https://api.intra.42.fr/oauth/token',
                data={
                    'grant_type': 'authorization_code',
                    'client_id': settings.OAUTH_42_CLIENT_ID,
                    'client_secret': settings.OAUTH_42_CLIENT_SECRET,
                    'code': code,
                    'redirect_uri': settings.OAUTH_42_REDIRECT_URI,
                },
                timeout=10,
            )
        except http_requests.RequestException as e:
            logger.error('42 token exchange network error: %s', e)
            return Response(
                {'error': 'Failed to connect to 42 API', 'code': 'network_error'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        if token_resp.status_code != 200:
            logger.error('42 token exchange failed: %s %s', token_resp.status_code, token_resp.text[:500])
            return Response(
                {'error': 'Invalid or expired authorization code', 'code': 'token_exchange_failed'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        ft_access_token = token_resp.json().get('access_token')
        if not ft_access_token:
            return Response(
                {'error': '42 API did not return an access token', 'code': 'no_access_token'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # 2 — Get user info from 42 API
        try:
            me_resp = http_requests.get(
                'https://api.intra.42.fr/v2/me',
                headers={'Authorization': f'Bearer {ft_access_token}'},
                timeout=10,
            )
        except http_requests.RequestException as e:
            logger.error('42 /v2/me network error: %s', e)
            return Response(
                {'error': 'Failed to fetch user info from 42', 'code': 'network_error'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        if me_resp.status_code != 200:
            logger.error('42 /v2/me failed: %s', me_resp.status_code)
            return Response(
                {'error': 'Failed to fetch 42 user profile', 'code': 'profile_fetch_failed'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        me_data = me_resp.json()
        login42 = me_data.get('login', '')
        email = me_data.get('email', '')
        displayname = me_data.get('displayname', login42)
        image_link = ''
        if me_data.get('image') and isinstance(me_data['image'], dict):
            image_link = me_data['image'].get('link', '')
        campus_name = ''
        campuses = me_data.get('campus', [])
        if campuses and isinstance(campuses, list) and len(campuses) > 0:
            campus_name = campuses[0].get('name', '')

        if not login42:
            return Response(
                {'error': 'Could not determine 42 login', 'code': 'invalid_profile'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # 3 — Create or get user in DB
        is_new = False
        try:
            user = User.objects.get(login42=login42)
        except User.DoesNotExist:
            is_new = True
            # Try to find default org (1337 School)
            org = Organization.objects.filter(name__icontains='1337').first()

            user = User.objects.create(
                username=login42,
                email=email,
                first_name=displayname.split(' ')[0] if displayname else '',
                last_name=' '.join(displayname.split(' ')[1:]) if displayname and ' ' in displayname else '',
                login42=login42,
                avatar42=image_link,
                campus42=campus_name,
                auth_provider='42',
                role='passenger',  # default, user picks on first login
                needs_role=True,
                organization=org,
            )
            user.set_unusable_password()
            user.save()

        # Update avatar/campus on every login (may change)
        if not is_new:
            changed = False
            if image_link and user.avatar42 != image_link:
                user.avatar42 = image_link
                changed = True
            if campus_name and user.campus42 != campus_name:
                user.campus42 = campus_name
                changed = True
            if changed:
                user.save(update_fields=['avatar42', 'campus42'])

        # 4 — Issue Fleetmark JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'login42': user.login42,
                'avatar42': user.avatar42,
                'campus42': user.campus42,
                'displayname': displayname,
                'needs_role': user.needs_role,
                'organization': {
                    'id': user.organization.id,
                    'name': user.organization.name,
                } if user.organization else None,
            },
        }, status=status.HTTP_200_OK)


# ── Set Role for 42 Users ──────────────────────────────────────────
class SetRoleView(APIView):
    """
    PATCH /api/v1/accounts/set-role/
    Body: { "role": "passenger" | "admin" | "driver" }

    Used after first 42 OAuth login so user can pick their role.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        role = request.data.get('role')
        valid_roles = [c[0] for c in User.ROLE_CHOICES]
        if role not in valid_roles:
            return Response(
                {'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}', 'code': 'invalid_role'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = cast(User, request.user)
        user.role = role
        user.needs_role = False
        user.save(update_fields=['role', 'needs_role'])

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'login42': user.login42,
            'avatar42': user.avatar42,
            'campus42': user.campus42,
            'needs_role': user.needs_role,
        }, status=status.HTTP_200_OK)

