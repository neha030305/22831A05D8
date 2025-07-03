const express = require('express');
const router = express.Router();
const Link = require('../models/Link');

router.get('/:code', async (req, res) => {
  const link = await Link.findOne({ shortCode: req.params.code });
  if (!link) return res.status(404).send('Link not found');
  if (link.expiresAt < new Date()) return res.status(410).send('Link expired');

  link.clicks.push({
    clickedAt: new Date(),
    referrer: req.get('Referrer') || 'Direct'
  });

  await link.save();
  res.redirect(link.originalUrl);
});

module.exports = router;
