const express = require("express");
const router = express.Router();
const records = require("./records");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

// send a GET request to /quotes READ a list of quotes
router.get("/quotes", async (req, res) => {
  try {
    const quotes = await records.getQuotes();
    res.json(quotes);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// send a GET request to /quotes/:id READ(view) a quote
router.get("/quotes/:id", async (req, res) => {
  try {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ message: "Quote not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/quotes",
  asyncHandler(async (req, res) => {
    if (req.body.author && req.body.quote) {
      const quote = await records.createQuote({
        quote: req.body.quote,
        author: req.body.author,
      });
      res.status(201).json(quote);
    } else {
      res.status(400).json({ message: "Quote and author required" });
    }
  })
);

// send a PUT request to /quotes/:id UPDATE (edit) a quote
router.put(
  "/quotes/:id",
  asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      quote.quote = req.body.quote;
      quote.author = req.body.author;

      await records.updateQuote(quote);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Quote Not Found" });
    }
  })
);

// send a DELETE request to /quotes/:id DELETE a quote
router.delete("/quotes/:id", async (req, res, next) => {
  try {
    const quote = await records.getQuote(req.params.id);
    await records.deleteQuote(quote);
    if (quote) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Quote Not Found" });
    }
  } catch (err) {
    next(err);
  }
});

// send a GET request to /quotes/quote/random READ(view) a random quote
router.get(
  "/quotes/quote/random",
  asyncHandler(async (req, res) => {
    const quote = await records.getRandomQuote();
    res.json(quote);
  })
);

module.exports = router;
