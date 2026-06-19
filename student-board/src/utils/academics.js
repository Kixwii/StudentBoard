// utils/academics.js
// ──────────────────────────────────────────────────────────────
// Pure helper functions for academic data aggregation.
// None of these functions access localStorage, the DOM, or any
// external state — they are safe to call anywhere, including
// inside useMemo, tests, or server-side rendering.
// ──────────────────────────────────────────────────────────────

/**
 * computeClassStats
 * ─────────────────
 * Aggregates per-student academic records into class-wide statistics.
 *
 * This replaces the side-effect-laden useMemo in the old TeacherDashboard
 * that called getStudentAcademic() (which reads localStorage) during render.
 * By accepting an already-fetched data map, the function remains pure.
 *
 * @param {Array<{ id: string }>} students
 *   List of student objects — only the `id` field is used.
 *
 * @param {Object<string, {
 *   overallLevel: number,
 *   attendance: { present: number, totalDays: number },
 *   strands: Array<{ name: string, indicator: number }>
 * }>} academicDataMap
 *   A lookup table keyed by student ID. Each value holds that
 *   student's CBC level, attendance record, and strand indicators.
 *
 * @returns {{
 *   avgLevel: string,
 *   attRate: number,
 *   strandAverages: Array<{ name: string, avg: number }>
 * }}
 *   - avgLevel:        Class-wide average CBC level (e.g. "3.2")
 *   - attRate:         Class-wide attendance percentage (0–100)
 *   - strandAverages:  Per-strand average indicator, sorted by name
 */
export const computeClassStats = (students, academicDataMap) => {
  // Default record used when a student has no academic data yet
  const defaultAcademic = {
    overallLevel: 0,
    attendance: { present: 0, totalDays: 0 },
    strands: [],
  };

  // ── Accumulators ──
  // Running totals built up as we iterate through each student.
  let totalLevel = 0;    // sum of all overallLevel values
  let totalPresent = 0;  // sum of all "present" day counts
  let totalDays = 0;     // sum of all "totalDays" counts

  // Map of strand name → { total: sum of indicators, count: how many students }
  // Used to compute per-strand averages at the end.
  const strandLevels = {};

  // ── Single pass over all students ──
  students.forEach((student) => {
    const stats = academicDataMap[student.id] || defaultAcademic;

    // Accumulate overall CBC level
    totalLevel += parseFloat(stats.overallLevel || 0);

    // Accumulate attendance counters
    const att = stats.attendance || { present: 0, totalDays: 0 };
    totalPresent += att.present;
    totalDays += att.totalDays;

    // Accumulate strand-level indicators (immutable accumulation)
    (stats.strands || []).forEach((s) => {
      if (!strandLevels[s.name]) {
        strandLevels[s.name] = { total: 0, count: 0 };
      }
      // Create a new object instead of mutating the existing one
      strandLevels[s.name] = {
        total: strandLevels[s.name].total + s.indicator,
        count: strandLevels[s.name].count + 1,
      };
    });
  });

  // ── Derive final values ──

  // Average CBC level across all students, formatted to 1 decimal place
  const avgLevel = students.length
    ? (totalLevel / students.length).toFixed(1)
    : '0';

  // Class-wide attendance rate as a rounded percentage
  const attRate = totalDays
    ? Math.round((totalPresent / totalDays) * 100)
    : 0;

  // Per-strand averages, each rounded to 1 decimal place
  const strandAverages = Object.keys(strandLevels).map((name) => {
    const s = strandLevels[name];
    const avg = s.count ? s.total / s.count : 0;
    return { name, avg: parseFloat(avg.toFixed(1)) };
  });

  return { avgLevel, attRate, strandAverages };
};
