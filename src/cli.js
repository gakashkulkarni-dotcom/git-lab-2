const metrics = require("./metrics");
const {
  generateReport,
  filterReports
} = require("./reports");
const exportCSV = require("./export");
const calculateRevenue = require("./billing");
const notifications = require("./notifications");

console.log(
  generateReport(metrics)
);

console.log();

console.log(
  "Popular Pages"
);

console.log(
  filterReports(metrics, 40)
);

console.log();

console.log(
  exportCSV(metrics)
);

console.log();

console.log(
  `Monthly Revenue: ₹${calculateRevenue(42)}`
);

console.log();

console.log(
  `Export Timeout: ${notifications.EXPORT_TIMEOUT}ms`
);