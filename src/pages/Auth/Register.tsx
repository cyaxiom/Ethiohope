import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Mail, Lock, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { useSignupMutation, useLoginMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const isLoading = isSigningUp || isLoggingIn;

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
      // 1. Sign up the user
      await signup({
        firstname: data.firstname.trim(),
        lastname: data.lastname.trim(),
        email: data.email.trim(),
        password: data.password,
      }).unwrap();

      // 2. Automatically log them in
      const loginResult = await login({
        identifier: data.email.trim(),
        password: data.password,
      }).unwrap();

      // 3. Update Redux store with auth info so Navbar renders Profile Icon
      dispatch(
        setCredentials({
          user: loginResult.user,
          token: loginResult.token,
          roles: loginResult.roles || [],
          permissions: loginResult.permissions || [],
        })
      );
      localStorage.setItem('token', loginResult.token);

      toast.success('Account created successfully!', {
        icon: <ShieldCheck className="text-success h-5 w-5" />,
        duration: 3000,
      });

      // 4. Navigate back to Home
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to register account.');
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
