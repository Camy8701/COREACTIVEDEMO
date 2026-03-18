import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const siteOrigin = 'https://ballinfit.nl';
const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

const trackedHosts = new Set([
  'ballinfit.nl',
  'www.ballinfit.nl',
  'cdn.shopify.com',
  'fonts.shopifycdn.com',
  'fonts.shopify.com',
]);

const assetHostAliases = {
  'ballinfit.nl': 'ballinfit',
  'www.ballinfit.nl': 'ballinfit',
  'cdn.shopify.com': 'shopify-cdn',
  'fonts.shopifycdn.com': 'shopify-fonts',
  'fonts.shopify.com': 'shopify-fonts',
};

const routePaths = [
  '/',
  '/pages/contact',
  '/pages/memberships',
  '/pages/personal-training',
  '/pages/meet-the-trainers',
  '/pages/faq',
  '/pages/classes',
  '/pages/rookie',
  '/pages/ballin-fitness-memberships',
  '/pages/group-class-memberships',
  '/pages/kids',
  '/pages/community',
  '/pages/promo',
  '/pages/schedule',
  '/pages/hyrox',
  '/pages/free-trial',
  '/pages/memberships-v2',
  '/pages/get-credits',
  '/collections/frontpage',
  '/collections/memberships',
  '/products/ballinfit-camo-running-set',
];

const generatedRoots = [
  'assets',
  'capture',
  'pages',
  'collections',
  'products',
  'account',
  'cart',
  'checkout',
  'join',
  '404.html',
  'index.html',
];

const routeSet = new Set(routePaths.map((routePath) => canonicalPageUrl(new URL(routePath, siteOrigin).href)));
const assetMap = new Map();
const pageMap = new Map();
const visitedAssets = new Set();
const pendingAssets = [];
const pageIndex = [];

async function main() {
  await resetGeneratedOutput();
  await fs.mkdir(path.join(projectRoot, 'scripts'), { recursive: true });
  await fs.mkdir(path.join(projectRoot, 'capture', 'raw'), { recursive: true });
  await fs.mkdir(path.join(projectRoot, 'assets'), { recursive: true });

  for (const routePath of routePaths) {
    const pageUrl = new URL(routePath, siteOrigin).href;
    const rawHtml = await fetchText(pageUrl);
    const sourcePath = rawCapturePathForPage(pageUrl);
    await ensureParentDir(sourcePath);
    await fs.writeFile(sourcePath, rawHtml);
    pageMap.set(canonicalPageUrl(pageUrl), {
      pageUrl,
      rawHtml,
      outputPath: outputPathForPage(pageUrl),
    });
  }

  for (const page of pageMap.values()) {
    const { html, title } = await rewritePage(page);
    await ensureParentDir(path.join(projectRoot, page.outputPath));
    await fs.writeFile(path.join(projectRoot, page.outputPath), html);
    pageIndex.push({
      title,
      route: routeHrefForOutputPath(page.outputPath),
      source: page.pageUrl,
    });
  }

  while (pendingAssets.length) {
    const nextUrl = pendingAssets.shift();
    if (!nextUrl) {
      continue;
    }
    await downloadAsset(nextUrl);
  }

  await createSupportFiles();
  await writePageIndex();
}

