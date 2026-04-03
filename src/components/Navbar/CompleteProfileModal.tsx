import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Users, Phone, Globe, MapPin, Building2, Loader2, 
  CheckCircle2, ChevronRight, Heart, Baby, AlertTriangle, LogIn,
  ShieldCheck, RefreshCw, Smartphone
} from 'lucide-react';
import { toast } from 'sonner';

import { useCompleteProfileMutation, CompleteProfilePayload } from '../../features/user/userApi';
import { useSendOtpMutation, useVerifyOtpMutation } from '../../features/auth/authApi';
import { updateUser, logout } from '../../features/auth/authSlice';
import { RootState } from '../../app/store';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'intro' | 'phone' | 'otp' | 'form';

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
  
  const [completeProfile, { isLoading: isCompleting }] = useCompleteProfileMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  
  const [step, setStep] = useState<Step>('intro');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [formData, setFormData] = useState<CompleteProfilePayload & { otp: string }>({
    parentType: 'mother',
    phone: '',
    otp: '',
    country: '',
    state: '',
    city: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Auto-fill phone if user already has it (though unlikely if unverified)
  useEffect(() => {
    if (auth.user?.phone && !formData.phone) {
      setFormData(prev => ({ ...prev, phone: auth.user!.phone! }));
    }
  }, [auth.user]);

  const validatePhone = (): boolean => {
    if (!formData.phone.trim()) {
      setErrors({ phone: 'Phone number is required' });
      return false;
    }
    // Basic E.164-ish regex
    if (!/^\+?[\d\s\-\(\)]{10,20}$/.test(formData.phone.trim())) {
      setErrors({ phone: 'Please enter a valid international phone number (e.g., +251...)' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSendOtp = async () => {
    if (!validatePhone()) return;
    setServerError(null);
    try {
      await sendOtp({ phone: formData.phone.trim() }).unwrap();
      toast.success('Verification code sent to ' + formData.phone);
      setStep('otp');
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to send OTP. Please check the number.';
      setServerError(msg);
      toast.error(msg);
    }
  };

  const handleVerifyOtp = async () => {
    if (formData.otp.length < 4) {
      setErrors({ otp: 'Code must be at least 4 digits' });
      return;
    }
    setServerError(null);
    try {
      await verifyOtp({ phone: formData.phone.trim(), otp: formData.otp.trim() }).unwrap();
      toast.success('Phone verified successfully!');
      setIsPhoneVerified(true);
      setStep('form');
    } catch (err: any) {
      const msg = err?.data?.message || 'Invalid or expired code.';
      setServerError(msg);
      toast.error(msg);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setServerError(null);
    if (!validateForm()) {
      toast.error('Please fill in all location details.');
      return;
    }

    try {
      const result = await completeProfile({
        parentType: formData.parentType,
        phone: formData.phone,
        country: formData.country,
        state: formData.state,
        city: formData.city,
      }).unwrap();
      
      dispatch(updateUser({
        user: { isProfileComplete: true, phone: formData.phone, phoneVerified: true },
        roles: result.roleCodes || ['user', 'parent'],
      }));

      toast.success('Profile completed successfully!', { duration: 4000 });
      onClose();
    } catch (err: any) {
      const status = err?.status;
      const message = err?.data?.message || 'Something went wrong.';
      
      if (status === 401) {
        setServerError('Session expired. Please log in again.');
        setIsSessionExpired(true);
      } else {
        setServerError(message);
        toast.error(message);
      }
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete (next as any)[field];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleClose = () => {
    setStep('intro');
    setErrors({});
    setServerError(null);
    setIsPhoneVerified(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[10000] p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto border border-gray-100">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    {step === 'intro' ? 'Step 1: Welcome' : step === 'phone' ? 'Step 2: Security' : step === 'otp' ? 'Step 3: Verification' : 'Final Step: Profile'}
                  </h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                    Complete your parent profile
                  </p>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-2xl transition-all">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {/* STEP 1: INTRO */}
                  {step === 'intro' && (
                    <motion.div key="intro" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="text-center py-4">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-blue-200 rotate-3 hover:rotate-0 transition-transform duration-500">
                          <Baby size={44} className="text-white" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-3 underline decoration-blue-500 decoration-4 underline-offset-4">
                          Become an EthioHope Parent
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto font-medium">
                          Join our community to empower your children with cutting-edge digital skills this summer.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {[
                          { icon: <CheckCircle2 className="text-emerald-500" />, text: 'Register multiple children profiles' },
                          { icon: <CheckCircle2 className="text-emerald-500" />, text: 'Track learning milestones in real-time' },
                          { icon: <CheckCircle2 className="text-emerald-500" />, text: 'Direct communication with instructors' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                            <div className="bg-white p-2 rounded-xl shadow-sm">{item.icon}</div>
                            <span className="text-sm text-gray-700 font-bold">{item.text}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setStep('phone')}
                        className="w-full py-4 px-6 rounded-2xl font-black bg-gray-900 text-white hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-95 group"
                      >
                        <span>Let's Get Started</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 2: PHONE */}
                  {step === 'phone' && (
                    <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
                        <div className="flex gap-4 items-start">
                          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                            <ShieldCheck size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-blue-900">Phone Verification</h4>
                            <p className="text-blue-700/70 text-xs mt-1 font-bold">We'll send a 6-digit code via SMS to secure your account.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Phone Number</label>
                          <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              placeholder="+251 911 123 456"
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold transition-all"
                            />
                          </div>
                          {errors.phone && <p className="text-xs text-red-500 mt-2 font-bold ml-1">{errors.phone}</p>}
                        </div>

                        {serverError && (
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
                            <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                            <p className="text-xs text-amber-700 font-bold">{serverError}</p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button onClick={() => setStep('intro')} className="flex-1 py-4 px-6 rounded-2xl font-black text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all text-sm">
                            Back
                          </button>
                          <button
                            onClick={handleSendOtp}
                            disabled={isSendingOtp}
                            className="flex-[2] py-4 px-6 rounded-2xl font-black bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isSendingOtp ? <Loader2 size={20} className="animate-spin" /> : <span>Send Code</span>}
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: OTP */}
                  {step === 'otp' && (
                    <motion.div key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-white shadow-xl">
                          <Smartphone size={32} className="text-indigo-600" />
                        </div>
                        <h4 className="text-xl font-black text-gray-900">Verify it's you</h4>
                        <p className="text-gray-500 text-sm font-bold mt-1">We sent a code to <span className="text-indigo-600">{formData.phone}</span></p>
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={6}
                            value={formData.otp}
                            onChange={(e) => handleChange('otp', e.target.value.replace(/\D/g, ''))}
                            placeholder="· · · · · ·"
                            className="w-full text-center py-5 bg-gray-50 border-4 border-transparent focus:border-indigo-600 rounded-[2rem] outline-none text-4xl font-black tracking-[1rem] transition-all placeholder:tracking-normal placeholder:text-gray-300"
                          />
                        </div>
                        
                        {errors.otp && <p className="text-xs text-red-500 font-bold text-center">{errors.otp}</p>}
                        {serverError && <p className="text-xs text-red-500 font-bold text-center">{serverError}</p>}

                        <div className="flex flex-col gap-3 pt-2">
                          <button
                            onClick={handleVerifyOtp}
                            disabled={isVerifyingOtp || formData.otp.length < 4}
                            className="w-full py-5 rounded-[2rem] font-black bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                          >
                            {isVerifyingOtp ? <Loader2 size={24} className="animate-spin" /> : <><ShieldCheck size={20} /> <span>Verify & Continue</span></>}
                          </button>
                          
                          <div className="flex justify-between items-center px-4">
                            <button onClick={() => setStep('phone')} className="text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors">Change Number</button>
                            <button onClick={handleSendOtp} disabled={isSendingOtp} className="flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest disabled:opacity-50 transition-colors">
                              <RefreshCw size={14} className={isSendingOtp ? 'animate-spin' : ''} />
                              Resend Code
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: FORM */}
                  {step === 'form' && (
                    <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                        <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-200">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <p className="text-emerald-800 font-black text-xs italic">Phone Verified!</p>
                          <p className="text-emerald-700/60 text-[10px] font-bold">Now let's complete your location details.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2 ml-1">Relationship</label>
                          <div className="grid grid-cols-2 gap-3">
                            {parentTypeOptions.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleChange('parentType', opt.value)}
                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold text-sm ${formData.parentType === opt.value ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md' : 'border-gray-50 text-gray-400 hover:border-gray-100'}`}
                              >
                                {opt.icon} <span>{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2 ml-1">Country</label>
                          <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                            <input value={formData.country} onChange={(e) => handleChange('country', e.target.value)} placeholder="Ethiopia" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2 ml-1">State/Region</label>
                            <div className="relative group">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                              <input value={formData.state} onChange={(e) => handleChange('state', e.target.value)} placeholder="Addis Ababa" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2 ml-1">City</label>
                            <div className="relative group">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                              <input value={formData.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="Bole" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold" />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleSubmit}
                          disabled={isCompleting}
                          className="w-full py-5 rounded-[2rem] font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                          {isCompleting ? <Loader2 size={24} className="animate-spin" /> : <><CheckCircle2 size={20} /> <span>Finish Setup</span></>}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CompleteProfileModal;
