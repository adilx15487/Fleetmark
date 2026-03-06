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

      const result = await loginWith42(code);

      if (result.result === 'onboarding') {
        setState('success');
        setTimeout(() => navigate('/onboarding'), 800);
      } else if (result.result === 'dashboard') {
        setState('success');
        setTimeout(() => navigate(result.path), 800);
      } else {
        setState('error');
        setErrorMsg(result.message || 'Authentication failed. Please try again.');
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div
        className="rounded-2xl p-10 max-w-sm w-full text-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* 42 Logo */}
        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl font-black tracking-tight">42</span>
        </div>

        {state === 'authenticating' && (
          <>
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Authenticating with 42</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Verifying your 42 Intra credentials…</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Authenticated!</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Redirecting you now…</p>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Authentication Failed</h2>
            <p className="text-sm text-red-500 mb-6">{errorMsg}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors"
              style={{ backgroundColor: 'var(--accent-primary)' }}
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
