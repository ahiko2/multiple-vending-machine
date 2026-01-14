import React from 'react';

interface Transaction {
  id: string;
  productId: string;
  amount: number;
  payment: number;
  change: number;
  timestamp: string;
}

interface SalesReportProps {
  transactions: Transaction[];
  totalRevenue: number;
  totalTransactions: number;
  machineId?: string;
}

const SalesReport: React.FC<SalesReportProps> = ({ transactions, totalRevenue, totalTransactions }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="sales-report">
      <h2>Sales Report</h2>
      
      <div className="report-summary">
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p className="revenue">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Transactions</h3>
          <p className="transactions">{totalTransactions}</p>
        </div>
        <div className="summary-card">
          <h3>Average Transaction</h3>
          <p className="average">
            ${totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      <div className="transaction-history">
        <h3>Recent Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product ID</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(-10).reverse().map(transaction => (
              <tr key={transaction.id}>
                <td>{formatDate(transaction.timestamp)}</td>
                <td>{transaction.productId}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>${transaction.payment.toFixed(2)}</td>
                <td>${transaction.change.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;