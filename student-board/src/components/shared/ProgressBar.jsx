import React from 'react';

/**
 * ProgressBar
 * ───────────
 * A horizontal progress bar that fills to a given percentage.
 *
 * Pure component — renders based solely on props. No internal state,
 * no side effects. Uses CSS classes from index.css for the track
 * and fill, with the fill width and color applied as inline style
 * since they are dynamic per-instance values.
 *
 * @param {Object} props
 * @param {number} props.pct   - Fill percentage (0–100). Clamped at 100.
 * @param {string} [props.color='#a3e635'] - Fill color (CSS color string).
 *
 * @example
 *   <ProgressBar pct={75} color="#16a34a" />
 */
const ProgressBar = React.memo(({ pct, color = '#a3e635' }) => (
  <div className="progress-track">
    <div
      className="progress-fill"
      style={{ width: `${Math.min(100, pct)}%`, background: color }}
    />
  </div>
));

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
