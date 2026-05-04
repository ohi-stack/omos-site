function enforcePlanLimits(plan) {
  // Placeholder for Stripe integration
  const plans = {
    starter: { limit: 50 },
    pro: { limit: 500 },
    enterprise: { limit: 5000 }
  };

  return plans[plan] || plans.starter;
}

module.exports = { enforcePlanLimits };
