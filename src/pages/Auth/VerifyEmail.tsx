import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight, RefreshCw } from 'lucide-react';

import { useConfirmVerificationMutation, useVerifyEmailMutation } from '../../features/auth/authApi';

type VerifyState = 'loading' | 'success' | 'error' | 'expired';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [confirmVerification] = useConfirmVerificationMutation();
  const [verifyEmail, { isLoading: isResending }] = useVerifyEmailMutation();
  
  const [state, setState] = useState<VerifyState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setState('error');
      setErrorMessage('No verification token provided. Please check your email for the correct link.');
      return;
    }

    const verify = async () => {
      try {
        await confirmVerification({ token }).unwrap();
        setState('success');
      } catch (err: any) {
        const message = err?.data?.message || 'Verification failed. The token may be invalid or expired.';
        if (message.toLowerCase().includes('expired')) {
          setState('expired');
        } else {
          setState('error');
        }
        setErrorMessage(message);
      }
    };

    verify();
  }, [token, confirmVerification]);

  // Auto-redirect countdown after success
  useEffect(() => {
    if (state !== 'success') return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state, navigate]);

  const handleResend = async () => {
    if (!resendEmail.trim()) return;
    try {
      await verifyEmail({ email: resendEmail.trim() }).unwrap();
      setResendSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'Failed to resend verification email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fadeIn">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card shadow-2xl backdrop-blur-sm bg-card/90">
          <AnimatePresence mode="wait">

            {/* LOADING STATE */}
            {state === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
                  <Loader2 size={40} className="animate-spin" />
                </div>
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
                  Verifying Your Email
                </h1>
                <p className="text-muted-foreground">
                  Please wait while we verify your email address...
                </p>
              </motion.div>
            )}

            {/* SUCCESS STATE */}
            {state === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mb-6"
                >
                  <CheckCircle2 size={44} />
                </motion.div>
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
                  Email Verified!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Your email has been successfully verified. You can now log in to your account.
                </p>

                {/* Countdown progress */}
                <div className="mb-6">
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      className="h-full bg-green-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Redirecting to login in {countdown}s...
                  </p>
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold
                    bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]
                    shadow-lg shadow-primary/20 transition-all duration-300"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            )}

            {/* ERROR / EXPIRED STATE */}
            {(state === 'error' || state === 'expired') && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10 text-error mb-6"
                >
                  <XCircle size={44} />
                </motion.div>
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
                  {state === 'expired' ? 'Link Expired' : 'Verification Failed'}
                </h1>
                <p className="text-muted-foreground mb-6">
                  {errorMessage}
                </p>

                {/* Resend verification section */}
                {!resendSuccess ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">
                      Enter your email to receive a new verification link:
                    </p>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 pl-11 bg-secondary/50 border-2 border-transparent rounded-xl outline-none transition-all duration-200
                          placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                    <button
                      onClick={handleResend}
                      disabled={isResending || !resendEmail.trim()}
                      className={`
                        w-full py-3.5 px-4 rounded-xl font-bold transition-all duration-300
                        flex items-center justify-center gap-2
                        ${isResending || !resendEmail.trim()
                          ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70'
                          : 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20'
                        }
                      `}
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-5 w-5" />
                          <span>Resend Verification Email</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-3 rounded-xl text-sm font-medium"
                  >
                    ✅ A new verification link has been sent to your email!
                  </motion.div>
                )}

                <div className="mt-6 pt-4 border-t border-border/50">
                  <Link
                    to="/login"
                    className="text-primary font-bold hover:text-accent transition-colors text-sm"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
