const { runCouncil } = require('./council');

function registerCouncilRoute(app, { requireApiKey, rateLimit }) {
  app.post('/api/v1/council', requireApiKey, rateLimit(), async (req, res) => {
    try {
      const result = await runCouncil(req.body || {});
      const httpStatus = result.status === 'insufficient_providers' ? 503 : 200;
      return res.status(httpStatus).json({
        status: result.status || 'ok',
        apiKey: req.apiKeyMeta ? { name: req.apiKeyMeta.name, plan: req.apiKeyMeta.plan } : null,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        error: 'council_run_failed',
        message: error.message,
        verificationStatus: 'not_verified',
        humanReviewRequired: true
      });
    }
  });
}

module.exports = { registerCouncilRoute };
