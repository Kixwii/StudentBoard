import React from 'react';
import { badgeClassName } from '../../utils/styleTokens';

/**
 * Badge
 * ─────
 * A coloured pill badge used for status indicators (e.g. "High", "Watch", "EE").
 *
 * Pure component — output is determined entirely by props.
 * Uses CSS classes from index.css via the `badgeClassName` utility.
 *
 * @param {Object} props
 * @param {'lime' | 'orange' | 'blue'} [props.type='lime']
 *   Semantic colour variant:
 *   - 'lime'   → green pill (positive / exceeding)
 *   - 'orange' → amber pill (warning / approaching)
 *   - 'blue'   → blue pill  (informational)
 * @param {React.ReactNode} props.children - Badge label text or elements.
 *
 * @example
 *   <Badge type="lime">High</Badge>
 *   <Badge type="orange">Watch</Badge>
 */
const Badge = React.memo(({ type = 'lime', children }) => (
  <span className={badgeClassName(type)}>{children}</span>
));

Badge.displayName = 'Badge';

export default Badge;
