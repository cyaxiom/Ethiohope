import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Users, Phone, Globe, MapPin, Building2, Loader2, 
  CheckCircle2, ChevronRight, Heart, Baby, AlertTriangle, LogIn
} from 'lucide-react';
import { toast } from 'sonner';

import { useCompleteProfileMutation, CompleteProfilePayload } from '../../features/user/userApi';
import { updateUser, logout } from '../../features/auth/authSlice';
import { RootState } from '../../app/store';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const parentTypeOptions = [
  { value: 'mother', label: 'Mother', icon: <Heart size={20} />, description: 'I am the mother' },
  { value: 'father', label: 'Father', icon: <Users size={20} />, description: 'I am the father' },
  { value: 'guardian', label: 'Guardian', icon: <Users size={20} />, description: 'I am a legal guardian' },
  { value: 'other', label: 'Other', icon: <Users size={20} />, description: 'Other relationship' },
] as const;

const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [completeProfile, { isLoading }] = useCompleteProfileMutation();
  
  const [step, setStep] = useState<'intro' | 'form'>('intro');
  const [formData, setFormData] = useState<CompleteProfilePayload>({
    parentType: 'mother',
    phone: '',
    country: '',
    state: '',
    city: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    } else if (formData.country.trim().length < 2) {
      newErrors.country = 'Country must be at least 2 characters';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (formData.state.trim().length < 2) {
      newErrors.state = 'State must be at least 2 characters';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setServerError(null);
    setIsSessionExpired(false);

    if (!validate()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    // Check if user is authenticated
    if (!auth.token) {
      setServerError('You are not logged in. Please login first.');
      setIsSessionExpired(true);
      return;
    }

    try {
      const result = await completeProfile(formData).unwrap();
      
      // Update Redux store with new profile data and role codes from backend
      dispatch(updateUser({
        user: { isProfileComplete: true },
        roles: result.roleCodes || ['user', 'parent'],
      }));

      toast.success('Profile completed! You can now browse courses and manage children.', {
        duration: 4000,
      });
      onClose();
    } catch (err: any) {
      console.error('Complete profile error:', err);
      
      const status = err?.status;
      const message = err?.data?.message || '';
      
      if (status === 401) {
        setServerError('Your session has expired. Please log in again to continue.');
        setIsSessionExpired(true);
        toast.error('Session expired. Please log in again.');
      } else if (status === 400) {
        setServerError(message || 'Please check your input and try again.');
        toast.error(message || 'Invalid input. Please check the form.');
      } else if (status === 404) {
        setServerError('User not found. Please log in again.');
        setIsSessionExpired(true);
      } else {
        setServerError(message || 'Something went wrong. Please try again later.');
        toast.error(message || 'Failed to complete profile.');
      }
    }
  };

  const handleReLogin = () => {
    dispatch(logout());
    onClose();
    navigate('/login');
  };

  const handleChange = (field: keyof CompleteProfilePayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    // Clear server error when user starts editing
    if (serverError) setServerError(null);
  };

  // Reset state when modal closes
  const handleClose = () => {
    setStep('intro');
    setErrors({});
    setServerError(null);
    setIsSessionExpired(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-[10000] p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  {step === 'intro' ? 'Add Profile' : 'Complete Your Profile'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {/* INTRO STEP */}
                {step === 'intro' && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-6"
                  >
                    {/* Hero section */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                        <Baby size={36} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Become a Parent
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Register as a parent to enroll your children in our amazing summer courses, 
                        track their progress, and manage their learning journey.
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                      {[
                        { icon: <CheckCircle2 size={16} className="text-green-500" />, text: 'Enroll your children in summer courses' },
                        { icon: <CheckCircle2 size={16} className="text-green-500" />, text: 'Track learning progress and achievements' },
                        { icon: <CheckCircle2 size={16} className="text-green-500" />, text: 'Manage multiple children profiles' },
                        { icon: <CheckCircle2 size={16} className="text-green-500" />, text: 'Access parent-exclusive resources' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl">
                          {item.icon}
                          <span className="text-sm text-gray-700 font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep('form')}
                      className="w-full py-3.5 px-4 rounded-xl font-bold bg-blue-600 text-white 
                        hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300
                        shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                      <span>Continue as Parent</span>
                      <ChevronRight size={18} />
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      More profile types coming soon (instructor, student, etc.)
                    </p>
                  </motion.div>
                )}

                {/* FORM STEP */}
                {step === 'form' && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 space-y-5"
                  >
                    {/* Server Error Banner */}
                    <AnimatePresence>
                      {serverError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium border
                            ${isSessionExpired 
                              ? 'bg-red-50 border-red-200 text-red-700' 
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                            }`
                          }>
                            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p>{serverError}</p>
                              {isSessionExpired && (
                                <button
                                  onClick={handleReLogin}
                                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  <LogIn size={14} />
                                  Go to Login
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Parent Type Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        I am a...
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {parentTypeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleChange('parentType', opt.value)}
                            className={`
                              flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold
                              ${formData.parentType === opt.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                              }
                            `}
                          >
                            {opt.icon}
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.phone ? 'text-red-400' : 'text-gray-400'}`} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none text-sm transition-all
                            ${errors.phone 
                              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/30' 
                              : 'border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}
                          `}
                        />
                      </div>
                      {errors.phone && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1.5 ml-1 font-medium">
                          {errors.phone}
                        </motion.p>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                        Country <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Globe size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.country ? 'text-red-400' : 'text-gray-400'}`} />
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => handleChange('country', e.target.value)}
                          placeholder="e.g., United States"
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none text-sm transition-all
                            ${errors.country 
                              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/30' 
                              : 'border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}
                          `}
                        />
                      </div>
                      {errors.country && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1.5 ml-1 font-medium">
                          {errors.country}
                        </motion.p>
                      )}
                    </div>

                    {/* State + City in a row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                          State <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <MapPin size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.state ? 'text-red-400' : 'text-gray-400'}`} />
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            placeholder="e.g., Texas"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none text-sm transition-all
                              ${errors.state 
                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/30' 
                                : 'border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}
                            `}
                          />
                        </div>
                        {errors.state && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1.5 ml-1 font-medium">
                            {errors.state}
                          </motion.p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                          City <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Building2 size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.city ? 'text-red-400' : 'text-gray-400'}`} />
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            placeholder="e.g., Dallas"
                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none text-sm transition-all
                              ${errors.city 
                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/30' 
                                : 'border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}
                            `}
                          />
                        </div>
                        {errors.city && (
                          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1.5 ml-1 font-medium">
                            {errors.city}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Validation summary (shows count of errors) */}
                    {Object.keys(errors).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl"
                      >
                        <AlertTriangle size={14} className="text-red-500 shrink-0" />
                        <p className="text-xs text-red-600 font-medium">
                          Please fix {Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'error' : 'errors'} above to continue
                        </p>
                      </motion.div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => { setStep('intro'); setErrors({}); setServerError(null); }}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 
                          hover:bg-gray-200 transition-all text-sm"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading || isSessionExpired}
                        className={`
                          flex-[2] py-3 px-4 rounded-xl font-bold transition-all duration-300
                          flex items-center justify-center gap-2 text-sm
                          ${isLoading || isSessionExpired
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-600/20'
                          }
                        `}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Completing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Complete Profile</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CompleteProfileModal;
