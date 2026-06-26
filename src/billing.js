const PLAN_PRICE = 29;

function calculateRevenue(customers) {
  return customers * PLAN_PRICE;
}

function annualRevenue(customers) {
  return calculateRevenue(customers) * 12;
}

function applyDiscount(
  amount,
  percentage
) {
  return amount - amount * (percentage / 100);
}

module.exports = {
  calculateRevenue,
  annualRevenue,
  applyDiscount
};