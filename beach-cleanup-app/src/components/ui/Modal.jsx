import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal component with backdrop and animations
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Function to close modal
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} [props.title] - Modal title
 * @param {string} [props.size='md'] - Modal size (sm, md, lg, xl)
 * @param {boolean} [props.closeOnBackdrop=true] - Whether to close on backdrop click
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnBackdrop = true,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn transition-colors duration-300"
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`rounded-lg ${sizeStyles[size]} w-full max-h-[90vh] overflow-y-auto animate-slideUp ${className} transition-colors duration-300`}
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          color: 'var(--color-text-primary)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            className="flex justify-between items-center p-6 border-b transition-colors duration-300"
            style={{borderColor: 'var(--color-border)'}}
          >
            <h2 className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>{title}</h2>
            <button
              onClick={onClose}
              className="transition-colors duration-200 hover:opacity-75"
              style={{color: 'var(--color-text-secondary)'}}
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        )}
        <div className={title ? '' : 'p-6'}>
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Modal Body component for content
 */
export const ModalBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

/**
 * Modal Footer component for actions
 */
export const ModalFooter = ({ children, className = '' }) => (
  <div
    className={`flex justify-end space-x-4 px-6 py-4 border-t transition-colors duration-300 ${className}`}
    style={{borderColor: 'var(--color-border)'}}
  >
    {children}
  </div>
);

export default Modal;