async function rewritePage(page) {
  const $ = cheerio.load(page.rawHtml, {
    decodeEntities: false,
  });

  $(
    [
      'script[src*="/checkouts/internal/preloads"]',
      'script[src*="shopifycloud"]',
      'script[src*="perf-kit"]',
      'script#shop-js-analytics',
      'script#shopify-features',
      'script#web-pixels-manager-setup',
      'script.analytics',
      'script[data-source-attribution]',
      'link[href*="shopifycloud"]',
      'link[id="shopify-accelerated-checkout-styles"]',
    ].join(', ')
  ).remove();

  $('script:not([src])').each((_, element) => {
    const scriptText = $(element).html() || '';
    if (/monorail|web-pixels|Trekkie|Shopify\.PaymentButton|Shopify\.shopJsCdnBaseUrl|portable-wallets/i.test(scriptText)) {
      $(element).remove();
    }
  });

  $('link[rel="preconnect"], link[rel="dns-prefetch"]').remove();

  $('link[href], script[src], img[src], source[src], source[srcset], video[poster], a[href], form[action], iframe[src]').each(
    (_, element) => {
      rewriteAttributeValue($, page.outputPath, element, 'href');
      rewriteAttributeValue($, page.outputPath, element, 'src');
      rewriteAttributeValue($, page.outputPath, element, 'poster');
      rewriteAttributeValue($, page.outputPath, element, 'action');
      rewriteSrcSet($, page.outputPath, element, 'srcset');
    }
  );

  $('[data-src], [data-bg], [data-bgset], [data-srcset]').each((_, element) => {
    rewriteAttributeValue($, page.outputPath, element, 'data-src');
    rewriteAttributeValue($, page.outputPath, element, 'data-bg');
    rewriteAttributeValue($, page.outputPath, element, 'data-bgset');
    rewriteSrcSet($, page.outputPath, element, 'data-srcset');
  });

  $('[style]').each((_, element) => {
    const value = $(element).attr('style');
    if (!value) {
      return;
    }
    $(element).attr('style', rewriteCssUrls(value, page.pageUrl, page.outputPath));
  });

  $('style').each((_, element) => {
    const cssText = $(element).html();
    if (!cssText) {
      return;
    }
    $(element).html(rewriteCssUrls(cssText, page.pageUrl, page.outputPath));
  });

  $('script:not([src])').each((_, element) => {
    const scriptText = $(element).html();
    if (!scriptText) {
      return;
    }
    $(element).html(rewriteInlineText(scriptText, page.outputPath));
  });

  $('meta[content]').each((_, element) => {
    const value = $(element).attr('content');
    if (!value) {
      return;
    }
    const rewritten = rewriteLooseUrlValue(value, page.pageUrl, page.outputPath);
    if (rewritten !== value) {
      $(element).attr('content', rewritten);
    }
  });

  $('form').each((_, element) => {
    const form = $(element);
    form.attr('data-local-form', 'true');
    form.attr('action', relativeHref(page.outputPath, 'join/index.html'));
    form.attr('method', 'get');
  });

  $('a[href*="/cart"], a[href*="ballinfit.virtuagym.com"]').each((_, element) => {
    const anchor = $(element);
    const href = anchor.attr('href') || '';
    const text = anchor.text().toLowerCase();

    if (href.includes('/cart') || text.includes('cart')) {
      anchor.attr('href', relativeHref(page.outputPath, 'cart/index.html'));
      return;
    }

    anchor.attr('href', localStubHref(text, page.outputPath));
  });

  $('body').attr('data-site-replica', 'ballinfit');

  const supportScript = relativeHref(page.outputPath, 'assets/site.js');
  const supportStyles = relativeHref(page.outputPath, 'assets/site.css');
  $('head').append(`\n<link rel="stylesheet" href="${supportStyles}">\n<script defer src="${supportScript}"></script>\n`);

  const title = normalizeTitle($('title').text() || page.pageUrl);
  return {
    html: $.html(),
    title,
  };
}

function rewriteAttributeValue($, fromOutputPath, element, attributeName) {
  const originalValue = $(element).attr(attributeName);
  if (!originalValue) {
    return;
  }

  const rewritten = rewriteLooseUrlValue(originalValue, pageUrlForOutputPath(fromOutputPath), fromOutputPath);
  if (rewritten !== originalValue) {
    $(element).attr(attributeName, rewritten);
  }
}

function rewriteSrcSet($, fromOutputPath, element, attributeName) {
  const originalValue = $(element).attr(attributeName);
  if (!originalValue) {
    return;
  }

  const rewritten = originalValue
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [rawUrl, descriptor] = entry.split(/\s+/, 2);
      const nextUrl = rewriteLooseUrlValue(rawUrl, pageUrlForOutputPath(fromOutputPath), fromOutputPath);
      return descriptor ? `${nextUrl} ${descriptor}` : nextUrl;
    })
    .join(', ');

  $(element).attr(attributeName, rewritten);
}

