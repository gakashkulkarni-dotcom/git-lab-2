function filterReports(
  metrics,
  minimumVisits
) {
  return metrics.filter(
    metric => metric.visits >= minimumVisits
  );
}

function generateReport(metrics) {
  const sortedMetrics = [...metrics].sort(
    (a, b) => b.visits - a.visits
  );

  return sortedMetrics
    .map(
      row => `${row.page}: ${row.visits}`
    )
    .join("\n");
}

module.exports = {
  generateReport,
  filterReports
};