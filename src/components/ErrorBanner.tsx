import React from 'react';

interface ErrorBannerProps {
  message: string;
  onClose: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <span className="error-banner-message">{message}</span>
      <button
        type="button"
        className="error-banner-close"
        onClick={onClose}
        aria-label="エラーメッセージを閉じる"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

export default ErrorBanner;
