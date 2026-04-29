import React, { useRef, useEffect } from 'react';

interface DropdownItem {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  destructive?: boolean;
  badge?: string | number;
}

interface DropdownProps {
  items: (DropdownItem | false | null | undefined)[];
  onClose: () => void;
  width?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ items, onClose, width = 'w-56' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOut_ = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', clickOut_);
    return () => {
      document.removeEventListener('mousedown', clickOut_);
    };
  }, [onClose]);

  const filteredItems = items.filter(Boolean) as DropdownItem[];

  return (
    <div
      ref={modalRef}
      onClick={(e) => e.stopPropagation()}
      className={`${width} bg-card border border-border rounded-xl shadow-xl z-30 p-1 py-2
      animate-in fade-in zoom-in duration-150 text-foreground`}
    >
      {filteredItems.map((item, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            item.onClick?.();
            onClose();
          }}
          className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm
            hover:bg-muted rounded-lg transition-colors text-left
            ${item.destructive ? 'text-error' : 'text-foreground'}`}
        >
          <div className="flex items-center gap-3">
            {item.icon && <span className="opacity-70">{item.icon}</span>}
            {item.label}
          </div>

          {item.badge !== undefined && (
            <span
              className="h-5 min-w-[1.25rem] flex items-center justify-center
              px-1.5 rounded-full bg-primary text-primary-foreground
              text-[10px] font-bold"
            >
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Dropdown;
