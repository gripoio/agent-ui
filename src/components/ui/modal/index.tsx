import React, { createContext, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Simple utility function to merge classes
function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

// Modal Context for managing state
interface ModalContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a Modal");
  }
  return context;
};

// Hook for handling escape key and outside clicks
const useModalInteractions = (onClose: () => void, triggerRef?: React.RefObject<any>) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    // Focus management
    const previousActiveElement = document.activeElement as HTMLElement;
    
    return () => {
      // Return focus to trigger element or previous active element
      if (triggerRef?.current) {
        triggerRef.current.focus();
      } else if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [triggerRef]);
};

// Portal component for rendering outside the DOM tree
interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  return createPortal(
    children,
    container || document.body
  );
}

// Main Modal component
interface ModalProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Modal({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: ModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange || setUncontrolledOpen;

  return (
    <ModalContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

// Modal Trigger
interface ModalTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export function ModalTrigger({
  children,
  asChild = false,
  className,
}: ModalTriggerProps) {
  const { onOpenChange } = useModal();
  const triggerRef = useRef<any>(null);

  const handleClick = () => {
    onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...(children.props || {}),
      ref: triggerRef,
      onClick: handleClick,
    });
  }

  return (
    <button
      ref={triggerRef}
      onClick={handleClick}
      className={cn("tw-outline-none", className)}
    >
      {children}
    </button>
  );
}

// Modal Portal
interface ModalPortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

export function ModalPortal({ children, container }: ModalPortalProps) {
  return <Portal container={container}>{children}</Portal>;
}

// Modal Overlay - FIXED with higher z-index
interface ModalOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

export function ModalOverlay({
  className,
  children,
}: ModalOverlayProps) {
  const { onOpenChange } = useModal();

  return (
    <div
      className={cn(
        // FIXED: Higher z-index than AI Agent portal (9999)
        "tw-fixed tw-inset-0 tw-z-[10000] tw-bg-black/50 tw-backdrop-blur-sm",
        className
      )}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  );
}

// Modal Content - FIXED with concrete colors and higher z-index
interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
}

export function ModalContent({
  children,
  className,
  onEscapeKeyDown,
  onPointerDownOutside,
}: ModalContentProps) {
  const { open, onOpenChange } = useModal();
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<any>(null);

  useModalInteractions(() => {
    onEscapeKeyDown?.(new KeyboardEvent('keydown', { key: 'Escape' }));
    onOpenChange(false);
  }, triggerRef);

  if (!open) return null;

  return (
    <ModalPortal>
      <ModalOverlay />
      <div
        ref={contentRef}
        className={cn(
          // FIXED: Higher z-index and concrete colors
          "tw-fixed tw-left-[50%] tw-top-[50%] tw-z-[10001] tw-grid tw-w-full tw-max-w-lg tw-translate-x-[-50%] tw-translate-y-[-50%] tw-gap-4",
          "tw-border tw-border-gray-200 tw-bg-white tw-p-6 tw-shadow-lg tw-duration-200",
          "tw-rounded-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </ModalPortal>
  );
}

// Modal Header
interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalHeader({
  children,
  className,
}: ModalHeaderProps) {
  return (
    <div
      className={cn(
        "tw-flex tw-flex-col tw-space-y-1.5 tw-text-center sm:tw-text-left",
        className
      )}
    >
      {children}
    </div>
  );
}

// Modal Footer
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({
  children,
  className,
}: ModalFooterProps) {
  return (
    <div
      className={cn(
        "tw-flex tw-flex-col-reverse sm:tw-flex-row sm:tw-justify-end sm:tw-space-x-2",
        className
      )}
    >
      {children}
    </div>
  );
}

// Modal Title - FIXED with concrete colors
interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalTitle({
  children,
  className,
}: ModalTitleProps) {
  return (
    <h2
      className={cn(
        "tw-text-lg tw-font-semibold tw-leading-none tw-tracking-tight tw-text-gray-900",
        className
      )}
    >
      {children}
    </h2>
  );
}

// Modal Description - FIXED with concrete colors
interface ModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalDescription({
  children,
  className,
}: ModalDescriptionProps) {
  return (
    <p
      className={cn(
        "tw-text-sm tw-text-gray-600",
        className
      )}
    >
      {children}
    </p>
  );
}

// Modal Close Button - FIXED with concrete colors
interface ModalCloseProps {
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export function ModalClose({
  children,
  className,
  asChild = false,
}: ModalCloseProps) {
  const { onOpenChange } = useModal();

  const handleClick = () => {
    onOpenChange(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...(children.props || {}),
      onClick: handleClick,
    });
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "tw-absolute tw-right-4 tw-top-4 tw-rounded-sm tw-opacity-70 tw-transition-opacity hover:tw-opacity-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2 tw-text-gray-500 hover:tw-text-gray-700",
        className
      )}
    >
      {children || (
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="tw-h-4 tw-w-4"
        >
          <path
            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span className="tw-sr-only">Close</span>
    </button>
  );
}