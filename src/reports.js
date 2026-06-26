function generateReport(metrics) {
  return metrics
    .map(
      row => `${row.page}: ${row.visits}`
    )
    .join("\n");
}

module.exports = generateReport;