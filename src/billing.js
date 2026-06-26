const PLAN_PRICE = 29;

function calculateRevenue(customers) {
  return customers * PLAN_PRICE;
}

module.exports = calculateRevenue;