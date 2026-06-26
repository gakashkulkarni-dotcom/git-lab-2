function exportCSV(metrics) {
  console.log(
    `Exporting ${metrics.length} rows`
  );

  const generatedAt =
    new Date().toISOString();

  return [
    `generated-at,${generatedAt}`,
    ...metrics.map(
      row => `${row.page},${row.visits}`
    )
  ].join("\n");
}

function exportReport(metrics) {
  return exportCSV(metrics);
}

module.exports = {
  exportCSV,
  exportReport
};