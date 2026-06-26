const metrics = require("./src/metrics");
const {
  exportCSV,
  exportReport
} = require("./src/export");

const {
  calculateRevenue,
  annualRevenue
} = require("./src/billing");
const notifications = require("./src/notifications");

const csv = exportCSV(metrics);

if (!csv.includes("home,120")) {
  console.log("fail");
  process.exit(1);
}

if (!exportReport(metrics).includes("pricing,45")) {
  console.log("fail");
  process.exit(1);
}

if (annualRevenue(10) !== 3480) {
  console.log("fail");
  process.exit(1);
}

if (calculateRevenue(10) !== 290) {
  console.log("fail");
  process.exit(1);
}

if (notifications.EXPORT_TIMEOUT !== 3000) {
  console.log("fail");
  process.exit(1);
}

console.log("pass");
process.exit(0);