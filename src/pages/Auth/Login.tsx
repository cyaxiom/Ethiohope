import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { useLoginMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import FormInput from '../../components/ui/FormInput';
import { getErrorMessage } from '../../lib/error-handler';

interface LoginFormInputs {
  emailOrUsername: string;
  passwordOrPin: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormInputs>({
    defaultValues: {
      emailOrUsername: '',
      passwordOrPin: '',
    },
  });

  const emailOrUsername = watch('emailOrUsername');
  // Simple check for child user vs adult: 
  // If it's an email format, we assume email/password, otherwise username/PIN
  const isEmail = emailOrUsername.includes('@');

  const onSubmit = async (data: LoginFormInputs) => {
    setServerError(null);
    try {
      // Backend expects { identifier, password }
      const credentials = {
        identifier: data.emailOrUsername.trim(),
        password: data.passwordOrPin.trim(),
      };

      const result = await login(credentials).unwrap();
      
      // Success logic:
      // Dispatch setCredentials with token and user (roles/permissions included in userResponse)
      dispatch(
        setCredentials({
          token: result.token,
          user: result.user,
          roles: result.roles,
          permissions: result.permissions,
        })
      );

      // Success message
      toast.success('Login successful! Redirecting...', {
        icon: <ShieldCheck className="text-success h-5 w-5" />,
      });

      // Then redirect using: navigate(redirectTo)
      setTimeout(() => {
        navigate(result.redirectTo || '/dashboard');
      }, 1000);

    } catch (err: any) {
      const message = getErrorMessage(err, 'Failed to login. Please check your credentials.');
      setServerError(message);
      toast.error(message);
    }
  };

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
        className="w-full max-w-md"
      >
        <div className="card shadow-2xl backdrop-blur-sm bg-card/90">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4"
            >
              <ShieldCheck size={32} />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-2">
              Login to your account to continue
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
            <FormInput
              id="emailOrUsername"
              label={isEmail ? "Email Address" : "Username"}
              placeholder={isEmail ? "name@example.com" : "Enter your username"}
              icon={isEmail ? <Mail size={18} /> : <User size={18} />}
              error={errors.emailOrUsername?.message}
              {...register('emailOrUsername', { 
                required: 'Email or username is required',
              })}
            />

            <FormInput
              id="passwordOrPin"
              label={isEmail ? "Password" : "PIN code"}
              type={isEmail ? "password" : "password"} // Keep password type for security hide
              placeholder={isEmail ? "••••••••" : "••••"}
              icon={<Lock size={18} />}
              error={errors.passwordOrPin?.message}
              {...register('passwordOrPin', { 
                required: isEmail ? 'Password is required' : 'PIN is required',
                minLength: {
                  value: isEmail ? 6 : 4,
                  message: isEmail ? 'Password must be at least 6 characters' : 'PIN must be at least 4 digits'
                }
              })}
            />

            <div className="flex items-center justify-between py-1 px-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border bg-background rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground cursor-pointer select-none font-medium">
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm font-semibold text-primary hover:text-accent transition-colors underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

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
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary font-bold hover:text-accent transition-colors"
                id="goToRegister"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
