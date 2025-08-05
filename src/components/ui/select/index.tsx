import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { createPortal } from "react-dom";
import { RiArrowDownSLine, RiCheckLine } from 'react-icons/ri';

// Simple utility function to merge classes
function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

// Portal component for rendering outside DOM tree
const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  
  return createPortal(children, document.body);
};

// Select Context
interface SelectContextType {
  open: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  triggerRect: DOMRect | null;
  setTriggerRect: (rect: DOMRect | null) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select");
  }
  return context;
};

// Main Select component
interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Select: React.FC<SelectProps> = ({
  children,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setUncontrolledValue(newValue);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setUncontrolledOpen(newOpen);
    }
  };

  return (
    <SelectContext.Provider value={{
      open,
      value,
      onValueChange: handleValueChange,
      onOpenChange: handleOpenChange,
      triggerRect,
      setTriggerRect,
    }}>
      {children}
    </SelectContext.Provider>
  );
};

// Select Trigger
interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  className,
  placeholder = "Select an option...",
}) => {
  const { open, value, onOpenChange, setTriggerRect } = useSelect();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTriggerRect(rect);
    }
    onOpenChange(!open);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setTriggerRect(rect);
      }
      onOpenChange(!open);
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "tw-flex tw-h-10 tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-3 tw-py-2 tw-text-sm",
        "placeholder:tw-text-gray-500 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2",
        "disabled:tw-cursor-not-allowed disabled:tw-opacity-50",
        open && "tw-ring-2 tw-ring-blue-500 tw-ring-offset-2",
        className
      )}
      aria-expanded={open}
      aria-haspopup="listbox"
    >
      <span className={cn("tw-truncate", !value && "tw-text-gray-500")}>
        {children || placeholder}
      </span>
      <RiArrowDownSLine 
        className={cn(
          "tw-h-4 tw-w-4 tw-opacity-50 tw-transition-transform tw-duration-200",
          open && "tw-rotate-180"
        )} 
      />
    </button>
  );
};

// Select Value
interface SelectValueProps {
  placeholder?: string;
  className?: string;
  children?: React.ReactNode | string;
}

export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder = "Select an option...",
  className,
  children,
}) => {
  const { value } = useSelect();

  return (
    <span className={cn("tw-truncate", !value && "tw-text-gray-500", className)}>
      {children || placeholder}
    </span>
  );
};

// Select Content - IMPROVED POSITIONING AND Z-INDEX
interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectContent: React.FC<SelectContentProps> = ({
  children,
  className,
}) => {
  const { open, onOpenChange, triggerRect } = useSelect();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        // Check if click is on trigger
        const triggers = document.querySelectorAll('[aria-expanded="true"]');
        let clickedOnTrigger = false;
        triggers.forEach(trigger => {
          if (trigger.contains(event.target as Node)) {
            clickedOnTrigger = true;
          }
        });
        
        if (!clickedOnTrigger) {
          onOpenChange(false);
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    const handleScroll = () => {
      onOpenChange(false);
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open, onOpenChange]);

  if (!open || !triggerRect) return null;

  // Calculate position with viewport awareness
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const dropdownHeight = Math.min(384, spaceBelow > 200 ? spaceBelow - 20 : spaceAbove - 20);
  
  // Position above if not enough space below
  const shouldPositionAbove = spaceBelow < 200 && spaceAbove > spaceBelow;
  
  let top: number;
  if (shouldPositionAbove) {
    top = triggerRect.top + window.scrollY - dropdownHeight - 4;
  } else {
    top = triggerRect.bottom + window.scrollY + 4;
  }
  
  let left = triggerRect.left + window.scrollX;
  const width = Math.max(triggerRect.width, 200);
  
  // Ensure dropdown doesn't go off screen horizontally
  if (left + width > viewportWidth) {
    left = viewportWidth - width - 10;
  }
  if (left < 10) {
    left = 10;
  }

  return (
    <Portal>
      <div
        ref={contentRef}
        className={cn(
          // VERY HIGH Z-INDEX and ensure it's above everything
          "tw-fixed tw-overflow-hidden tw-rounded-md tw-border tw-border-gray-200 tw-bg-white tw-text-gray-950 tw-shadow-2xl",
          // Remove problematic animations that might cause rendering issues
          className
        )}
        style={{
          top: `${top}px`,
          left: `${left}px`,
          minWidth: `${width}px`,
          maxHeight: `${dropdownHeight}px`,
          zIndex: 999999, // Extremely high z-index
          // Ensure it's rendered above everything
          position: 'fixed',
          pointerEvents: 'auto',
        }}
        role="listbox"
      >
        <div 
          className="tw-overflow-auto tw-p-1" 
          style={{ maxHeight: `${dropdownHeight - 2}px` }}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};

// Select Item
interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

export const SelectItem: React.FC<SelectItemProps> = ({
  children,
  value: itemValue,
  className,
  disabled = false,
}) => {
  const { value, onValueChange, onOpenChange } = useSelect();
  const isSelected = value === itemValue;

  const handleClick = () => {
    if (!disabled) {
      onValueChange(itemValue);
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onValueChange(itemValue);
      onOpenChange(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "tw-relative tw-flex tw-w-full tw-cursor-default tw-select-none tw-items-center tw-rounded-sm tw-py-2 tw-pl-8 tw-pr-2 tw-text-sm tw-outline-none",
        "focus:tw-bg-gray-100 focus:tw-text-gray-900",
        disabled 
          ? "tw-pointer-events-none tw-opacity-50"
          : "hover:tw-bg-gray-100 hover:tw-text-gray-900 tw-cursor-pointer",
        isSelected && "tw-bg-gray-100",
        className
      )}
      role="option"
      aria-selected={isSelected}
      tabIndex={disabled ? -1 : 0}
    >
      <span className="tw-absolute tw-left-2 tw-flex tw-h-3.5 tw-w-3.5 tw-items-center tw-justify-center">
        {isSelected && <RiCheckLine className="tw-h-4 tw-w-4 tw-text-blue-600" />}
      </span>
      <span className="tw-truncate">{children}</span>
    </div>
  );
};

// Select Label
interface SelectLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectLabel: React.FC<SelectLabelProps> = ({ children, className }) => (
  <div
    className={cn(
      "tw-py-1.5 tw-pl-8 tw-pr-2 tw-text-sm tw-font-semibold tw-text-gray-900",
      className
    )}
  >
    {children}
  </div>
);

// Select Separator
interface SelectSeparatorProps {
  className?: string;
}

export const SelectSeparator: React.FC<SelectSeparatorProps> = ({ className }) => (
  <div className={cn("-tw-mx-1 tw-my-1 tw-h-px tw-bg-gray-200", className)} />
);