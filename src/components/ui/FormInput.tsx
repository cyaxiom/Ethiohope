import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-muted-foreground mb-1.5 ml-1"
      >
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`
            w-full px-4 py-3 bg-secondary/50 border-2 rounded-xl outline-none transition-all duration-200
            placeholder:text-muted-foreground/60
            ${icon ? 'pl-11' : ''}
            ${
              error
                ? 'border-error/50 focus:border-error focus:ring-4 focus:ring-error/10'
                : 'border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 ml-1 text-xs font-medium text-error animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
