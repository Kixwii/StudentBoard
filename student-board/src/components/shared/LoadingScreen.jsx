import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingScreen
 * ─────────────
 * A full-viewport centered loading spinner with optional message text.
 *
 * Pure component — no internal state or side effects. Replaces the
 * duplicated loading screens in both ParentDashboard and TeacherDashboard.
 *
 * @param {Object} props
 * @param {string} [props.message='Loading your dashboard…']
 *   Text displayed below the spinner.
 *
 * @example
 *   <LoadingScreen />
 *   <LoadingScreen message="Fetching student data…" />
 */
const LoadingScreen = React.memo(({ message = 'Loading your dashboard…' }) => (
  <div className="loading-screen">
    <div>
      <Loader2 className="loading-screen__spinner" />
      <p className="loading-screen__text">{message}</p>
    </div>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
