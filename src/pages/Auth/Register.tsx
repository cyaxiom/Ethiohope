import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Loader2, ArrowRight, ShieldCheck, CheckCircle2, RefreshCw, Phone, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { useSignupMutation, useVerifyEmailMutation } from '../../features/auth/authApi';
import FormInput from '../../components/ui/FormInput';
import { getErrorMessage } from '../../lib/error-handler';

interface RegisterFormInputs {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const location = useLocation();
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [verifyEmail, { isLoading: isResending }] = useVerifyEmailMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Get the return path from location state
  const from = location.state?.from;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormInputs) => {
    setServerError(null);
    try {
      await signup({
        firstname: data.firstname.trim(),
        lastname: data.lastname.trim(),
        email: data.email.trim(),
        password: data.password,
      }).unwrap();

      // Show the "check your email" screen
      setRegisteredEmail(data.email.trim());

      toast.success('Account created! Check your email to verify.', {
        icon: <ShieldCheck className="text-success h-5 w-5" />,
        duration: 5000,
      });
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to register account.');
      setServerError(message);
      toast.error(message);
    }
  };

  const handleResendEmail = async () => {
    if (!registeredEmail) return;
    setResendSuccess(false);
    try {
      await verifyEmail({ email: registeredEmail }).unwrap();
      setResendSuccess(true);
      toast.success('Verification email resent!');
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to resend verification email.');
      toast.error(message);
    }
  };

  // ─── SUCCESS: "Check Your Email" Screen ────────────────────────────
  if (registeredEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fadeIn relative">
        <Link 
          to="/" 
          className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 group z-50 bg-card/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm"
        >
          <Home size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-semibold tracking-tight">Back to Home</span>
        </Link>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="card shadow-2xl backdrop-blur-sm bg-card/90 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Mail size={40} />
            </motion.div>

            <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
              Check Your Email
            </h1>
            <p className="text-muted-foreground mb-2">
              We've sent a verification link to:
            </p>
            <p className="text-primary font-bold text-lg mb-6">
              {registeredEmail}
            </p>

            <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left space-y-2">
              <p className="text-sm text-muted-foreground font-medium flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                Open the email and click the verification link
              </p>
              <p className="text-sm text-muted-foreground font-medium flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                Once verified, you can log in to your account
              </p>
              <p className="text-sm text-muted-foreground font-medium flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                Check your spam folder if you don't see it
              </p>
            </div>

            {/* Resend button */}
            <AnimatePresence>
              {resendSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-3 rounded-xl text-sm font-medium mb-4"
                >
                  ✅ Verification email resent successfully!
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className={`
                w-full py-3 px-4 rounded-xl font-bold transition-all duration-300
                flex items-center justify-center gap-2 mb-4
                ${isResending 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70' 
                  : 'bg-secondary text-foreground hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Resending...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Resend Verification Email</span>
                </>
              )}
            </button>

            <Link
              to="/login"
              state={{ from }}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold
                bg-gradient-to-r from-blue-600 to-green-500 dark:from-[#3C12D4] dark:to-[#3C12D4] text-white hover:scale-[1.02] active:scale-[0.98]
                shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              <span>Go to Login</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-muted-foreground text-xs">
                Didn't receive the email? Check your spam folder or try a different email address.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── REGISTRATION FORM ─────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fadeIn relative">
      <Link 
        to="/" 
        className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 group z-50 bg-card/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm"
      >
        <Home size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm font-semibold tracking-tight">Back to Home</span>
      </Link>
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md my-8"
      >
        <div className="card shadow-2xl backdrop-blur-sm bg-card/90">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4"
            >
              <User size={32} />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Create Account
            </h1>
            <p className="text-muted-foreground mt-2">
              Join us to get started
            </p>
          </div>

          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl text-sm font-medium flex items-center">
                  <div className="mr-3 w-1.5 h-1.5 bg-error rounded-full" />
                  {serverError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="flex gap-4">
              <FormInput
                id="firstname"
                label="First Name"
                placeholder="John"
                error={errors.firstname?.message}
                {...register('firstname', { required: 'First name is required' })}
              />
              <FormInput
                id="lastname"
                label="Last Name"
                placeholder="Doe"
                error={errors.lastname?.message}
                {...register('lastname', { required: 'Last name is required' })}
              />
            </div>

            <FormInput
              id="email"
              label="Email Address"
              placeholder="name@example.com"
              icon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                }
              })}
            />



            <FormInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' }
              })}
            />

            <FormInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match'
              })}
            />

            <button
              type="submit"
              disabled={isSigningUp}
              className={`
                w-full mt-6 py-3.5 px-4 rounded-xl font-bold transition-all duration-300
                flex items-center justify-center gap-2
                ${isSigningUp
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70' 
                  : 'bg-gradient-to-r from-blue-600 to-green-500 dark:from-[#3C12D4] dark:to-[#3C12D4] text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20'
                }
              `}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              Already have an account?{' '}
              <Link 
                to="/login" 
                state={{ from }}
                className="text-primary font-bold hover:text-accent transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
