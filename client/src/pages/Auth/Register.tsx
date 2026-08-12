import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Loader2, ArrowLeft, ShieldCheck, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { useSignupMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import FormInput from '../../components/ui/FormInput';
import { getErrorMessage } from '../../lib/error-handler';

interface RegisterFormInputs {
  firstname: string;
  lastname: string;
  email: string;
  phoneLocal: string;
  password: string;
}

/** Curated dial codes — US default for EthioHope parents abroad */
const DIAL_OPTIONS = [
  { id: 'us', code: '+1', label: 'US +1' },
  { id: 'ca', code: '+1', label: 'CA +1' },
  { id: 'et', code: '+251', label: 'ET +251' },
  { id: 'gb', code: '+44', label: 'UK +44' },
  { id: 'ae', code: '+971', label: 'AE +971' },
  { id: 'de', code: '+49', label: 'DE +49' },
  { id: 'fr', code: '+33', label: 'FR +33' },
  { id: 'nl', code: '+31', label: 'NL +31' },
  { id: 'au', code: '+61', label: 'AU +61' },
  { id: 'in', code: '+91', label: 'IN +91' },
] as const;

const digitsOnly = (value: string) => value.replace(/\D/g, '');

/** Build E.164-style phone: +1 + 10 digits → +12025551234 */
const buildE164 = (dialCode: string, local: string): string => {
  const localDigits = digitsOnly(local);
  const dialDigits = digitsOnly(dialCode);
  return `+${dialDigits}${localDigits}`;
};

const Register: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [dialOptionId, setDialOptionId] = useState<string>('us');
  const dialCode = DIAL_OPTIONS.find((d) => d.id === dialOptionId)?.code || '+1';
  const isNorthAmerica = dialCode === '+1';

  const from = location.state?.from || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      phoneLocal: '',
      password: '',
    },
  });

  const phoneLocalField = register('phoneLocal', {
    required: 'Phone number is required',
    validate: (value) => {
      const digits = digitsOnly(value);
      if (isNorthAmerica) {
        return digits.length === 10 || 'Enter a 10-digit US/Canada number';
      }
      return (digits.length >= 7 && digits.length <= 15) || 'Enter a valid phone number';
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setServerError(null);
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const phone = buildE164(dialCode, data.phoneLocal);

      const result = await signup({
        firstname: data.firstname.trim(),
        lastname: data.lastname.trim(),
        email: cleanEmail,
        password: data.password,
        phone,
      }).unwrap();

      dispatch(
        setCredentials({
          token: result.token,
          user: result.user,
          roles: result.roles,
          permissions: result.permissions,
          rememberMe: true,
        })
      );

      toast.success('Account created successfully! Redirecting...', {
        icon: <ShieldCheck className="text-emerald-400 h-5 w-5" />,
        duration: 3000,
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

      navigate(targetUrl, { replace: true });
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to register account.');
      setServerError(message);
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
          <Link to="/" className="inline-flex items-center gap-3 group">
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
            Get started
          </p>
          <h2 className="text-3xl xl:text-4xl font-semibold text-white leading-tight mb-4 tracking-tight">
            Build skills that shape the future
          </h2>
          <p className="text-slate-400 leading-relaxed text-[15px]">
            Create your account to enroll in programs, manage learning schedules, and track progress — all in one place.
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
          className="w-full max-w-[440px] mx-auto"
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
              Create your account
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-[15px]">
              Enter your details below to get started.
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
                  <p>{serverError}</p>
                  {serverError.toLowerCase().includes('already registered') && (
                    <div className="mt-2 pt-2 border-t border-red-500/15 flex gap-4 text-xs font-medium">
                      <Link to="/login" className="text-blue-400 hover:text-blue-300">
                        Go to Login
                      </Link>
                      <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300">
                        Forgot password?
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
              <FormInput
                id="firstname"
                label="First name"
                placeholder="John"
                autoComplete="given-name"
                error={errors.firstname?.message}
                {...register('firstname', { required: 'First name is required' })}
              />
              <FormInput
                id="lastname"
                label="Last name"
                placeholder="Doe"
                autoComplete="family-name"
                error={errors.lastname?.message}
                {...register('lastname', { required: 'Last name is required' })}
              />
            </div>

            <FormInput
              id="email"
              label="Email address"
              placeholder="name@example.com"
              autoComplete="email"
              icon={<Mail size={17} />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Enter a valid email address',
                },
                onBlur: (e) => {
                  setValue('email', e.target.value.trim().toLowerCase(), { shouldValidate: true });
                },
              })}
            />

            <div className="w-full mb-4">
              <label htmlFor="phoneLocal" className="block text-sm font-medium text-slate-300 mb-2">
                Phone number
              </label>
              <div
                className={`flex rounded-xl border overflow-hidden transition-all ${errors.phoneLocal
                    ? 'border-red-500/60 focus-within:ring-2 focus-within:ring-red-500/20'
                    : 'border-white/10 hover:border-white/20 focus-within:border-blue-500/60 focus-within:ring-2 focus-within:ring-blue-500/15'
                  }`}
              >
                <div className="relative flex-shrink-0 bg-[#0a1220] border-r border-white/10">
                  <Phone
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />
                  <select
                    value={dialOptionId}
                    onChange={(e) => setDialOptionId(e.target.value)}
                    aria-label="Country code"
                    className="h-full appearance-none bg-transparent text-slate-200 text-sm pl-9 pr-7 py-3 outline-none cursor-pointer min-w-[7.5rem]"
                  >
                    {DIAL_OPTIONS.map((d) => (
                      <option key={d.id} value={d.id} className="bg-[#0b1224] text-slate-100">
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  id="phoneLocal"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder={isNorthAmerica ? '5551234567' : 'Phone number'}
                  className="flex-1 min-w-0 px-3.5 py-3 bg-[#070b16] text-slate-100 placeholder:text-slate-600 outline-none"
                  {...phoneLocalField}
                  onChange={(e) => {
                    e.target.value = digitsOnly(e.target.value);
                    phoneLocalField.onChange(e);
                  }}
                />
              </div>
              {errors.phoneLocal && (
                <p className="mt-1.5 text-xs font-medium text-red-400">{errors.phoneLocal.message}</p>
              )}
              {/* <p className="mt-1.5 text-[11px] text-slate-500">
                Default is US (+1). Change the country code if needed.
              </p> */}
            </div>

            <FormInput
              id="password"
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              icon={<Lock size={17} />}
              showPasswordToggle
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' },
              })}
            />

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full mt-4 py-3.5 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              state={{ from }}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Register;
