import React from 'react';
import { CreditCard } from 'lucide-react';

/**
 * FeesView Component
 * ──────────────────
 * Renders the financial fee account details, item breakdown, and transaction logs.
 * Includes a payment CTA if the account balance is greater than zero.
 *
 * @param {Object} props
 * @param {Object} props.feeData - Financial accounts of the selected child.
 * @param {Function} props.onMakePayment - Callback trigger to open the payment modal.
 */
const FeesView = React.memo(({ feeData, onMakePayment }) => {
  const currentBalance = feeData?.currentBalance || 0;
  const dueDate = feeData?.dueDate || 'N/A';
  const breakdown = feeData?.breakdown || [];
  const paymentHistory = feeData?.paymentHistory || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* ── Balance Hero Card ── */}
      <div style={{ background: '#1a1a1a', borderRadius: 20, padding: '1.5rem', color: '#fff' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
          Current Balance
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: 6 }}>
          ${currentBalance.toFixed(2)}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>
          Due: {dueDate}
        </div>
        {currentBalance > 0 && (
          <button 
            onClick={onMakePayment}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.625rem 1rem',
              background: '#a3e635',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <CreditCard size={16} /> Make Payment
          </button>
        )}
      </div>

      {/* ── Fee Category Breakdown ── */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <p className="section-title" style={{ marginBottom: '0.875rem' }}>Fee Breakdown</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {breakdown.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f5f7fa', borderRadius: 12 }}>
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>{item.category}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a1a1a' }}>
                ${item.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transaction History Logs ── */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <p className="section-title" style={{ marginBottom: '0.875rem' }}>Payment History</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {paymentHistory.map((payment, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', background: '#f0fdf4', borderRadius: 12, borderLeft: '3px solid #a3e635' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a' }}>{payment.description}</div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>
                  {payment.date} · {payment.method}
                </div>
              </div>
              <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.875rem' }}>
                -${payment.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

FeesView.displayName = 'FeesView';

export default FeesView;
