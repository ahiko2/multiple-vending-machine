import React, { useState } from 'react';

interface PaymentInputProps {
  selectedProduct: any;
  onPayment: (amount: number) => void;
  onCancel: () => void;
}

const PaymentInput: React.FC<PaymentInputProps> = ({ selectedProduct, onPayment, onCancel }) => {
  const [insertedAmount, setInsertedAmount] = useState(0);
  const validAmounts = [0.25, 0.50, 1.00, 5.00, 10.00, 20.00];

  const handleInsertMoney = (amount: number) => {
    setInsertedAmount(prev => prev + amount);
  };

  const handlePurchase = () => {
    if (insertedAmount >= selectedProduct.price) {
      onPayment(insertedAmount);
      setInsertedAmount(0);
    }
  };

  const handleRefund = () => {
    setInsertedAmount(0);
    onCancel();
  };

  return (
    <div className="payment-input">
      <h3>Purchase: {selectedProduct.name}</h3>
      <p>Price: ${selectedProduct.price.toFixed(2)}</p>
      <p>Inserted: ${insertedAmount.toFixed(2)}</p>
      <p>Change: ${Math.max(0, insertedAmount - selectedProduct.price).toFixed(2)}</p>
      
      <div className="money-buttons">
        <h4>Insert Money:</h4>
        {validAmounts.map(amount => (
          <button 
            key={amount}
            onClick={() => handleInsertMoney(amount)}
            className="money-button"
          >
            ${amount.toFixed(2)}
          </button>
        ))}
      </div>

      <div className="action-buttons">
        <button 
          onClick={handlePurchase}
          disabled={insertedAmount < selectedProduct.price}
          className="purchase-button"
        >
          Purchase
        </button>
        <button 
          onClick={handleRefund}
          className="refund-button"
        >
          Cancel & Refund
        </button>
      </div>
    </div>
  );
};

export default PaymentInput;