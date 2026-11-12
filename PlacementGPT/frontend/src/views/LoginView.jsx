import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { loginUser, registerUser } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import { FiAlertCircle } from 'react-icons/fi';

const LoginView = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isRegister = mode === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = isRegister
        ? await registerUser(name, email, password)
        : await loginUser(email, password);
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      onAuthSuccess({
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email,
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        provider: 'google',
      });
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was cancelled');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Enable Google Sign-In in your Firebase Console Authentication settings');
      } else {
        setError(err.message || 'Unable to sign in with Google');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(isRegister ? 'login' : 'register');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#f7f4ee] dark:bg-[#161513] flex flex-col justify-between p-4 md:p-6">
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#b45309] dark:bg-[#d97706] text-white dark:text-[#12110f] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M8 7h6" />
              <path d="M8 11h4" />
            </svg>
          </div>
          <span className="text-[#1f1b16] dark:text-[#efe9de] font-medium text-base tracking-tight">
            PlacementGPT
          </span>
        </div>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm mx-auto my-12 animate-fade-in">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-normal text-[#1f1b16] dark:text-[#efe9de] tracking-[-0.02em] leading-tight">
            {isRegister ? 'Create your workspace' : 'Sign in to PlacementGPT'}
          </h1>
          <p className="text-sm text-[#5e554a] dark:text-[#aaa398] mt-1.5">
            {isRegister
              ? 'Save your placement prep history locally'
              : 'Continue your offline interview preparation'}
          </p>
        </div>

        <div className="bg-[#fdfbf7] dark:bg-[#1c1a18] border border-[#1f1b16]/10 dark:border-[#efe9de]/10 rounded-xl p-5 flex flex-col gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isGoogleLoading}
            className="h-10 w-full flex items-center justify-center gap-2.5 bg-[#f7f4ee] dark:bg-[#262421] hover:bg-[#efe9df] dark:hover:bg-[#302d29] border border-[#1f1b16]/12 dark:border-[#efe9de]/12 text-[#1f1b16] dark:text-[#efe9de] rounded-lg text-sm font-medium transition-colors disabled:opacity-40 active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Google…' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#1f1b16]/8 dark:bg-[#efe9de]/8" />
            <span className="text-xs text-[#7b7266] dark:text-[#8a847a]">or</span>
            <div className="h-px flex-1 bg-[#1f1b16]/8 dark:bg-[#efe9de]/8" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-name" className="text-xs font-medium text-[#5e554a] dark:text-[#aaa398]">
                  Full name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="h-10 px-3 rounded-lg bg-[#f7f4ee] dark:bg-[#161513] border border-[#1f1b16]/12 dark:border-[#efe9de]/12 text-sm text-[#1f1b16] dark:text-[#efe9de] placeholder-[#7b7266] dark:placeholder-[#8a847a] outline-none focus:border-[#b45309] dark:focus:border-[#d97706] transition-colors"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-email" className="text-xs font-medium text-[#5e554a] dark:text-[#aaa398]">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-10 px-3 rounded-lg bg-[#f7f4ee] dark:bg-[#161513] border border-[#1f1b16]/12 dark:border-[#efe9de]/12 text-sm text-[#1f1b16] dark:text-[#efe9de] placeholder-[#7b7266] dark:placeholder-[#8a847a] outline-none focus:border-[#b45309] dark:focus:border-[#d97706] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-password" className="text-xs font-medium text-[#5e554a] dark:text-[#aaa398]">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="h-10 px-3 rounded-lg bg-[#f7f4ee] dark:bg-[#161513] border border-[#1f1b16]/12 dark:border-[#efe9de]/12 text-sm text-[#1f1b16] dark:text-[#efe9de] placeholder-[#7b7266] dark:placeholder-[#8a847a] outline-none focus:border-[#b45309] dark:focus:border-[#d97706] transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 bg-[#dc2626]/10 dark:bg-[#e5484d]/15 border border-[#dc2626]/25 dark:border-[#e5484d]/30 text-[#dc2626] dark:text-[#e5484d] rounded-lg flex items-start gap-2 text-xs leading-relaxed">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="h-10 w-full bg-[#b45309] hover:bg-[#92400e] text-white dark:bg-[#d97706] dark:hover:bg-[#f59e0b] dark:text-[#12110f] rounded-lg text-sm font-medium transition-colors disabled:opacity-40 active:scale-[0.98]"
            >
              {isSubmitting
                ? (isRegister ? 'Creating account…' : 'Signing in…')
                : (isRegister ? 'Create account' : 'Sign in')}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-xs text-[#5e554a] dark:text-[#aaa398] hover:text-[#1f1b16] dark:hover:text-[#efe9de] transition-colors"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-[#7b7266] dark:text-[#8a847a] font-mono">
        Local session · Ollama + ChromaDB
      </p>
    </div>
  );
};

export default LoginView;
