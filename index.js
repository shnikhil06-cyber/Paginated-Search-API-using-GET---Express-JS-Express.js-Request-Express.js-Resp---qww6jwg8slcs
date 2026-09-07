const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Already loaded the database (It's now a direct array)
const allArticles = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));

app.get('/search', (req, res) => {
  const { name, limit, page } = req.query;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Search name parameter is required.' });
  }

  const searchTerm = name.toLowerCase();

  const matchedArticles = allArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm)
  );

  const parsedLimit = parseInt(limit, 10);
  const parsedPage = parseInt(page, 10);

  const effectiveLimit = Number.isNaN(parsedLimit) || parsedLimit <= 0 ? 5 : parsedLimit;
  const effectivePage = Number.isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;

  const totalResults = matchedArticles.length;
  const totalPages = Math.ceil(totalResults / effectiveLimit);

  const startIndex = (effectivePage - 1) * effectiveLimit;
  const endIndex = startIndex + effectiveLimit;
  const paginatedArticles = matchedArticles.slice(startIndex, endIndex);

  res.status(200).json({
    currentPage: effectivePage,
    totalPages,
    totalResults,
    articles: paginatedArticles,
  });
});


  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  module.exports = {app}
