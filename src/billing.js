const PLAN_PRICE = 29;

function calculateRevenue(customers) {
  return customers * PLAN_PRICE;
}

function annualRevenue(customers) {
  return calculateRevenue(customers) * 12;
}

module.exports = {
  calculateRevenue,
  annualRevenue
};