function rewriteLooseUrlValue(value, basePageUrl, fromOutputPath) {
  if (!value || value.startsWith('data:') || value.startsWith('mailto:') || value.startsWith('tel:') || value.startsWith('javascript:')) {
    return value;
  }

  if (value.startsWith('#')) {
    return value;
  }

  const normalizedUrl = normalizeUrl(value, basePageUrl);
  if (!normalizedUrl) {
    return value;
  }

  if (isInternalPageUrl(normalizedUrl)) {
    return relativeHref(fromOutputPath, outputPathForPage(normalizedUrl)) + hashForUrl(normalizedUrl);
  }

  if (isTrackedAssetDirectory(normalizedUrl)) {
    return ensureTrailingSlash(relativeHref(fromOutputPath, localDirectoryPathForUrl(normalizedUrl)));
  }

  if (isTrackedAsset(normalizedUrl)) {
    queueAsset(normalizedUrl);
    return relativeHref(fromOutputPath, localPathForAsset(normalizedUrl));
  }

  const parsed = new URL(normalizedUrl);
  if (parsed.hostname.includes('virtuagym.com')) {
    return localStubHref('', fromOutputPath);
  }

  if (parsed.origin === siteOrigin && parsed.pathname === '/cart') {
    return relativeHref(fromOutputPath, 'cart/index.html');
  }

  if (parsed.origin === siteOrigin && parsed.pathname === '/checkout') {
    return relativeHref(fromOutputPath, 'checkout/index.html');
  }

  return value;
}

function rewriteInlineText(text, fromOutputPath) {
  return text.replace(/https?:\/\/[^"'`\s)]+|\/\/[^"'`\s)]+/g, (match) => {
    const rewritten = rewriteLooseUrlValue(match, siteOrigin, fromOutputPath);
    return rewritten;
  });
}

