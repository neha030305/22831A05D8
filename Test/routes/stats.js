const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Link = require('../models/Link');

router.get('/stats/:code', auth, async (req, res) => {
  const link = await Link.findOne({ shortCode: req.params.code, createdBy: req.userId });
  if (!link) return res.status(403).send('No access');

  res.json({
    clicks: link.clicks.length,
    logs: link.clicks
  });
});

module.exports = router;
