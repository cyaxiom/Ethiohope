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
import { setCredentials, logout } from '../../features/auth/authSlice';
import { RootState } from '../../app/store';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'intro' | 'form';

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
  
  const [step, setStep] = useState<Step>('intro');
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

  // Auto-fill phone if user already has it
  useEffect(() => {
    if (auth.user?.phone && !formData.phone) {
      setFormData(prev => ({ ...prev, phone: auth.user!.phone! }));
    }
  }, [auth.user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const textRegex = /[a-zA-Z]/; // Must contain at least one letter
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (e.g., +1...)';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    } else if (!textRegex.test(formData.country)) {
      newErrors.country = 'Country name must contain letters';
    } else if (formData.country.length < 2) {
      newErrors.country = 'Country name is too short';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (!textRegex.test(formData.state)) {
      newErrors.state = 'State name must contain letters';
    } else if (formData.state.length < 2) {
      newErrors.state = 'State name is too short';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (!textRegex.test(formData.city)) {
      newErrors.city = 'City name must contain letters';
    } else if (formData.city.length < 2) {
      newErrors.city = 'City name is too short';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setServerError(null);
    if (!validateForm()) {
      toast.error('Please correct the errors before finishing.');
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
      
      dispatch(setCredentials({
        user: { ...auth.user, ...result.user, isProfileComplete: true, phone: formData.phone, phoneVerified: true },
        token: result.token,
        roles: result.roleCodes,
        permissions: result.permissions
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
            className="fixed inset-0 flex items-center justify-center z-[10000] p-4 pointer-events-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-gray-100">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    {step === 'intro' ? 'Step 1: Welcome' : 'Final Step: Profile'}
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
                        onClick={() => setStep('form')}
                        className="w-full py-4 px-6 rounded-2xl font-black bg-gray-900 text-white hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-95 group"
                      >
                        <span>Let's Get Started</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 2: FORM */}
                  {step === 'form' && (
                    <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 mb-4">
                         <div className="flex gap-4 items-start">
                           <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                             <Phone size={24} />
                           </div>
                           <div>
                             <h4 className="font-black text-blue-900">Contact Details</h4>
                             <p className="text-blue-700/70 text-xs mt-1 font-bold">Please provide your phone and location to get started.</p>
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
                              placeholder="+1 (555) 000-0000"
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold transition-all"
                            />
                          </div>
                          {errors.phone && <p className="text-xs text-red-500 mt-2 font-bold ml-1">{errors.phone}</p>}
                        </div>

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
                            <input value={formData.country} onChange={(e) => handleChange('country', e.target.value)} placeholder="United States" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold" />
                          </div>
                          {errors.country && <p className="text-xs text-red-500 mt-1 font-bold ml-1">{errors.country}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2 ml-1">State/Region</label>
                            <div className="relative group">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                              <input value={formData.state} onChange={(e) => handleChange('state', e.target.value)} placeholder="Texas" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold" />
                            </div>
                            {errors.state && <p className="text-xs text-red-500 mt-1 font-bold ml-1">{errors.state}</p>}
                          </div>
                          <div>
                            <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2 ml-1">City</label>
                            <div className="relative group">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                              <input value={formData.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="Dallas" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold" />
                            </div>
                            {errors.city && <p className="text-xs text-red-500 mt-1 font-bold ml-1">{errors.city}</p>}
                          </div>
                        </div>

                        {serverError && (
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
                            <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                            <p className="text-xs text-amber-700 font-bold">{serverError}</p>
                          </div>
                        )}

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