function rewriteCssUrls(cssText, basePageUrl, fromOutputPath) {
  return cssText.replace(/url\(([^)]+)\)/g, (_, rawValue) => {
    const unquoted = rawValue.trim().replace(/^['"]|['"]$/g, '');
    const rewritten = rewriteLooseUrlValue(unquoted, basePageUrl, fromOutputPath);
    return `url("${rewritten}")`;
  });
}

async function downloadAsset(assetUrl) {
  const canonicalUrl = canonicalAssetUrl(assetUrl);
  if (!canonicalUrl || visitedAssets.has(canonicalUrl)) {
    return;
  }

  visitedAssets.add(canonicalUrl);

  const response = await fetch(canonicalUrl, {
    headers: {
      'user-agent': userAgent,
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch asset ${canonicalUrl}: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const localPath = localPathForAsset(canonicalUrl, contentType);
  const absolutePath = path.join(projectRoot, localPath);
  await ensureParentDir(absolutePath);

  if (contentType.includes('text/css')) {
    const cssText = await response.text();
    const rewrittenCss = rewriteCssUrls(cssText, canonicalUrl, localPath);
    await fs.writeFile(absolutePath, rewrittenCss);
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(absolutePath, buffer);
}

async function createSupportFiles() {
  const siteCssPath = path.join(projectRoot, 'assets', 'site.css');
  const siteJsPath = path.join(projectRoot, 'assets', 'site.js');
  const dataDir = path.join(projectRoot, 'assets', 'data');
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(path.join(projectRoot, 'cart'), { recursive: true });
  await fs.mkdir(path.join(projectRoot, 'checkout'), { recursive: true });
  await fs.mkdir(path.join(projectRoot, 'account'), { recursive: true });
  await fs.mkdir(path.join(projectRoot, 'join'), { recursive: true });

  await fs.writeFile(
    siteCssPath,
    `:root{--replica-accent:#101010;--replica-soft:#f3f3f3;--replica-line:rgba(0,0,0,.12)}.replica-shell{max-width:960px;margin:0 auto;padding:96px 24px}.replica-card{background:#fff;border:1px solid var(--replica-line);border-radius:24px;padding:32px;box-shadow:0 18px 60px rgba(0,0,0,.06)}.replica-title{font-size:clamp(2rem,4vw,3.25rem);line-height:1;letter-spacing:-.04em;margin:0 0 16px}.replica-copy{max-width:48rem;font-size:1rem;line-height:1.65}.replica-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.replica-button{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:14px 22px;background:#111;color:#fff;text-decoration:none;font-weight:700}.replica-button--ghost{background:transparent;color:#111;border:1px solid var(--replica-line)}.replica-form-note{margin-top:12px;color:rgba(0,0,0,.65);font-size:.95rem}.replica-inline-message{margin-top:12px;font-size:.95rem;color:#0b5d1e}.replica-cart-page .product-item{display:grid;grid-template-columns:96px 1fr auto;gap:16px;align-items:center;padding:18px 0;border-top:1px solid var(--replica-line)}.replica-cart-page .product-item:first-child{border-top:0}.replica-cart-page img{width:96px;height:96px;object-fit:cover;border-radius:18px}.replica-cart-total{display:flex;justify-content:space-between;gap:16px;font-weight:700;padding-top:18px;margin-top:18px;border-top:1px solid var(--replica-line)}@media (max-width:720px){.replica-shell{padding:72px 18px}.replica-card{padding:24px}.replica-cart-page .product-item{grid-template-columns:72px 1fr}.replica-cart-page .product-item .replica-price{grid-column:2}}`
  );

  await fs.writeFile(
    siteJsPath,
    `const cartKey='ballinfit-replica-cart';const money=(value)=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(value);const readCart=()=>{try{return JSON.parse(localStorage.getItem(cartKey)||'[]')}catch{return[]}};const writeCart=(items)=>localStorage.setItem(cartKey,JSON.stringify(items));const renderCartCount=()=>{const count=readCart().reduce((sum,item)=>sum+item.quantity,0);document.querySelectorAll('a[href$="cart/"],a[href$="cart"],[data-cart-count]').forEach((node)=>{if(node.hasAttribute('data-cart-count')){node.textContent=String(count);return}const text=node.textContent||'';node.textContent=text.replace(/\\(\\d+\\)/,'('+count+')')})};const productMeta=()=>{const title=document.querySelector('h1')?.textContent?.trim()||document.title.replace(/\\s*\\|.*$/,'').trim();const image=document.querySelector('img[src]')?.getAttribute('src')||'';const priceText=[...document.querySelectorAll('*')].map((node)=>node.textContent?.trim()||'').find((text)=>/^€\\s?\\d/.test(text));const price=priceText?Number(priceText.replace(/[^\\d,]/g,'').replace(',','.')):0;return{title,image,price}};const bindProductForms=()=>{document.querySelectorAll('form').forEach((form)=>{const action=form.getAttribute('action')||'';if(!form.matches('[data-local-form=\"true\"]')&&!(action.includes('/cart')||form.querySelector('[name=\"add\"]')||form.querySelector('[type=\"submit\"]'))){return}form.addEventListener('submit',(event)=>{event.preventDefault();const meta=productMeta();if(meta.price||location.pathname.includes('/products/')){const items=readCart();const existing=items.find((item)=>item.title===meta.title);if(existing){existing.quantity+=1}else{items.push({...meta,quantity:1})}writeCart(items);renderCartCount();showInlineMessage(form,'Added to local demo cart.');return}showInlineMessage(form,'This form is stubbed locally for the standalone demo.');})})};const showInlineMessage=(target,message)=>{let node=target.parentElement?.querySelector('.replica-inline-message');if(!node){node=document.createElement('p');node.className='replica-inline-message';target.parentElement?.appendChild(node)}node.textContent=message};const renderCartPage=()=>{const mount=document.querySelector('[data-cart-page]');if(!mount){return}const items=readCart();if(!items.length){mount.innerHTML='<p class=\"replica-copy\">Your demo cart is empty.</p>';return}const total=items.reduce((sum,item)=>sum+item.price*item.quantity,0);mount.innerHTML=items.map((item)=>\`<div class=\"product-item\"><img src=\"\${item.image}\" alt=\"\"><div><strong>\${item.title}</strong><div>Quantity: \${item.quantity}</div></div><div class=\"replica-price\">\${money(item.price*item.quantity)}</div></div>\`).join('')+\`<div class=\"replica-cart-total\"><span>Total</span><span>\${money(total)}</span></div>\`};document.addEventListener('DOMContentLoaded',()=>{renderCartCount();bindProductForms();renderCartPage();document.querySelectorAll('a[href$=\"checkout/\"],a[href$=\"checkout\"]').forEach((node)=>node.addEventListener('click',(event)=>{event.preventDefault();location.href=node.getAttribute('href')}))});`
  );

  await fs.writeFile(
    path.join(projectRoot, 'cart', 'index.html'),
    buildStubPage({
      title: 'Cart',
      heading: 'Local cart demo',
      copy: 'Checkout is backend-only on the original site, so this standalone replica keeps cart behavior local and stops before payment.',
      bodyClass: 'replica-cart-page',
      innerHtml:
        '<div class="replica-actions"><a class="replica-button" href="../checkout/">Continue to checkout stub</a><a class="replica-button replica-button--ghost" href="../collections/frontpage/">Back to active wear</a></div><div data-cart-page></div>',
    })
  );

  await fs.writeFile(
    path.join(projectRoot, 'checkout', 'index.html'),
    buildStubPage({
      title: 'Checkout',
      heading: 'Checkout placeholder',
      copy: 'The original checkout is Shopify-hosted and cannot be reproduced as a real payment flow inside a static repo. This page preserves the handoff point with a local placeholder.',
      innerHtml:
        '<div class="replica-actions"><a class="replica-button" href="../cart/">Return to cart</a><a class="replica-button replica-button--ghost" href="../pages/contact/">Contact the team</a></div>',
    })
  );

  await fs.writeFile(
    path.join(projectRoot, 'account', 'index.html'),
    buildStubPage({
      title: 'Account',
      heading: 'Account portal placeholder',
      copy: 'The live site routes account access through Virtuagym. In this standalone replica the account flow is stubbed locally so the project has no dependency on the original backend.',
      innerHtml:
        '<div class="replica-actions"><a class="replica-button" href="../pages/memberships/">View memberships</a><a class="replica-button replica-button--ghost" href="../pages/contact/">Contact support</a></div>',
    })
  );

  await fs.writeFile(
    path.join(projectRoot, 'join', 'index.html'),
    buildStubPage({
      title: 'Join',
      heading: 'Membership handoff placeholder',
      copy: 'Membership signup on the source site is powered by Virtuagym. This local page replaces that dependency with a static handoff so the replica stays fully self-contained.',
      innerHtml:
        '<div class="replica-actions"><a class="replica-button" href="../pages/free-trial/">Start from the free-trial page</a><a class="replica-button replica-button--ghost" href="../pages/memberships/">See plan details</a></div>',
    })
  );

  await fs.writeFile(
    path.join(projectRoot, '404.html'),
    buildStubPage({
      title: 'Not found',
      heading: 'Page not found',
      copy: 'This replica only includes the captured public routes from the live site.',
      assetPrefix: './assets',
      innerHtml: '<div class="replica-actions"><a class="replica-button" href="./">Go home</a></div>',
    })
  );
}

async function writePageIndex() {
  const output = JSON.stringify(pageIndex.sort((a, b) => a.route.localeCompare(b.route)), null, 2);
  await fs.writeFile(path.join(projectRoot, 'assets', 'data', 'pages.json'), output);
}

function buildStubPage({ title, heading, copy, innerHtml = '', bodyClass = '', assetPrefix = '../assets' }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)} | BALLINFIT Replica</title>
    <link rel="stylesheet" href="${assetPrefix}/site.css">
    <script defer src="${assetPrefix}/site.js"></script>
  </head>
  <body class="${bodyClass}">
    <main class="replica-shell">
      <section class="replica-card">
        <p>Standalone BALLINFIT replica</p>
        <h1 class="replica-title">${escapeHtml(heading)}</h1>
        <p class="replica-copy">${escapeHtml(copy)}</p>
        ${innerHtml}
      </section>
    </main>
  </body>
</html>`;
}

function queueAsset(assetUrl) {
  const canonicalUrl = canonicalAssetUrl(assetUrl);
  if (!canonicalUrl || assetMap.has(canonicalUrl)) {
    return;
  }

  assetMap.set(canonicalUrl, localPathForAsset(canonicalUrl));
  pendingAssets.push(canonicalUrl);
}

function isTrackedAsset(assetUrl) {
  const parsed = safeUrl(assetUrl);
  if (!parsed) {
    return false;
  }
  return trackedHosts.has(parsed.hostname) && hasAssetLikePath(parsed.pathname);
}

function hasAssetLikePath(pathname) {
  return /\.(?:css|js|mjs|json|jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf|otf|eot|mp4|webm|avif|ico)$/i.test(pathname);
}

function isTrackedAssetDirectory(assetUrl) {
  const parsed = safeUrl(assetUrl);
  if (!parsed) {
    return false;
  }
  return trackedHosts.has(parsed.hostname) && /\/assets\/$/i.test(parsed.pathname);
}

function isInternalPageUrl(value) {
  const parsed = safeUrl(value);
  if (!parsed || parsed.origin !== siteOrigin) {
    return false;
  }

  if (parsed.pathname === '/cart') {
    return true;
  }

  return routeSet.has(canonicalPageUrl(parsed.href));
}

function localStubHref(linkText, fromOutputPath) {
  const normalizedText = (linkText || '').toLowerCase();
  if (normalizedText.includes('log in') || normalizedText.includes('account')) {
    return relativeHref(fromOutputPath, 'account/index.html');
  }
  if (normalizedText.includes('schedule')) {
    return relativeHref(fromOutputPath, 'pages/schedule/index.html');
  }
  if (normalizedText.includes('credit')) {
    return relativeHref(fromOutputPath, 'pages/get-credits/index.html');
  }
  if (normalizedText.includes('trial')) {
    return relativeHref(fromOutputPath, 'pages/free-trial/index.html');
  }
  return relativeHref(fromOutputPath, 'join/index.html');
}

function rawCapturePathForPage(pageUrl) {
  const outputPath = outputPathForPage(pageUrl);
  const dir = outputPath === 'index.html' ? 'home' : outputPath.replace(/\/index\.html$/, '');
  return path.join(projectRoot, 'capture', 'raw', dir, 'source.html');
}

function outputPathForPage(pageUrl) {
  const parsed = safeUrl(pageUrl);
  if (!parsed) {
    throw new Error(`Invalid page url: ${pageUrl}`);
  }
  if (parsed.pathname === '/' || parsed.pathname === '') {
    return 'index.html';
  }
  return path.join(parsed.pathname.replace(/^\/+/, ''), 'index.html');
}

function routeHrefForOutputPath(outputPath) {
  if (outputPath === 'index.html') {
    return '/';
  }
  return `/${outputPath.replace(/\/index\.html$/, '/')}`;
}

function pageUrlForOutputPath(outputPath) {
  return new URL(routeHrefForOutputPath(outputPath), siteOrigin).href;
}

function localPathForAsset(assetUrl, contentType = '') {
  const existing = assetMap.get(canonicalAssetUrl(assetUrl));
  if (existing) {
    return existing;
  }

  const parsed = new URL(assetUrl);
  const cleanPath = decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
  const extension = inferExtension(cleanPath, contentType);
  const queryHash = parsed.search
    ? `--${crypto.createHash('sha1').update(parsed.search).digest('hex').slice(0, 8)}`
    : '';
  const basePath = cleanPath || `asset${extension || '.bin'}`;
  const ext = path.extname(basePath) || extension;
  const stem = ext ? basePath.slice(0, -ext.length) : basePath;
  const finalRelativePath = path.join('assets', 'origin', assetHostSegment(parsed.hostname), `${stem}${queryHash}${ext || ''}`);
  assetMap.set(canonicalAssetUrl(assetUrl), finalRelativePath);
  return finalRelativePath;
}

function localDirectoryPathForUrl(assetUrl) {
  const parsed = new URL(assetUrl);
  return path.join('assets', 'origin', assetHostSegment(parsed.hostname), decodeURIComponent(parsed.pathname.replace(/^\/+/, '')));
}

function inferExtension(filePath, contentType) {
  const currentExtension = path.extname(filePath);
  if (currentExtension) {
    return currentExtension;
  }
  if (contentType.includes('text/css')) return '.css';
  if (contentType.includes('javascript')) return '.js';
  if (contentType.includes('json')) return '.json';
  if (contentType.includes('svg')) return '.svg';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('jpeg')) return '.jpg';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('woff2')) return '.woff2';
  if (contentType.includes('woff')) return '.woff';
  if (contentType.includes('mp4')) return '.mp4';
  return '';
}

function normalizeUrl(value, basePageUrl) {
  try {
    if (value.startsWith('//')) {
      return new URL(`https:${value}`).href;
    }
    return new URL(value, basePageUrl).href;
  } catch {
    return null;
  }
}

function canonicalPageUrl(pageUrl) {
  const parsed = new URL(pageUrl, siteOrigin);
  const pathname = parsed.pathname === '/' ? '/' : parsed.pathname.replace(/\/+$/, '');
  return new URL(pathname || '/', siteOrigin).href;
}

function canonicalAssetUrl(assetUrl) {
  const parsed = safeUrl(assetUrl);
  if (!parsed) {
    return null;
  }
  parsed.hash = '';
  return parsed.href;
}

function hashForUrl(value) {
  const parsed = safeUrl(value);
  return parsed?.hash || '';
}

function relativeHref(fromOutputPath, toOutputPath) {
  const href = path.relative(path.dirname(fromOutputPath), toOutputPath).split(path.sep).join('/');
  return href || './';
}

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

async function resetGeneratedOutput() {
  for (const target of generatedRoots) {
    await fs.rm(path.join(projectRoot, target), { force: true, recursive: true });
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': userAgent,
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function ensureParentDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function safeUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function normalizeTitle(title) {
  return title.replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function assetHostSegment(hostname) {
  return assetHostAliases[hostname] || hostname.replaceAll('.', '-');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
