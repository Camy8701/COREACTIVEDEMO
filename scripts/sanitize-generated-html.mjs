import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const htmlRoots = ['.', 'pages', 'collections', 'products', 'account', 'cart', 'checkout', 'join'];
const assetRoot = path.join(projectRoot, 'assets', 'origin', 'ballinfit');

const assetEntries = [];
const assetIndex = new Map();

async function main() {
  await indexAssets(assetRoot);

  const htmlFiles = [];
  for (const root of htmlRoots) {
    const absoluteRoot = path.join(projectRoot, root);
    await collectHtmlFiles(absoluteRoot, htmlFiles);
  }

  for (const htmlFile of htmlFiles) {
    const html = await fs.readFile(htmlFile, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });

    removeUnusedNodes($);
    rewriteAttributes($, htmlFile);
    rewriteInlineScripts($, htmlFile);

    await fs.writeFile(htmlFile, $.html());
  }
}

function removeUnusedNodes($) {
  $(
    [
      'script#apple-pay-shop-capabilities',
      'script#__st',
      'script[type="application/ld+json"]',
      'link[rel="alternate"][type="application/json+oembed"]',
      '.shopify-payment-button',
      'shopify-accelerated-checkout',
      '.shop-pay-terms',
    ].join(', ')
  ).remove();

  $('script:not([src])').each((_, element) => {
    const text = $(element).html() || '';
    if (
      /loader\.init-shop-cart-sync|featureAssets\['shop-js'\]|static\.rechargecdn\.com|cdn-app\.cart-bot\.net|static\.klaviyo\.com|window\.Shopify\.SignInWithShop|shopify-buyer-consent/i.test(
        text
      )
    ) {
      $(element).remove();
    }
  });
}

function rewriteAttributes($, htmlFile) {
  $('*').each((_, element) => {
    const attrs = element.attribs || {};
    for (const [name, value] of Object.entries(attrs)) {
      if (!value) {
        continue;
      }

      if ((name === 'href' || name === 'action') && value.startsWith('/') && !value.startsWith('//')) {
        const rewrittenRootPath = rewriteRootPath(value, htmlFile);
        if (rewrittenRootPath === null) {
          $(element).remove();
          break;
        }
        $(element).attr(name, rewrittenRootPath);
        continue;
      }

      if (name === 'value' && (attrs['data-share-url'] !== undefined || attrs.id === 'url')) {
        $(element).attr(name, '');
        continue;
      }

      const rewritten = rewriteText(value, htmlFile);
      if (rewritten !== value) {
        $(element).attr(name, rewritten);
      }
    }
  });
}

function rewriteInlineScripts($, htmlFile) {
  $('script:not([src])').each((_, element) => {
    const text = $(element).html();
    if (!text) {
      return;
    }

    const rewritten = rewriteText(text, htmlFile);
    if (rewritten !== text) {
      $(element).html(rewritten);
    }
  });
}

function rewriteText(input, htmlFile) {
  return input
    .replace(/https?:\\\/\\\/ballinfit\.nl\\\/[^"'`\s<]+|\\\/\\\/ballinfit\.nl\\\/[^"'`\s<]+/g, (match) =>
      rewriteOriginUrl(unescapeSlashes(match), htmlFile)
    )
    .replace(/https?:\/\/ballinfit\.nl[^"'`\s<]+|\/\/ballinfit\.nl[^"'`\s<]+/g, (match) => rewriteOriginUrl(match, htmlFile));
}

function rewriteOriginUrl(rawUrl, htmlFile) {
  const normalizedUrl = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;
  const parsed = new URL(normalizedUrl);

  if (parsed.pathname.startsWith('/cdn/')) {
    const localAssetPath = findLocalAssetPath(parsed);
    return localAssetPath ? relativeFromHtml(htmlFile, localAssetPath) : '';
  }

  if (parsed.pathname === '/' || parsed.pathname.startsWith('/pages/') || parsed.pathname.startsWith('/collections/') || parsed.pathname.startsWith('/products/')) {
    const targetPath = outputPathForRoute(parsed.pathname);
    const relativePath = relativeFromHtml(htmlFile, targetPath);
    return parsed.search ? `${relativePath}${parsed.search}` : relativePath;
  }

  if (parsed.pathname.startsWith('/search')) {
    return relativeFromHtml(htmlFile, 'index.html');
  }

  return '';
}

function rewriteRootPath(value, htmlFile) {
  const [pathname, hash = ''] = value.split('#');
  if (pathname === '/search') {
    return '#';
  }
  if (pathname === '/collections/all' || pathname === '/collections/all?q=BALLIN%20FIT') {
    return relativeFromHtml(htmlFile, 'collections/frontpage/index.html');
  }
  if (pathname.startsWith('/policies/terms-of-service')) {
    return relativeFromHtml(htmlFile, 'policies/terms-of-service/index.html');
  }
  if (pathname.startsWith('/blogs/community/')) {
    return relativeFromHtml(htmlFile, 'pages/community/index.html');
  }
  if (pathname.endsWith('.atom')) {
    return null;
  }
  if (pathname === '/' || pathname.startsWith('/pages/') || pathname.startsWith('/collections/') || pathname.startsWith('/products/')) {
    const targetPath = outputPathForRoute(pathname);
    const relativePath = relativeFromHtml(htmlFile, targetPath);
    return hash ? `${relativePath}#${hash}` : relativePath;
  }
  return value;
}

function findLocalAssetPath(parsedUrl) {
  const fileName = path.basename(parsedUrl.pathname);
  const extension = path.extname(fileName);
  const stem = extension ? fileName.slice(0, -extension.length) : fileName;
  const candidates = assetIndex.get(`${stem}${extension}`) || assetEntries.filter((entry) => entry.base.startsWith(`${stem}--`) && entry.ext === extension);
  if (!candidates.length) {
    return null;
  }
  const preferred = candidates
    .slice()
    .sort((left, right) => left.relativePath.length - right.relativePath.length)[0];
  return preferred.relativePath;
}

function outputPathForRoute(routePath) {
  if (routePath === '/' || !routePath) {
    return 'index.html';
  }
  return path.join(routePath.replace(/^\/+/, ''), 'index.html');
}

function relativeFromHtml(htmlFile, targetRelativePath) {
  return path.relative(path.dirname(htmlFile), path.join(projectRoot, targetRelativePath)).split(path.sep).join('/');
}

async function indexAssets(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await indexAssets(absolutePath);
      continue;
    }

    const relativePath = path.relative(projectRoot, absolutePath);
    const extension = path.extname(entry.name);
    const cleanBase = entry.name.replace(/--[a-f0-9]{8}(?=\.)/, '');
    const record = {
      relativePath,
      base: entry.name,
      ext: extension,
    };
    assetEntries.push(record);
    const key = cleanBase;
    if (!assetIndex.has(key)) {
      assetIndex.set(key, []);
    }
    assetIndex.get(key).push(record);
  }
}

async function collectHtmlFiles(directory, htmlFiles) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await collectHtmlFiles(absolutePath, htmlFiles);
        continue;
      }
      if (entry.name.endsWith('.html')) {
        htmlFiles.push(absolutePath);
      }
    }
  } catch {
    // Ignore roots that are not present.
  }
}

function unescapeSlashes(value) {
  return value.replaceAll('\\/', '/');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
