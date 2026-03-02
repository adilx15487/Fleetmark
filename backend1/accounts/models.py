from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "Administrator"),
        ("driver", "Driver"),
        ("passenger", "Passenger"),
    ]
    @property
    def is_org_admin(self):
        return self.role == 'admin'

    @property
    def is_driver(self):
        return self.role == 'driver'

    @property
    def is_passenger(self):
        return self.role == 'passenger'

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='passenger')
    organization = models.ForeignKey('organization.Organization',
                            on_delete=models.CASCADE,
                            null=True, blank=True,  # Optional - not all users need organization
                            related_name='users')

    # ── 42 OAuth fields ──
    login42 = models.CharField(max_length=50, unique=True, null=True, blank=True,
                               help_text="42 Intra login (e.g. abourji)")
    avatar42 = models.URLField(max_length=500, blank=True, default='',
                               help_text="42 profile image URL")
    campus42 = models.CharField(max_length=100, blank=True, default='',
                                help_text="42 campus name (e.g. 1337)")
    auth_provider = models.CharField(max_length=10, default='email',
                                     choices=[('email', 'Email'), ('42', '42 OAuth')])
    needs_role = models.BooleanField(default=False,
                                     help_text="True if 42 user hasn't chosen role yet")

    def __str__(self):
        return self.username