const metrics = require("./metrics");
const generateReport = require("./reports");
const exportCSV = require("./export");
const calculateRevenue = require("./billing");

console.log(
  generateReport(metrics)
);

console.log();

console.log(
  exportCSV(metrics)
);

console.log();

console.log(
  `Monthly Revenue: ₹${calculateRevenue(42)}`
);