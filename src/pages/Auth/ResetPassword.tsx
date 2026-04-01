import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, Loader2, ArrowRight, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { useResetPasswordMutation } from '../../features/auth/authApi';
import FormInput from '../../components/ui/FormInput';
import { getErrorMessage } from '../../lib/error-handler';

interface ResetPasswordFormInputs {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>();

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    if (!token) {
      toast.error('Invalid or missing reset token. Please request a new link.');
      return;
    }

    setServerError(null);
    try {
      await resetPassword({
        token,
        password: data.newPassword,
      }).unwrap();

      toast.success('Password reset successful', {
        icon: <Save className="text-success h-5 w-5" />,
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      const message = getErrorMessage(err, 'Failed to reset password.');
      setServerError(message);
      toast.error(message);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="card shadow-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-error mb-4">Invalid Link</h2>
          <p className="text-muted-foreground mb-6">
            The password reset link is invalid or missing the required token.
          </p>
          <button 
            onClick={() => navigate('/forgot-password')}
            className="btn-primary w-full"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fadeIn">
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
              <Lock size={32} />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Set New Password
            </h1>
            <p className="text-muted-foreground mt-2">
              Enter a strong password to secure your account
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
              id="newPassword"
              label="New Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.newPassword?.message}
              {...register('newPassword', { 
                required: 'New password is required',
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
                validate: (value) => value === newPassword || 'Passwords do not match'
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
                  : 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20'
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
