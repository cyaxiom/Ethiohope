import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  /** Show eye toggle for password fields */
  showPasswordToggle?: boolean;
  rightElement?: React.ReactNode;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      icon,
      className = '',
      id,
      type,
      showPasswordToggle = false,
      rightElement,
      ...props
    },
    ref
  ) => {
    const [revealed, setRevealed] = useState(false);
    const isPassword = type === 'password' || showPasswordToggle;
    const inputType = isPassword && showPasswordToggle ? (revealed ? 'text' : 'password') : type;
    const hasRight = Boolean(rightElement) || (isPassword && showPasswordToggle);

    return (
      <div className="w-full mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
        <div className="relative group">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={`
            w-full px-4 py-3 bg-[#070b16] border rounded-xl outline-none transition-all duration-200
            text-slate-100 placeholder:text-slate-600
            ${icon ? 'pl-11' : ''}
            ${hasRight ? 'pr-11' : ''}
            ${
              error
                ? 'border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                : 'border-white/10 hover:border-white/20 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/15'
            }
            ${className}
          `}
            {...props}
          />
          {isPassword && showPasswordToggle ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setRevealed((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
              aria-label={revealed ? 'Hide password' : 'Show password'}
            >
              {revealed ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          ) : (
            rightElement && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
            )
          )}
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-red-400">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
