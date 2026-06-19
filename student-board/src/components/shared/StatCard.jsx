import React from 'react';
import Badge from './Badge';

/**
 * StatCard
 * ────────
 * A compact stats card displaying a labelled metric with an icon,
 * an optional badge, and an optional subtitle line.
 *
 * Pure component — all data flows in via props. No internal state.
 * Wrapped with React.memo to skip re-renders when props are unchanged.
 *
 * @param {Object} props
 * @param {string}  props.label      - Small uppercase label (e.g. "CBC Level").
 * @param {string|number} props.value - Large display value (e.g. "94%").
 * @param {string}  [props.badge]    - Optional badge text (e.g. "High").
 * @param {'lime'|'orange'|'blue'} [props.badgeType] - Badge colour variant.
 * @param {React.ReactNode} [props.sub] - Optional subtitle content below the value.
 * @param {React.ComponentType} [props.icon] - Lucide icon component.
 * @param {string}  [props.iconBg]   - Background colour for the icon circle.
 *
 * @example
 *   <StatCard
 *     label="Attendance"
 *     value="94%"
 *     badge="High"
 *     badgeType="lime"
 *     icon={Calendar}
 *     iconBg="#f0fdf4"
 *     sub={<><Clock size={11} /> This semester</>}
 *   />
 */
const StatCard = React.memo(({ label, value, badge, badgeType, sub, icon, iconBg }) => (
  <div className="stat-card">
    {/* Header row: icon on the left, badge on the right */}
    <div className="stat-card__header">
      <div className="stat-card__icon" style={{ background: iconBg || '#f3f4f6' }}>
        {icon && React.createElement(icon, { size: 18, color: iconBg ? '#1a1a1a' : '#6b7280' })}
      </div>
      {badge && <Badge type={badgeType}>{badge}</Badge>}
    </div>

    {/* Label + large value */}
    <div>
      <div className="label-sm">{label}</div>
      <div className="value-lg">{value}</div>
    </div>

    {/* Optional subtitle (e.g. trend info) */}
    {sub && <div className="stat-card__sub">{sub}</div>}
  </div>
));

StatCard.displayName = 'StatCard';

export default StatCard;
