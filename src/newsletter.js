// src/newsletter.js
// Generates a Markdown newsletter with top AI‑related launches from Product Hunt and GitHub Trending.
// Usage: node src/newsletter.js

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('rss-parser');

async function getProductHunt() {
  const parser = new Parser();
  const feed = await parser.parseURL('https://www.producthunt.com/feed');
  return feed.items.slice(0, 5).map(item => `- [${item.title}](${item.link})`);
}

async function getGitHubTrending() {
  const { data } = await axios.get('https://github.com/trending?since=daily');
  const $ = cheerio.load(data);
  const items = [];
  $('article.Box-row').slice(0, 5).each((_, el) => {
    const repo = $(el).find('h2 a').text().trim().replace(/\s/g, '');
    const link = `https://github.com/${repo}`;
    const desc = $(el).find('p').text().trim();
    items.push(`- [${repo}](${link}) – ${desc}`);
  });
  return items;
}

(async () => {
  try {
    const ph = await getProductHunt();
    const gh = await getGitHubTrending();

    const md = `# Daily AI Tools & Templates\n\n## Product Hunt Top 5\n${ph.join('\n')}\n\n## GitHub Trending (Daily)\n${gh.join('\n')}\n\n*Generated automatically on ${new Date().toUTCString()}*`;
    fs.writeFileSync('newsletter.md', md);
    console.log('Newsletter generated: newsletter.md');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
