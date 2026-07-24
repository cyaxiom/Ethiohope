import React, { useState } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useRegenerateChildPinMutation } from '../../features/user/userApi';
import { toast } from 'sonner';

interface ChildCredentialsCardProps {
  childId: string;
  username: string;
  plainPin?: string | null;
  /** Prevent parent card click-through when used inside a clickable card */
  stopPropagation?: boolean;
  className?: string;
  onPinUpdated?: (plainPin: string) => void;
}

export const ChildCredentialsCard: React.FC<ChildCredentialsCardProps> = ({
  childId,
  username,
  plainPin,
  stopPropagation,
  className = '',
  onPinUpdated,
}) => {
  const [showPin, setShowPin] = useState(false);
  const [localPin, setLocalPin] = useState(plainPin || '');
  const [regeneratePin, { isLoading }] = useRegenerateChildPinMutation();

  React.useEffect(() => {
    setLocalPin(plainPin || '');
  }, [plainPin, childId]);

  const handleRegenerate = async (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    try {
      const res = await regeneratePin(childId).unwrap();
      const nextPin = res?.data?.plainPin || '';
      setLocalPin(nextPin);
      setShowPin(true);
      onPinUpdated?.(nextPin);
      toast.success(res?.message || 'New PIN generated. Also sent to your email.');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to generate new PIN');
    }
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      <div className="space-y-2 text-sm text-slate-700">
        <p>
          <span className="font-semibold text-slate-800">Username:</span>{' '}
          <span className="font-medium">{username}</span>
        </p>
        <div className="flex items-center gap-2">
          <p className="flex-1 min-w-0">
            <span className="font-semibold text-slate-800">Pin :</span>{' '}
            <span className="font-mono tracking-wider">
              {localPin ? (showPin ? localPin : '••••••') : 'Not available'}
            </span>
          </p>
          {localPin && (
            <button
              type="button"
              onClick={(e) => {
                if (stopPropagation) e.stopPropagation();
                setShowPin((v) => !v);
              }}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleRegenerate}
        disabled={isLoading}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm py-2.5 px-4 transition-colors disabled:opacity-60"
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        Generate New Pin
      </button>
    </div>
  );
};

export default ChildCredentialsCard;
