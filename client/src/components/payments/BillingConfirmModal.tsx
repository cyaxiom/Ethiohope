import React from 'react';
import { Ban, RefreshCw, X, AlertTriangle } from 'lucide-react';

export type BillingAction = 'cancel' | 'resume';

interface BillingConfirmModalProps {
  isOpen: boolean;
  action: BillingAction;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const BillingConfirmModal: React.FC<BillingConfirmModalProps> = ({
  isOpen,
  action,
  title,
  subtitle,
  isLoading,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const isCancel = action === 'cancel';

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isCancel ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {isCancel ? <Ban className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {title || (isCancel ? 'Stop monthly billing?' : 'Resume monthly billing?')}
              </h3>
              {subtitle && <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-3">
          {isCancel ? (
            <>
              <p className="text-sm text-gray-600 leading-relaxed">
                Charging will end after the <span className="font-semibold text-gray-800">current billing period</span>.
                Learning access continues until then.
              </p>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  You can resume monthly billing anytime before the period ends if you change your mind.
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed">
              Monthly charges will continue as usual for this tutoring package. The scheduled stop will be removed.
            </p>
          )}
        </div>

        <div className="px-5 pb-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Keep as is
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2 ${
              isCancel
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isCancel ? (
              <>
                <Ban className="w-4 h-4" />
                Stop billing
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Resume billing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingConfirmModal;
