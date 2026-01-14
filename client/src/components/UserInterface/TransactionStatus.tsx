import React from 'react';

interface TransactionStatusProps {
  message: string;
  type: 'success' | 'error' | 'info';
  change?: number;
  onClose: () => void;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ message, type, change, onClose }) => {
  return (
    <div className={`transaction-status ${type}`}>
      <div className="status-content">
        <h3>{type === 'success' ? 'Transaction Successful!' : type === 'error' ? 'Transaction Failed' : 'Information'}</h3>
        <p>{message}</p>
        {change !== undefined && change > 0 && (
          <p className="change-amount">Your change: ${change.toFixed(2)}</p>
        )}
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionStatus;