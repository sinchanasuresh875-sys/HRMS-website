import { useEffect } from 'react';

export default function Toast({ toast, onClose, autoHideDuration = 4000 }) {
  useEffect(() => {
    if (toast && autoHideDuration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [toast, autoHideDuration, onClose]);

  if (!toast || !toast.message) return null;

  const isError = toast.type === 'error';

  return (
    <div className={`toast-notification ${isError ? 'toast-error' : 'toast-success'}`} role="alert">
      <div className="toast-icon">
        {isError ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        )}
      </div>
      <div className="toast-message">{toast.message}</div>
      {onClose && (
        <button type="button" className="toast-close" onClick={onClose} aria-label="Close notification">
          &times;
        </button>
      )}
    </div>
  );
}
