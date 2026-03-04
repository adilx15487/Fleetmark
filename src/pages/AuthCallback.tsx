import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

type CallbackState = 'authenticating' | 'success' | 'error';

const AuthCallback = () => {
  useDocumentTitle('Authenticating — Fleetmark 1337');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWith42 } = useAuth();
  const [state, setState] = useState<CallbackState>('authenticating');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    const handleCallback = async () => {
      if (errorParam) {
        setState('error');
        setErrorMsg(`42 denied access: ${errorParam}`);
        return;
      }

      if (!code) {
        setState('error');
        setErrorMsg('No authorization code received from 42.');
        return;
      }

      // Send code to backend for token exchange
      const result = await loginWith42(code);

      if (result.result === 'role-select') {
        setState('success');
        setTimeout(() => navigate('/auth/role-select'), 800);
      } else if (result.result === 'dashboard') {
        setState('success');
        setTimeout(() => navigate(result.path), 800);
      } else {
        setState('error');
        setErrorMsg(
          result.message === 'Network error — please check your connection.'
            ? 'Backend server is unreachable. Make sure the Django API is running on port 8000, or set VITE_USE_MOCK=true.'
            : result.message || 'Authentication failed. Please try again.'
        );
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl shadow-primary-100/20 border border-slate-200 p-10 max-w-sm w-full text-center">
        {/* 42 Logo */}
        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl font-black tracking-tight">42</span>
        </div>

        {state === 'authenticating' && (
          <>
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold text-primary-900 mb-2">Authenticating with 42</h2>
            <p className="text-sm text-slate-400">Verifying your 42 Intra credentials…</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-primary-900 mb-2">Authenticated!</h2>
            <p className="text-sm text-slate-400">Redirecting you now…</p>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-primary-900 mb-2">Authentication Failed</h2>
            <p className="text-sm text-red-500 mb-6">{errorMsg}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800 transition-colors"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
