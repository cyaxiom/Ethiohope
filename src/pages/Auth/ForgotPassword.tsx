import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Loader2, ArrowRight, KeyRound, CheckCircle2, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { useForgotPasswordMutation } from '../../features/auth/authApi';
import FormInput from '../../components/ui/FormInput';
import { getErrorMessage } from '../../lib/error-handler';

interface ForgotPasswordFormInputs {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    setServerError(null);
    try {
      await forgotPassword({ email: data.email.trim() }).unwrap();

      setIsSuccess(true);
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to send reset link.');
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fadeIn relative">
      <Link 
        to="/" 
        className="absolute top-4 left-4 flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-green-500 dark:from-[#3C12D4] dark:to-[#3C12D4] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50"
      >
        <Home size={18} />
        <span className="text-sm tracking-tight">Back to Home</span>
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
          
          {isSuccess ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success mb-6"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-4">
                Check Your Email
              </h1>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We've sent a password reset link to your email. Click the link to choose a new password.
              </p>
              <Link to="/login" className="btn-primary w-full inline-flex justify-center">
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4"
                >
                  <KeyRound size={32} />
                </motion.div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                  Forgot Password
                </h1>
                <p className="text-muted-foreground mt-2">
                  Enter your email to reset your password
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    w-full mt-6 py-3.5 px-4 rounded-xl font-bold transition-all duration-300
                    flex items-center justify-center gap-2
                    ${isLoading 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70' 
                      : 'bg-gradient-to-r from-blue-600 to-green-500 dark:from-[#3C12D4] dark:to-[#3C12D4] text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20'
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-border/50 text-center">
                <p className="text-muted-foreground text-sm font-medium">
                  Remember your password?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary font-bold hover:text-accent transition-colors"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

