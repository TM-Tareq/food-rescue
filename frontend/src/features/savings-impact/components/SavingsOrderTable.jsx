import React, { useState } from 'react';
import {
  Search,
  Filter,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Leaf,
  CheckCircle2,
  FileText
} from 'lucide-react';
import Card from '../../../components/Card/Card';
import Button from '../../../components/Button/Button';
import './SavingsOrderTable.css';

const SAMPLE_ORDERS = [
  {
    id: '#FR-4581',
    date: 'Dec 12, 2026 - 6:30 PM',
    restaurant: 'Star Kabab Banani',
    item: 'Biryani Mutton Kacchi Lot',
    originalPrice: 650,
    paidPrice: 260,
    savings: 390,
    discountPct: 60,
    co2: '1.8 kg',
    qrCode: 'QR-4581-DHAKA-RESCUE'
  },
  {
    id: '#FR-4523',
    date: 'Dec 05, 2026 - 7:15 PM',
    restaurant: 'Daily Crust Bakery',
    item: 'Artisan Pastry Box (x2)',
    originalPrice: 400,
    paidPrice: 160,
    savings: 240,
    discountPct: 60,
    co2: '1.2 kg',
    qrCode: 'QR-4523-DHAKA-RESCUE'
  },
  {
    id: '#FR-4105',
    date: 'Nov 28, 2026 - 8:10 PM',
    restaurant: 'Takeout Banani',
    item: 'Double Cheese Artisan Burger Set',
    originalPrice: 750,
    paidPrice: 300,
    savings: 450,
    discountPct: 60,
    co2: '2.4 kg',
    qrCode: 'QR-4105-DHAKA-RESCUE'
  },
  {
    id: '#FR-4018',
    date: 'Nov 19, 2026 - 6:45 PM',
    restaurant: 'Khanas Banani Gulshan',
    item: 'Gourmet Meal Box & Dessert',
    originalPrice: 600,
    paidPrice: 240,
    savings: 360,
    discountPct: 60,
    co2: '1.5 kg',
    qrCode: 'QR-4018-DHAKA-RESCUE'
  },
  {
    id: '#FR-3925',
    date: 'Nov 10, 2026 - 7:02 PM',
    restaurant: "Sultan's Dine Banani",
    item: 'Kacchi Platter & Phirni',
    originalPrice: 800,
    paidPrice: 320,
    savings: 480,
    discountPct: 60,
    co2: '2.6 kg',
    qrCode: 'QR-3925-DHAKA-RESCUE'
  }
];

export default function SavingsOrderTable({ onSelectReceipt }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = SAMPLE_ORDERS.filter((order) =>
    order.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="savings-table-card">
      {/* Table Header Row */}
      <div className="table-top-bar">
        <div>
          <h2 className="table-title">Detailed Savings Breakdown by Order</h2>
          <p className="table-subtitle">Verified ledger entries showing individual plate savings and CO₂ offsets.</p>
        </div>

        <div className="table-filter-actions">
          <div className="table-search-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="table-search-input"
            />
          </div>

          <button className="table-filter-btn">
            <Filter size={14} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="table-responsive-wrapper">
        <table className="savings-table">
          <thead>
            <tr>
              <th>Order ID & Date</th>
              <th>Restaurant Partner</th>
              <th>Items Rescued</th>
              <th>Price</th>
              <th>Surplus Paid</th>
              <th>Money Saved</th>
              <th>CO₂ Prevented</th>
              <th className="text-right">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="table-row">
                  <td>
                    <div className="order-id-cell">
                      <span className="order-id">{order.id}</span>
                      <span className="order-date">{order.date}</span>
                    </div>
                  </td>
                  <td>
                    <span className="restaurant-name">⭐ {order.restaurant}</span>
                  </td>
                  <td>
                    <span className="item-name">{order.item}</span>
                  </td>
                  <td>
                    <span className="original-price">৳{order.originalPrice}</span>
                  </td>
                  <td>
                    <span className="paid-price">৳{order.paidPrice}</span>
                  </td>
                  <td>
                    <div className="savings-cell">
                      <span className="savings-amount">+ ৳{order.savings}</span>
                      <span className="discount-tag">({order.discountPct}% OFF)</span>
                    </div>
                  </td>
                  <td>
                    <div className="co2-pill">
                      <Leaf size={12} className="co2-icon" />
                      <span>{order.co2}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      className="qr-pass-btn"
                      onClick={() => onSelectReceipt && onSelectReceipt(order)}
                    >
                      <QrCode size={14} />
                      <span>QR Pass</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results-cell">
                  No order records matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Navigation */}
      <div className="table-footer-bar">
        <div className="table-footer-summary">
          <FileText size={15} className="summary-icon" />
          <span>
            Showing <strong>{filteredOrders.length} of 18 orders</strong> · Total Saved: <strong>৳4,500 BDT</strong> · <strong>24.5 kg CO₂</strong> Diverted
          </span>
        </div>

        <div className="pagination-controls">
          <button className="page-btn" disabled={currentPage === 1}>
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="page-info">Page <strong>{currentPage}</strong> of 4</span>
          <button className="page-btn">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}
