import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Loader2, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { useLoginMutation, useVerifyEmailMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import FormInput from '../../components/ui/FormInput';
import { getErrorMessage } from '../../lib/error-handler';

interface LoginFormInputs {
  emailOrUsername: string;
  passwordOrPin: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [verifyEmail, { isLoading: isResending }] = useVerifyEmailMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const from = location.state?.from || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormInputs>({
    defaultValues: {
      emailOrUsername: '',
      passwordOrPin: '',
    },
  });

  const emailOrUsername = watch('emailOrUsername');
  const isEmail = emailOrUsername.includes('@');

  const onSubmit = async (data: LoginFormInputs) => {
    setServerError(null);
    setShowResend(false);
    setResendSuccess(false);

    try {
      const cleanIdentifier = data.emailOrUsername.includes('@')
        ? data.emailOrUsername.trim().toLowerCase()
        : data.emailOrUsername.trim();

      const result = await login({
        identifier: cleanIdentifier,
        password: data.passwordOrPin.trim(),
      }).unwrap();

      dispatch(
        setCredentials({
          token: result.token,
          user: result.user,
          roles: result.roles,
          permissions: result.permissions,
          rememberMe,
        })
      );

      toast.success('Login successful! Redirecting...', {
        icon: <ShieldCheck className="text-emerald-400 h-5 w-5" />,
      });

      const roles = result.roles || [];
      let targetUrl = from;

      if (from === '/dashboard') {
        if (roles.includes('super_admin') || roles.includes('admin')) {
          targetUrl = '/admin/dashboard';
        } else if (roles.includes('instructor')) {
          targetUrl = '/instructor/dashboard';
        } else if (roles.includes('parent')) {
          targetUrl = '/parent/dashboard';
        } else if (roles.includes('student') || roles.includes('child')) {
          targetUrl = '/student/courses';
        } else {
          targetUrl = result.redirectTo || '/';
        }
      }

      setTimeout(() => {
        navigate(targetUrl, { replace: true });
      }, 1000);
    } catch (err: any) {
      const message = getErrorMessage(err, 'Failed to login. Please check your credentials.');
      setServerError(message);
      toast.error(message);

      if (
        message.toLowerCase().includes('verify your email') ||
        message.toLowerCase().includes('email not verified')
      ) {
        setShowResend(true);
      }
    }
  };

  const handleResendVerification = async () => {
    const email = emailOrUsername.trim();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address above to resend verification.');
      return;
    }
    setResendSuccess(false);
    try {
      await verifyEmail({ email }).unwrap();
      setResendSuccess(true);
      toast.success('Verification email resent! Check your inbox.');
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to resend verification email.');
      toast.error(message);
    }
  };

  return (
    <div className="public-shell min-h-screen bg-[#070b16] text-slate-100 flex">
      <aside className="hidden lg:flex lg:w-[42%] xl:w-[44%] relative flex-col justify-between p-10 xl:p-14 border-r border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1224] via-[#070b16] to-[#0a1628]" />
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
              <span className="text-white font-bold">E</span>
            </div>
            <div>
              <p className="text-white font-semibold tracking-tight">Ethiohope</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Academy</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300 mb-4">
            Welcome back
          </p>
          <h2 className="text-3xl xl:text-4xl font-semibold text-white leading-tight mb-4 tracking-tight">
            Sign in to continue learning
          </h2>
          <p className="text-slate-400 leading-relaxed text-[15px]">
            Access your dashboard, enrollments, live sessions, and progress — securely in one place.
          </p>
        </div>

        <p className="relative z-10 text-xs text-slate-600">
          © {new Date().getFullYear()} Ethiohope Academy
        </p>
      </aside>

      <main className="flex-1 flex flex-col justify-center px-5 sm:px-8 py-10 relative">
        <Link
          to="/"
          className="absolute top-5 left-5 sm:top-8 sm:left-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px] mx-auto"
        >
          <div className="mb-8">
            <div className="lg:hidden mb-6">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-white font-semibold">Ethiohope</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-[28px] font-semibold text-white tracking-tight">
              Sign in
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-[15px]">
              Enter your credentials to access your account.
            </p>
          </div>

          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="bg-red-500/10 border border-red-500/25 text-red-300 px-4 py-3.5 rounded-xl text-sm">
                  {serverError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showResend && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 space-y-3">
                  <p className="text-sm text-amber-200 font-medium flex items-center gap-2">
                    <Mail size={16} />
                    Your email is not verified yet
                  </p>
                  {resendSuccess ? (
                    <p className="text-sm text-emerald-300 font-medium">
                      Verification email sent. Check your inbox and spam folder.
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="w-full py-2.5 px-4 rounded-lg font-medium text-sm bg-amber-500/90 text-white hover:bg-amber-500 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Resend verification email
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
            <FormInput
              id="emailOrUsername"
              label={isEmail ? 'Email address' : 'Username'}
              placeholder={isEmail ? 'name@example.com' : 'Enter your username'}
              autoComplete="username"
              icon={isEmail ? <Mail size={17} /> : <User size={17} />}
              error={errors.emailOrUsername?.message}
              {...register('emailOrUsername', {
                required: 'Email or username is required',
                onBlur: (e) => {
                  if (e.target.value.includes('@')) {
                    setValue('emailOrUsername', e.target.value.trim().toLowerCase(), {
                      shouldValidate: true,
                    });
                  } else {
                    setValue('emailOrUsername', e.target.value.trim(), { shouldValidate: true });
                  }
                },
              })}
            />

            <FormInput
              id="passwordOrPin"
              label={isEmail ? 'Password' : 'PIN code'}
              type="password"
              placeholder={isEmail ? 'Enter your password' : 'Enter your PIN'}
              autoComplete="current-password"
              icon={<Lock size={17} />}
              error={errors.passwordOrPin?.message}
              {...register('passwordOrPin', {
                required: isEmail ? 'Password is required' : 'PIN is required',
                minLength: {
                  value: isEmail ? 6 : 4,
                  message: isEmail
                    ? 'Password must be at least 6 characters'
                    : 'PIN must be at least 4 digits',
                },
              })}
            />

            <div className="flex items-center justify-between py-1 mb-2">
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-[#070b16] text-blue-600 focus:ring-blue-500/30"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              state={{ from }}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Create account
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
