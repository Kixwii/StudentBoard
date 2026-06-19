import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * ErrorBanner
 * ───────────
 * A warning-style banner displayed when data fetching fails.
 * Shows a yellow/amber alert with an icon and the error message,
 * appending "– Using demo data" to indicate the fallback.
 *
 * Pure component — renders based on the `message` prop alone.
 * Returns null if no message is provided, so it can be rendered
 * unconditionally in the parent without wrapping in a conditional.
 *
 * @param {Object} props
 * @param {string|null} props.message - Error text. Renders nothing if falsy.
 *
 * @example
 *   <ErrorBanner message={error} />
 *   <ErrorBanner message="Could not load student data" />
 */
const ErrorBanner = React.memo(({ message }) => {
  // Render nothing when there's no error — avoids conditional wrappers in parent
  if (!message) return null;

  return (
    <div className="error-banner">
      <AlertCircle size={15} className="error-banner__icon" />
      {message} – Using demo data
    </div>
  );
});

ErrorBanner.displayName = 'ErrorBanner';

export default ErrorBanner;
