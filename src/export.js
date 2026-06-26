function exportCSV(metrics) {
  console.log(
    `Exporting ${metrics.length} rows`
  );

  return metrics
    .map(
      row => `${row.page},${row.visits}`
    )
    .join("\n");
}

module.exports = exportCSV;