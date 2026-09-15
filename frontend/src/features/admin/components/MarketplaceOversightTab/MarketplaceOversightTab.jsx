import React, { useState } from 'react';
import { 
  DollarSign, ShoppingBag, CreditCard, ShieldCheck, CheckCircle2, 
  ArrowUpRight, RefreshCw, Search, Filter, AlertCircle, FileText
} from 'lucide-react';
import Button from '../../../../components/Button/Button';
import Badge from '../../../../components/Badge/Badge';

export default function MarketplaceOversightTab() {
  const [searchTx, setSearchTx] = useState('');
  
  // Financial Overview Metrics
  const finMetrics = {
    totalVolume: '৳ 1,85,000 BDT',
    escrowLocked: '৳ 37,000 BDT',
    payoutsReleased: '৳ 1,48,000 BDT',
    totalDealsSold: '1,420 Deals'
  };

  // Marketplace Transactions List
  const [transactions, setTransactions] = useState([
    {
      id: 'TX-9041',
      consumerName: 'Naimur Rahman',
      restaurant: 'Star Kabab Banani',
      items: '2x Mutton Kacchi Biryani (70% OFF)',
      origPrice: '৳ 600',
      paidAmount: '৳ 180 BDT',
      gateway: 'bKash (TxID: BK-904218)',
      date: '15 Sep 2026, 17:40',
      escrowStatus: 'ESCROW_LOCKED'
    },
    {
      id: 'TX-9042',
      consumerName: 'Sadiya Afrin',
      restaurant: 'Kacchi Bhai Banani',
      items: '1x Kacchi Platter & Borhani',
      origPrice: '৳ 350',
      paidAmount: '৳ 125 BDT',
      gateway: 'Nagad (TxID: NG-881204)',
      date: '15 Sep 2026, 16:15',
      escrowStatus: 'PAYOUT_RELEASED'
    },
    {
      id: 'TX-9043',
      consumerName: 'Arif Hossain',
      restaurant: 'Takeout Burgers Gulshan',
      items: '3x Gourmet Chicken Burgers',
      origPrice: '৳ 900',
      paidAmount: '৳ 270 BDT',
      gateway: 'bKash (TxID: BK-771029)',
      date: '15 Sep 2026, 14:20',
      escrowStatus: 'PAYOUT_RELEASED'
    }
  ]);

  const handleReleasePayout = (id) => {
    setTransactions((prev) => prev.map(t => t.id === id ? { ...t, escrowStatus: 'PAYOUT_RELEASED' } : t));
  };

  const handleIssueRefund = (id) => {
    setTransactions((prev) => prev.map(t => t.id === id ? { ...t, escrowStatus: 'REFUNDED' } : t));
  };

  return (
    <div className="tab-pane-marketplace-oversight">
      {/* FINANCIAL METRICS GRID */}
      <div className="fin-metrics-grid">
        <div className="fin-card">
          <span className="fin-lbl">TOTAL MARKETPLACE GMV</span>
          <span className="fin-val">{finMetrics.totalVolume}</span>
          <span className="fin-sub">1,420 Deals Sold</span>
        </div>

        <div className="fin-card amber">
          <span className="fin-lbl">ESCROW BALANCE (HELD)</span>
          <span className="fin-val">{finMetrics.escrowLocked}</span>
          <span className="fin-sub">Pending Pickup Confirmation</span>
        </div>

        <div className="fin-card green">
          <span className="fin-lbl">RELEASED TO RESTAURANTS</span>
          <span className="fin-val">{finMetrics.payoutsReleased}</span>
          <span className="fin-sub">Settled Payouts</span>
        </div>

        <div className="fin-card blue">
          <span className="fin-lbl">PAYMENT GATEWAY SPLIT</span>
          <span className="fin-val">bKash 65% • Nagad 35%</span>
          <span className="fin-sub">Instant Escrow Lock</span>
        </div>
      </div>

      {/* MASTER TRANSACTIONS TABLE */}
      <div className="admin-table-container">
        <div className="table-header-title">
          <h4>B2C Surplus Marketplace Financial Transactions</h4>
          <span className="count-pill">{transactions.length} Transactions Recorded</span>
        </div>

        <table className="admin-master-table">
          <thead>
            <tr>
              <th>TRANSACTION ID</th>
              <th>CONSUMER</th>
              <th>RESTAURANT</th>
              <th>DEAL ITEM</th>
              <th>PAID AMOUNT</th>
              <th>GATEWAY & TXID</th>
              <th>ESCROW STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.id}</strong></td>
                <td>{item.consumerName}</td>
                <td>🏪 {item.restaurant}</td>
                <td>{item.items}</td>
                <td>
                  <div className="price-cell">
                    <strong>{item.paidAmount}</strong>
                    <span className="orig-price">{item.origPrice}</span>
                  </div>
                </td>
                <td><code>{item.gateway}</code></td>
                <td>
                  <span className={`status-pill ${item.escrowStatus.toLowerCase()}`}>
                    {item.escrowStatus}
                  </span>
                </td>
                <td>
                  {item.escrowStatus === 'ESCROW_LOCKED' ? (
                    <div className="table-btn-row">
                      <Button size="sm" variant="primary" onClick={() => handleReleasePayout(item.id)}>
                        Release Payout
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleIssueRefund(item.id)}>
                        Refund
                      </Button>
                    </div>
                  ) : (
                    <span className="settled-lbl">✓ Settled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
