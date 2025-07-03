const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const auth = require('../middleware/auth');
const shortid = require('shortid');

router.post('/shorten', auth, async (req, res) => {
  const { links } = req.body;
  if (!Array.isArray(links) || links.length > 5) {
    return res.status(400).json({ error: 'You can shorten up to 5 URLs at once.' });
  }

  const results = [];

  for (const item of links) {
    const { originalUrl, shortCode, validity } = item;
    const code = shortCode || shortid.generate();
    const expires = validity ? new Date(Date.now() + validity * 60000) : new Date(Date.now() + 1800000);

    const exists = await Link.findOne({ shortCode: code });
    if (exists) {
      results.push({ error: `Code "${code}" already in use.` });
      continue;
    }

    const newLink = new Link({
      originalUrl,
      shortCode: code,
      createdBy: req.userId,
      expiresAt: expires
    });

    await newLink.save();
    results.push({
      shortUrl: `${req.protocol}://${req.get('host')}/${code}`,
      expiresAt: expires
    });
  }

  res.json(results);
});

module.exports = router;
