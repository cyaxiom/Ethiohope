import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PendingApproval: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fadeIn">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-warning/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md my-8 text-center"
      >
        <div className="card shadow-2xl backdrop-blur-sm bg-card/90">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-warning/10 text-warning mb-6"
          >
            <Clock size={48} className="animate-pulse" />
          </motion.div>
          
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-4">
            Pending Approval
          </h1>
          <p className="text-muted-foreground mb-8 text-lg font-medium leading-relaxed">
            Your account is waiting for admin role assignment. 
            Once approved, you will be able to access the dashboard and features.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="btn-primary flex items-center justify-center w-full gap-2 mt-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Return to Login</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingApproval;
