const fallbackCartKey = 'coreactive-replica-cart';
const authEmailKey = 'coreactive-auth-email';
const localeStorageKey = 'coreactive-locale';

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character] || character;
  });

const findSiteRootUrl = () => {
  const currentScript =
    document.currentScript instanceof HTMLScriptElement ? document.currentScript : null;
  const fallbackScript = [...document.scripts].find((node) =>
    /(?:^|\/)assets\/site\.js(?:\?|$)/.test(node.src || '')
  );
  const source = currentScript?.src || fallbackScript?.src;

  if (source) {
    return new URL('../', source);
  }

  return new URL('./', window.location.href);
};

const siteRootUrl = findSiteRootUrl();

const siteUrl = (path = '') => new URL(path, siteRootUrl).toString();

const normalizePath = (href) => {
  try {
    const pathname = new URL(href, window.location.href).pathname;
    const compact = pathname
      .replace(/\/index\.html$/, '/')
      .replace(/\/{2,}/g, '/')
      .replace(/\/+$/, '/');
    return compact || '/';
  } catch {
    return '/';
  }
};

const currentPath = normalizePath(window.location.href);

const replaceLegacyText = (value = '') =>
  String(value)
    .replace(/B\.\s*ALL\.\s*IN\./gi, 'COREACTIVE')
    .replace(/Ballin Fit/gi, 'CoreActive')
    .replace(/BallinFit/gi, 'CoreActive')
    .replace(/Ballinfit/gi, 'CoreActive')
    .replace(/Ballin group classes/gi, 'UrbanFit')
    .replace(/Group class memberships/gi, 'Memberships')
    .replace(/\bBALLINFIT\b/g, 'COREACTIVE')
    .replace(/\bballinfit\b/g, 'coreactive')
    .replace(/\bHYROX\b/g, 'PulseLab')
    .replace(/\bhyrox\b/g, 'pulselab')
    .replace(/first 30 days free/gi, 'first 7 days free')
    .replace(/30 days free/gi, '7 days free');

const legacyLinkMap = [
  { match: /\/pages\/hyrox\/?$/i, href: 'pages/pulselab/index.html' },
  { match: /\/pages\/community\/?$/i, href: 'pages/about/index.html' },
  { match: /\/pages\/ballin-fitness-memberships\/?$/i, href: 'pages/memberships/index.html' },
  { match: /\/pages\/group-class-memberships\/?$/i, href: 'pages/memberships/index.html' },
  { match: /\/pages\/memberships-v2\/?$/i, href: 'pages/memberships/index.html' },
  { match: /\/pages\/free-trial\/?$/i, href: 'pages/memberships/index.html' },
  { match: /\/pages\/get-credits\/?$/i, href: 'pages/memberships/index.html' },
  { match: /\/pages\/meet-the-trainers\/?$/i, href: 'pages/about/index.html' },
  { match: /\/pages\/rookie\/?$/i, href: 'pages/classes/index.html' },
  { match: /\/pages\/promo\/?$/i, href: 'pages/memberships/index.html' },
  { match: /\/products\/ballinfit-camo-running-set\/?$/i, href: 'products/coreactive-resistance-band-set/index.html' },
];

const svgIcons = {
  chevron: `<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2 4.25 6 8l4-3.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3"></path></svg>`,
  menu: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7.5h16M4 12h16M4 16.5h16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>`,
};

const buildHeaderConfig = () => ({
  logo: {
    alt: 'CoreActive Sports',
    href: 'index.html',
    src: 'assets/brand/coreactive-sports-logo.avif',
  },
  languages: [
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
  ],
  left: [
    {
      key: 'urbanfit',
      label: 'UrbanFit',
      kind: 'mega',
      href: 'pages/classes/index.html',
      columns: [
        {
          title: 'Programs',
          links: [
            { label: 'UrbanFit Men', href: 'pages/urbanfit-men/index.html' },
            { label: 'UrbanFit Women', href: 'pages/urbanfit-women/index.html' },
            { label: 'UrbanFit Kids', href: 'pages/kids/index.html' },
          ],
        },
        {
          title: 'Experience',
          links: [
            { label: 'Training Philosophy', href: 'pages/classes/index.html#philosophy' },
            { label: 'Class Types', href: 'pages/classes/index.html#programs' },
            { label: 'Coaching Style', href: 'pages/about/index.html#approach' },
          ],
        },
        {
          title: 'Access',
          links: [
            { label: 'Membership Options', href: 'pages/memberships/index.html#urbanfit-memberships' },
            { label: 'Schedule', href: 'pages/schedule/index.html' },
            { label: 'Join UrbanFit', href: 'join/index.html' },
          ],
        },
        {
          title: 'Support',
          links: [
            { label: 'Contact', href: 'pages/contact/index.html' },
            { label: 'FAQ', href: 'pages/faq/index.html' },
          ],
        },
      ],
      mobileLinks: [
        { label: 'UrbanFit Men', href: 'pages/urbanfit-men/index.html' },
        { label: 'UrbanFit Women', href: 'pages/urbanfit-women/index.html' },
        { label: 'UrbanFit Kids', href: 'pages/kids/index.html' },
        { label: 'Training Philosophy', href: 'pages/classes/index.html#philosophy' },
        { label: 'Class Types', href: 'pages/classes/index.html#programs' },
        { label: 'Join UrbanFit', href: 'join/index.html' },
      ],
    },
    {
      key: 'pulselab',
      label: 'PulseLab',
      kind: 'mega',
      href: 'pages/pulselab/index.html',
      columns: [
        {
          title: 'PulseLab',
          links: [
            { label: 'Overview', href: 'pages/pulselab/index.html' },
            { label: 'Training Method', href: 'pages/pulselab/index.html' },
          ],
        },
        {
          title: 'Performance',
          links: [
            { label: 'Who It Is For', href: 'pages/pulselab/index.html#who-its-for' },
            { label: 'Benefits', href: 'pages/pulselab/index.html' },
            { label: 'Results Focus', href: 'pages/pulselab/index.html#benefits' },
          ],
        },
        {
          title: 'Access',
          links: [
            { label: 'Membership Options', href: 'pages/memberships/index.html#pulselab-memberships' },
            { label: 'Schedule', href: 'pages/schedule/index.html' },
            { label: 'Join PulseLab', href: 'join/index.html' },
          ],
        },
      ],
      mobileLinks: [
        { label: 'Overview', href: 'pages/pulselab/index.html' },
        { label: 'Training Method', href: 'pages/pulselab/index.html' },
        { label: 'Who It Is For', href: 'pages/pulselab/index.html#who-its-for' },
        { label: 'Membership Options', href: 'pages/memberships/index.html#pulselab-memberships' },
        { label: 'Join PulseLab', href: 'join/index.html' },
      ],
    },
    {
      key: 'memberships',
      label: 'Memberships',
      kind: 'mega',
      href: 'pages/memberships/index.html',
      columns: [
        {
          title: 'Options',
          links: [
            { label: 'UrbanFit Memberships', href: 'pages/memberships/index.html#urbanfit-memberships' },
            { label: 'PulseLab Memberships', href: 'pages/memberships/index.html#pulselab-memberships' },
            { label: 'Credits', href: 'pages/memberships/index.html#credits' },
          ],
        },
        {
          title: 'Information',
          links: [
            { label: 'Pricing', href: 'pages/memberships/index.html#plans' },
            { label: 'How Membership Works', href: 'pages/memberships/index.html#how-it-works' },
            { label: 'Terms', href: 'policies/terms-of-service/index.html' },
          ],
        },
        {
          title: 'Join',
          links: [
            { label: 'Join Online', href: 'join/index.html' },
            { label: 'Member Access', href: 'join/index.html' },
            { label: 'Contact', href: 'pages/contact/index.html' },
          ],
        },
      ],
      mobileLinks: [
        { label: 'UrbanFit Memberships', href: 'pages/memberships/index.html#urbanfit-memberships' },
        { label: 'PulseLab Memberships', href: 'pages/memberships/index.html#pulselab-memberships' },
        { label: 'Credits', href: 'pages/memberships/index.html#credits' },
        { label: 'Pricing', href: 'pages/memberships/index.html#plans' },
        { label: 'Join Online', href: 'join/index.html' },
      ],
    },
    {
      key: 'schedule',
      label: 'Schedule',
      kind: 'link',
      href: 'pages/schedule/index.html',
    },
  ],
  right: [
    {
      key: 'about',
      label: 'About',
      kind: 'link',
      href: 'pages/about/index.html',
    },
    {
      key: 'contact',
      label: 'Contact',
      kind: 'link',
      href: 'pages/contact/index.html',
    },
  ],
  auth: {
    access: { label: 'Access', href: 'join/index.html' },
    shop: { label: 'Shop', href: 'collections/frontpage/index.html' },
  },
  mobileDirectLinks: [
    { label: 'Schedule', href: 'pages/schedule/index.html' },
    { label: 'About', href: 'pages/about/index.html' },
    { label: 'Contact', href: 'pages/contact/index.html' },
  ],
});

const collectHeaderPaths = (item) => {
  const paths = [];

  if (item.href) {
    paths.push(item.href);
  }

  if (Array.isArray(item.columns)) {
    item.columns.forEach((column) => {
      column.links.forEach((link) => {
        paths.push(link.href);
      });
    });
  }

  if (Array.isArray(item.mobileLinks)) {
    item.mobileLinks.forEach((link) => {
      paths.push(link.href);
    });
  }

  return [...new Set(paths)];
};

const headerItemIsCurrent = (item) =>
  collectHeaderPaths(item).some((path) => normalizePath(siteUrl(path)) === currentPath);

const readStoredLocale = (languages) => {
  const supported = new Set(languages.map((language) => language.code));
  let stored = '';
  try {
    stored = (localStorage.getItem(localeStorageKey) || '').toLowerCase();
  } catch {
    stored = '';
  }
  const fallback = languages[0]?.code || 'en';
  return supported.has(stored) ? stored : fallback;
};

const renderLanguageToggle = (languages, locale, context) =>
  `<div class="ca-language-toggle" role="group" aria-label="Language selector">
    ${languages
      .map((language) => {
        const active = language.code === locale;
        return `<button type="button" class="ca-language-option${
          active ? ' is-active' : ''
        }" data-locale-option="${escapeHtml(language.code)}" data-locale-context="${escapeHtml(
          context
        )}" aria-pressed="${active}">${escapeHtml(language.label)}</button>`;
      })
      .join('')}
  </div>`;

const renderDesktopItem = (item) => {
  const active = headerItemIsCurrent(item);

  if (item.kind === 'mega') {
    const dropdownLinks =
      item.mobileLinks?.length
        ? item.mobileLinks
        : item.columns?.flatMap((column) => column.links) || [];

    return `<li class="ca-nav-item${active ? ' is-current' : ''}">
      <button type="button" class="ca-nav-trigger" data-menu-trigger="${escapeHtml(
        item.key
      )}" aria-expanded="false" aria-controls="ca-panel-${escapeHtml(item.key)}">
        <span>${escapeHtml(item.label)}</span>
        ${svgIcons.chevron}
      </button>
      <div class="ca-floating-menu" data-menu-panel="${escapeHtml(item.key)}" id="ca-panel-${escapeHtml(
        item.key
      )}" hidden>
        ${dropdownLinks
          .map(
            (link) =>
              `<a class="ca-floating-link" href="${siteUrl(link.href)}">${escapeHtml(link.label)}</a>`
          )
          .join('')}
      </div>
    </li>`;
  }

  return `<li class="ca-nav-item${active ? ' is-current' : ''}">
    <a class="ca-nav-link" href="${siteUrl(item.href)}">${escapeHtml(item.label)}</a>
  </li>`;
};

const renderMobileAccordion = (item) =>
  `<div class="ca-mobile-group" data-mobile-accordion="${escapeHtml(item.key)}">
    <button type="button" class="ca-mobile-group-toggle" data-mobile-accordion-toggle="${escapeHtml(
      item.key
    )}" aria-expanded="false" aria-controls="ca-mobile-panel-${escapeHtml(item.key)}">
      <span>${escapeHtml(item.label)}</span>
      ${svgIcons.chevron}
    </button>
    <div class="ca-mobile-group-panel" id="ca-mobile-panel-${escapeHtml(item.key)}" hidden>
      ${item.mobileLinks
        .map(
          (link) =>
            `<a class="ca-mobile-sublink" href="${siteUrl(
              link.href
            )}" data-mobile-close-link>${escapeHtml(link.label)}</a>`
        )
        .join('')}
    </div>
  </div>`;

const renderReplicaHeader = (config, locale) => {
  const localeLabel =
    config.languages.find((language) => language.code === locale)?.label || locale.toUpperCase();

  return `<header class="replica-site-header" role="banner">
    <div class="ca-header-shell" data-ca-header-shell>
      <div class="ca-header-desktop-bar">
        <nav class="ca-primary-nav ca-primary-nav--left" aria-label="Primary navigation">
          <ul class="ca-nav-list">
            ${config.left.map(renderDesktopItem).join('')}
          </ul>
        </nav>
        <div class="ca-logo-slot">
          <a class="ca-logo-link" href="${siteUrl(config.logo.href)}" aria-label="CoreActive home">
            <img src="${siteUrl(config.logo.src)}" alt="${escapeHtml(config.logo.alt)}" loading="eager">
          </a>
        </div>
        <div class="ca-header-right">
          <nav class="ca-primary-nav ca-primary-nav--right" aria-label="Secondary navigation">
            <ul class="ca-nav-list">
              ${config.right.map(renderDesktopItem).join('')}
            </ul>
          </nav>
          <div class="ca-header-utility">
            ${renderLanguageToggle(config.languages, locale, 'desktop')}
            <div class="ca-auth-links">
              <a class="ca-auth-link ca-auth-link--access" href="${siteUrl(
                config.auth.access.href
              )}">${escapeHtml(config.auth.access.label)}</a>
              <a class="ca-auth-link ca-auth-link--shop" href="${siteUrl(
                config.auth.shop.href
              )}">${escapeHtml(config.auth.shop.label)}</a>
            </div>
          </div>
        </div>
      </div>

      <div class="ca-mobile-bar">
        <button type="button" class="ca-mobile-toggle" data-mobile-toggle aria-expanded="false" aria-controls="ca-mobile-drawer" aria-label="Open navigation menu">
          ${svgIcons.menu}
        </button>
        <a class="ca-logo-link ca-logo-link--mobile" href="${siteUrl(
          config.logo.href
        )}" aria-label="CoreActive home">
          <img src="${siteUrl(config.logo.src)}" alt="${escapeHtml(config.logo.alt)}" loading="eager">
        </a>
        <div class="ca-mobile-meta">
          <span data-locale-current>${escapeHtml(localeLabel)}</span>
        </div>
      </div>
    </div>

    <div class="ca-mobile-drawer" id="ca-mobile-drawer" data-mobile-drawer hidden>
      <button type="button" class="ca-mobile-overlay" data-mobile-close aria-label="Close navigation menu"></button>
      <div class="ca-mobile-surface" role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <div class="ca-mobile-drawer-header">
          <span class="ca-mobile-kicker">Navigation</span>
          <button type="button" class="ca-mobile-close" data-mobile-close aria-label="Close navigation menu">
            ${svgIcons.close}
          </button>
        </div>
        <div class="ca-mobile-scroll">
          <div class="ca-mobile-menu">
            ${config.left
              .filter((item) => item.kind === 'mega')
              .map(renderMobileAccordion)
              .join('')}
            ${config.mobileDirectLinks
              .map(
                (link) =>
                  `<a class="ca-mobile-link" href="${siteUrl(
                    link.href
                  )}" data-mobile-close-link>${escapeHtml(link.label)}</a>`
              )
              .join('')}
          </div>

          <div class="ca-mobile-utility">
            <div class="ca-mobile-utility-block">
              <span class="ca-mobile-label">Language</span>
              ${renderLanguageToggle(config.languages, locale, 'mobile')}
            </div>
            <div class="ca-mobile-auth">
              <a class="ca-auth-link ca-auth-link--access" href="${siteUrl(
                config.auth.access.href
              )}" data-mobile-close-link>${escapeHtml(config.auth.access.label)}</a>
              <a class="ca-auth-link ca-auth-link--shop" href="${siteUrl(
                config.auth.shop.href
              )}" data-mobile-close-link>${escapeHtml(config.auth.shop.label)}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>`;
};

const buildFooterConfig = () => ({
  brand: 'COREACTIVE',
  links: [
    { label: 'Memberships', href: 'pages/memberships/index.html' },
    { label: 'UrbanFit', href: 'pages/classes/index.html' },
    { label: 'PulseLab', href: 'pages/pulselab/index.html' },
    { label: 'Schedule', href: 'pages/schedule/index.html' },
    { label: 'Shop', href: 'collections/frontpage/index.html' },
    { label: 'About', href: 'pages/about/index.html' },
    { label: 'Contact', href: 'pages/contact/index.html' },
    { label: 'FAQ', href: 'pages/faq/index.html' },
  ],
  location: {
    title: 'Where To Find Us',
    name: 'CoreActive',
    lines: ['Performance Training', 'United Kingdom'],
    cta: { label: 'Contact The Team', href: 'pages/contact/index.html' },
  },
  online: {
    title: 'CoreActive Online',
    links: [
      { label: 'Access', href: 'join/index.html' },
      { label: 'Shop', href: 'collections/frontpage/index.html' },
      { label: 'Join CoreActive', href: 'join/index.html' },
    ],
  },
  hours: [
    { label: 'Mon - Fri', value: '7.00AM - 10.00PM' },
    { label: 'Sat - Sun', value: '9.00AM - 5.00PM' },
  ],
});

const renderReplicaFooter = (config) => `
  <footer class="ca-site-footer" role="contentinfo">
    <div class="ca-footer-shell">
      <div class="ca-footer-columns">
        <div class="ca-footer-column ca-footer-column--brand">
          <a class="ca-footer-logo" href="${siteUrl('index.html')}" aria-label="CoreActive home">
            <img src="${siteUrl('assets/brand/coreactive-sports-logo.avif')}" alt="CoreActive Sports" loading="lazy">
          </a>
          <div class="ca-footer-navigation">
            <span class="ca-footer-label">Go To</span>
            <div class="ca-footer-links">
              ${config.links
                .map(
                  (link) =>
                    `<a href="${siteUrl(link.href)}">${escapeHtml(link.label)}</a>`
                )
                .join('')}
            </div>
          </div>
        </div>
        <div class="ca-footer-column">
          <span class="ca-footer-label">${escapeHtml(config.location.title)}</span>
          <div class="ca-footer-location">
            <strong>${escapeHtml(config.location.name)}</strong>
            ${config.location.lines.map((line) => `<span>${escapeHtml(line)}</span>`).join('')}
            <a class="ca-footer-inline-link" href="${siteUrl(
              config.location.cta.href
            )}">${escapeHtml(config.location.cta.label)}</a>
          </div>
        </div>
        <div class="ca-footer-column">
          <span class="ca-footer-label">Opening Hours</span>
          <div class="ca-footer-hours">
            ${config.hours
              .map(
                (entry) => `
                  <div class="ca-footer-hour">
                    <span>${escapeHtml(entry.label)}</span>
                    <strong>${escapeHtml(entry.value)}</strong>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
        <div class="ca-footer-column">
          <span class="ca-footer-label">${escapeHtml(config.online.title)}</span>
          <div class="ca-footer-links ca-footer-links--footer-utility">
            ${config.online.links
              .map(
                (link) =>
                  `<a href="${siteUrl(link.href)}">${escapeHtml(link.label)}</a>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  </footer>
`;

const syncLocaleUI = (scope, languages, locale) => {
  const localeLabel =
    languages.find((language) => language.code === locale)?.label || locale.toUpperCase();

  scope.querySelectorAll('[data-locale-option]').forEach((button) => {
    const active = button.getAttribute('data-locale-option') === locale;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  scope.querySelectorAll('[data-locale-current]').forEach((node) => {
    node.textContent = localeLabel;
  });

  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
  window.__coreactiveLocale = locale;
};

const bindReplicaHeader = (wrapper, config) => {
  const shell = wrapper.querySelector('[data-ca-header-shell]');
  const panels = [...wrapper.querySelectorAll('[data-menu-panel]')];
  const triggers = [...wrapper.querySelectorAll('[data-menu-trigger]')];
  const mobileDrawer = wrapper.querySelector('[data-mobile-drawer]');
  const mobileToggle = wrapper.querySelector('[data-mobile-toggle]');
  const mobileCloseButtons = [...wrapper.querySelectorAll('[data-mobile-close]')];
  const mobileCloseLinks = [...wrapper.querySelectorAll('[data-mobile-close-link]')];
  const accordionToggles = [...wrapper.querySelectorAll('[data-mobile-accordion-toggle]')];
  const localeButtons = [...wrapper.querySelectorAll('[data-locale-option]')];
  const desktopQuery = window.matchMedia('(min-width: 1180px)');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const previewParams = new URLSearchParams(window.location.search);
  let activeMenu = null;
  let closeTimer = 0;

  const setDesktopMenu = (key) => {
    activeMenu = key;

    if (!(shell instanceof HTMLElement)) {
      return;
    }

    const isOpen = Boolean(key) && desktopQuery.matches;

    shell.classList.toggle('has-open-menu', isOpen);

    if (isOpen && key) {
      shell.dataset.openMenu = key;
    } else {
      delete shell.dataset.openMenu;
    }

    panels.forEach((panel) => {
      const panelActive = isOpen && panel.getAttribute('data-menu-panel') === key;
      panel.hidden = !panelActive;
      panel.classList.toggle('is-active', panelActive);
    });

    triggers.forEach((trigger) => {
      const triggerActive = isOpen && trigger.getAttribute('data-menu-trigger') === key;
      trigger.classList.toggle('is-active', triggerActive);
      trigger.setAttribute('aria-expanded', String(triggerActive));
    });
  };

  const clearCloseTimer = () => {
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = 0;
    }
  };

  const queueMenuClose = () => {
    clearCloseTimer();
    closeTimer = window.setTimeout(() => setDesktopMenu(null), 120);
  };

  const setMobileOpen = (open) => {
    if (!(mobileDrawer instanceof HTMLElement) || !(mobileToggle instanceof HTMLElement)) {
      return;
    }

    mobileDrawer.hidden = !open;
    mobileDrawer.classList.toggle('is-open', open);
    mobileToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('replica-mobile-menu-open', open);
  };

  const setAccordion = (key) => {
    accordionToggles.forEach((button) => {
      const group = button.closest('[data-mobile-accordion]');
      const panelId = button.getAttribute('aria-controls') || '';
      const panel = panelId ? wrapper.querySelector(`#${panelId}`) : null;
      const isOpen = group?.getAttribute('data-mobile-accordion') === key;
      button.setAttribute('aria-expanded', String(isOpen));
      group?.classList.toggle('is-open', isOpen);
      if (panel instanceof HTMLElement) {
        panel.hidden = !isOpen;
      }
    });
  };

  setDesktopMenu(null);
  setMobileOpen(false);
  setAccordion('');

  triggers.forEach((trigger) => {
    const key = trigger.getAttribute('data-menu-trigger') || '';

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      if (!desktopQuery.matches) {
        return;
      }
      setDesktopMenu(activeMenu === key ? null : key);
    });

    trigger.addEventListener('focus', () => {
      if (desktopQuery.matches) {
        clearCloseTimer();
        setDesktopMenu(key);
      }
    });

    if (supportsHover) {
      trigger.addEventListener('mouseenter', () => {
        if (desktopQuery.matches) {
          clearCloseTimer();
          setDesktopMenu(key);
        }
      });
    }
  });

  if (shell instanceof HTMLElement) {
    shell.addEventListener('mouseenter', clearCloseTimer);
    shell.addEventListener('mouseleave', () => {
      if (desktopQuery.matches) {
        queueMenuClose();
      }
    });
  }

  wrapper.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setDesktopMenu(null);
      setMobileOpen(false);
      setAccordion('');
    }
  });

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (!wrapper.contains(event.target)) {
      setDesktopMenu(null);
    }
  });

  mobileToggle?.addEventListener('click', () => {
    const open = mobileToggle.getAttribute('aria-expanded') !== 'true';
    setMobileOpen(open);
  });

  mobileCloseButtons.forEach((button) => {
    button.addEventListener('click', () => setMobileOpen(false));
  });

  mobileCloseLinks.forEach((link) => {
    link.addEventListener('click', () => setMobileOpen(false));
  });

  accordionToggles.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.getAttribute('data-mobile-accordion-toggle') || '';
      const open = button.getAttribute('aria-expanded') === 'true';
      setAccordion(open ? '' : key);
    });
  });

  const handleLocaleChange = (locale) => {
    try {
      localStorage.setItem(localeStorageKey, locale);
    } catch {}
    syncLocaleUI(wrapper, config.languages, locale);
  };

  localeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const locale = button.getAttribute('data-locale-option');
      if (!locale) {
        return;
      }
      handleLocaleChange(locale);
    });
  });

  const handleViewportChange = () => {
    if (desktopQuery.matches) {
      setMobileOpen(false);
    } else {
      setDesktopMenu(null);
    }
  };

  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', handleViewportChange);
  } else if (typeof desktopQuery.addListener === 'function') {
    desktopQuery.addListener(handleViewportChange);
  }

  syncLocaleUI(wrapper, config.languages, readStoredLocale(config.languages));

  const previewMenu = previewParams.get('preview-menu');
  const previewMobile = previewParams.get('preview-mobile') === '1';
  const previewAccordion = previewParams.get('preview-accordion') || '';

  if (previewMenu && desktopQuery.matches && panels.some((panel) => panel.dataset.menuPanel === previewMenu)) {
    setDesktopMenu(previewMenu);
  }

  if (previewMobile && !desktopQuery.matches) {
    setMobileOpen(true);
    if (previewAccordion) {
      setAccordion(previewAccordion);
    }
  }
};

const initReplicaHeader = () => {
  const wrapper = document.querySelector('[data-header-wrapper]');
  if (!(wrapper instanceof HTMLElement) || wrapper.dataset.replicaHeader === 'ready') {
    return;
  }

  const config = buildHeaderConfig();
  const locale = readStoredLocale(config.languages);

  wrapper.classList.add('replica-header-ready');
  wrapper.dataset.replicaHeader = 'ready';
  wrapper.innerHTML = renderReplicaHeader(config, locale);
  bindReplicaHeader(wrapper, config);
};

const initReplicaFooter = () => {
  document.querySelectorAll('[data-ca-footer]').forEach((mount) => {
    if (!(mount instanceof HTMLElement) || mount.dataset.replicaFooter === 'ready') {
      return;
    }

    mount.dataset.replicaFooter = 'ready';
    mount.innerHTML = renderReplicaFooter(buildFooterConfig());
  });
};

const normalizeLegacyFooters = () => {
  const footerMarkup = renderReplicaFooter(buildFooterConfig());
  const legacyFooters = [...document.querySelectorAll('.footer')];

  if (legacyFooters.length) {
    legacyFooters.forEach((footer, index) => {
      if (!(footer instanceof HTMLElement)) {
        return;
      }

      if (index === 0) {
        footer.outerHTML = footerMarkup;
        return;
      }

      footer.remove();
    });

    document.querySelectorAll('.subfooter, [id*="__subfooter"], .shopify-section-group-footer-group').forEach((node) => {
      if (node instanceof HTMLElement && !node.querySelector('.ca-site-footer')) {
        node.remove();
      }
    });
    return;
  }

  if (!document.querySelector('.ca-site-footer') && !document.querySelector('[data-ca-footer]')) {
    document.body.insertAdjacentHTML('beforeend', footerMarkup);
  }
};

const rewriteLegacyLinks = () => {
  document.querySelectorAll('a[href]').forEach((anchor) => {
    const rawHref = anchor.getAttribute('href') || '';
    if (!rawHref || rawHref.startsWith('#') || /^(mailto|tel|javascript):/i.test(rawHref)) {
      return;
    }

    let absolute;
    try {
      absolute = new URL(rawHref, window.location.href);
    } catch {
      return;
    }

    const pathname = normalizePath(absolute.toString());
    const entry = legacyLinkMap.find((candidate) => candidate.match.test(pathname));
    if (!entry) {
      return;
    }

    const nextHref = siteUrl(entry.href);
    anchor.setAttribute('href', absolute.hash ? `${nextHref}${absolute.hash}` : nextHref);

    const title = anchor.getAttribute('title');
    if (title && /\b(ballin|hyrox|B\. ALL\. IN\.)/i.test(title)) {
      anchor.setAttribute('title', replaceLegacyText(title));
    }
  });
};

const scrubLegacyBranding = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) {
        return NodeFilter.FILTER_REJECT;
      }

      if (parent.closest('script, style, noscript, title')) {
        return NodeFilter.FILTER_REJECT;
      }

      return /\b(ballin|hyrox|30 days free|B\. ALL\. IN\.)/i.test(node.nodeValue || '')
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    node.nodeValue = replaceLegacyText(node.nodeValue || '');
  });

  document.title = replaceLegacyText(document.title);
  if (document.body?.dataset.siteReplica) {
    document.body.dataset.siteReplica = 'coreactive';
  }

  document
    .querySelectorAll('meta[property], meta[name]')
    .forEach((meta) => {
      const content = meta.getAttribute('content');
      if (content && /\b(ballin|hyrox|30 days free|B\. ALL\. IN\.)/i.test(content)) {
        meta.setAttribute('content', replaceLegacyText(content));
      }
    });

  document
    .querySelectorAll('[placeholder], [title], [aria-label], img[alt]')
    .forEach((element) => {
      ['placeholder', 'title', 'aria-label', 'alt'].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (value && /\b(ballin|hyrox|30 days free|B\. ALL\. IN\.)/i.test(value)) {
          element.setAttribute(attribute, replaceLegacyText(value));
        }
      });
    });
};

const applyHeroText = (section, { title, description, kicker, buttonLabel, buttonHref }) => {
  if (!(section instanceof HTMLElement)) {
    return;
  }

  const titleNode = section.querySelector('.hero__title');
  const descriptionNode = section.querySelector('.hero__description');
  const kickerNode = section.querySelector('.hero__kicker');
  const button = section.querySelector('.hero__cta__wrapper a');

  if (titleNode && title) {
    titleNode.innerHTML = `<p>${title}</p>`;
  }

  if (descriptionNode && description) {
    descriptionNode.innerHTML = description;
  }

  if (kickerNode && kicker) {
    kickerNode.innerHTML = `<p>${kicker}</p>`;
  }

  if (button && buttonLabel && buttonHref) {
    button.textContent = buttonLabel;
    button.setAttribute('href', siteUrl(buttonHref));
  }
};

const applyHeroImage = (section, assetPath) => {
  if (!(section instanceof HTMLElement) || !assetPath) {
    return;
  }

  const assetUrl = siteUrl(assetPath);
  section.querySelectorAll('source').forEach((source) => {
    source.setAttribute('srcset', assetUrl);
  });

  const image = section.querySelector('img');
  if (image) {
    image.setAttribute('src', assetUrl);
    image.setAttribute('srcset', assetUrl);
    image.setAttribute('sizes', '100vw');
  }
};

const renderHomeCarouselSlide = (slide) => `
  <article class="ca-home-carousel-slide${slide.kind === 'text' ? ' ca-home-carousel-slide--text' : ''}" aria-label="${escapeHtml(
    slide.ariaLabel || slide.title
  )}">
    <div class="ca-home-carousel-media"${slide.image ? ` style="background-image: url('${siteUrl(slide.image)}')"` : ''}></div>
    <div class="ca-home-carousel-overlay"></div>
    <div class="ca-home-carousel-shell">
      <div class="ca-home-carousel-copy${slide.align === 'left' ? ' ca-home-carousel-copy--left' : ''}">
        ${slide.kicker ? `<span class="ca-home-carousel-kicker">${escapeHtml(slide.kicker)}</span>` : ''}
        <h2 class="ca-home-carousel-title">${slide.titleHtml || escapeHtml(slide.title || '')}</h2>
        ${slide.descriptionHtml ? `<div class="ca-home-carousel-description">${slide.descriptionHtml}</div>` : ''}
        ${
          slide.cta
            ? `<a class="btn btn--white btn--long ca-home-carousel-btn" href="${siteUrl(slide.cta.href)}">${escapeHtml(
                slide.cta.label
              )}</a>`
            : ''
        }
      </div>
    </div>
  </article>
`;

const initHomeCarousel = (carousel) => {
  if (!(carousel instanceof HTMLElement) || carousel.dataset.caCarouselReady === 'true') {
    return;
  }

  const track = carousel.querySelector('[data-ca-home-carousel-track]');
  if (!(track instanceof HTMLElement)) {
    return;
  }

  const totalSlides = Number(track.getAttribute('data-ca-slide-count') || '0');
  if (totalSlides < 2) {
    return;
  }

  let index = 1;
  let timerId = 0;

  const setPosition = (immediate = false) => {
    track.style.transition = immediate ? 'none' : 'transform 1100ms cubic-bezier(0.22, 1, 0.36, 1)';
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  };

  const stop = () => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = 0;
    }
  };

  const start = () => {
    stop();
    timerId = window.setInterval(() => {
      index += 1;
      setPosition();
    }, 7000);
  };

  track.addEventListener('transitionend', () => {
    if (index === totalSlides + 1) {
      index = 1;
      setPosition(true);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
      return;
    }

    start();
  });

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  carousel.dataset.caCarouselReady = 'true';
  setPosition(true);
  start();
};

const enhanceHomePage = () => {
  const isHome =
    currentPath === normalizePath(siteUrl('index.html')) || currentPath === normalizePath(siteUrl(''));
  if (!isHome) {
    return;
  }

  document.querySelectorAll('.popup').forEach((popup) => popup.remove());

  const videoSection = document.querySelector('#MainContent [data-section-type="video"]');
  if (videoSection) {
    const video = videoSection.querySelector('video');
    const source = video?.querySelector('source');
    const fallbackImage = video?.querySelector('img');
    const videoWrapper = videoSection.querySelector('.video-autoplay-wrapper');

    if (video) {
      video.setAttribute('poster', siteUrl('assets/media/coreactive/man-poster.jpg'));
    }
    if (source) {
      source.setAttribute('src', siteUrl('assets/media/coreactive/man.mp4'));
    }
    if (fallbackImage) {
      fallbackImage.setAttribute('src', siteUrl('assets/media/coreactive/man-poster.jpg'));
    }
    if (videoWrapper instanceof HTMLElement) {
      videoWrapper.style.backgroundImage = `url("${siteUrl('assets/media/coreactive/man-poster.jpg')}")`;
      videoWrapper.style.backgroundSize = 'cover';
      videoWrapper.style.backgroundPosition = 'center';
    }
    if (video) {
      video.load();
      const attemptPlay = video.play();
      if (attemptPlay && typeof attemptPlay.catch === 'function') {
        attemptPlay.catch(() => {});
      }
    }

    const titleNode = videoSection.querySelector('.hero__title');
    const descriptionNode = videoSection.querySelector('.hero__description');
    const buttons = [...videoSection.querySelectorAll('.hero__cta__wrapper a')];

    if (titleNode) {
      titleNode.innerHTML = '<p>Train with purpose.<br>Perform at your peak.</p>';
    }
    if (descriptionNode) {
      descriptionNode.innerHTML = '<p>Structured training for real results across every level.</p>';
    }
    if (buttons[0]) {
      buttons[0].textContent = 'Start Training';
      buttons[0].setAttribute('href', siteUrl('pages/classes/index.html'));
    }
    if (buttons[1]) {
      buttons[1].textContent = 'Join Now';
      buttons[1].setAttribute('href', siteUrl('join/index.html'));
    }
  }

  const richTextSections = [...document.querySelectorAll('#MainContent [data-section-type="rich-text"]')];
  if (richTextSections[0]) {
    const heading = richTextSections[0].querySelector('.standard__heading');
    const body = richTextSections[0].querySelector('.rte');
    if (heading) heading.innerHTML = '<p>7 days free</p>';
    if (body) {
      body.innerHTML =
        '<p>Start with a 7-day introduction to structured training and find the CoreActive program that fits your level.</p><p>UrbanFit brings the group energy. PulseLab sharpens performance.</p>';
    }
  }

  const faqSection = document.querySelector('#MainContent [data-section-type="page-faq"]');
  if (faqSection) {
    const entries = [
      {
        title: 'Which program should I start with?',
        body: 'UrbanFit is for high-energy, coach-led group training. PulseLab is for members who want a more performance-focused environment and tighter progression.',
      },
      {
        title: 'What happens in my first week?',
        body: 'You get a clear starting point, structured sessions, and guidance on which class flow fits your current level and schedule.',
      },
      {
        title: 'How do I join CoreActive?',
        body: 'Choose your route, start the local join flow, and connect payments or Supabase later without changing the front-end experience.',
      },
    ];

    faqSection.querySelectorAll('.accordion__wrapper').forEach((entry, index) => {
      const config = entries[index];
      if (!config) {
        entry.remove();
        return;
      }

      const title = entry.querySelector('.accordion__title, label.accordion__title');
      const body = entry.querySelector('.accordion__body');
      if (title) title.textContent = config.title;
      if (body) body.innerHTML = `<span></span><p>${config.body}</p>`;
    });
  }

  const grid = document.querySelector('#MainContent .bf-grid');
  if (grid) {
    grid.innerHTML = `
      <div class="bf-card">
        <h3>UrbanFit Men</h3>
        <p>Strength, conditioning, and performance with coach-led group structure.</p>
        <div class="bf-price"><strong>Find your program</strong></div>
        <a href="${siteUrl('pages/urbanfit-men/index.html')}" class="bf-btn">Explore</a>
      </div>
      <div class="bf-card">
        <h3>UrbanFit Women</h3>
        <p>Toning, strength, and confidence in a supportive training environment.</p>
        <div class="bf-price"><strong>Find your program</strong></div>
        <a href="${siteUrl('pages/urbanfit-women/index.html')}" class="bf-btn">Explore</a>
      </div>
      <div class="bf-card">
        <h3>UrbanFit Kids</h3>
        <p>Movement, coordination, and fun with structure that keeps younger members engaged.</p>
        <div class="bf-price"><strong>Find your program</strong></div>
        <a href="${siteUrl('pages/kids/index.html')}" class="bf-btn">Explore</a>
      </div>
      <div class="bf-card">
        <h3>PulseLab</h3>
        <p>Precision programming for members chasing sharper progression and accountability.</p>
        <div class="bf-price"><strong>Plans available</strong></div>
        <a href="${siteUrl('pages/pulselab/index.html')}" class="bf-btn">Explore</a>
      </div>
    `;
  }

  if (richTextSections[1]) {
    const heading = richTextSections[1].querySelector('.standard__heading');
    const body = richTextSections[1].querySelector('.rte');
    const button = richTextSections[1].querySelector('.hero__cta__wrapper a');
    if (heading) heading.innerHTML = '<p>COREACTIVE</p>';
    if (body) {
      body.innerHTML =
        '<p>CoreActive is the umbrella performance fitness brand built around structured training, professional coaching, and measurable progression.</p><p>Choose UrbanFit for high-energy group training or PulseLab for a more focused performance environment.</p>';
    }
    if (button) {
      button.textContent = 'Find your program';
      button.setAttribute('href', siteUrl('pages/classes/index.html'));
    }
  }

  const heroes = [...document.querySelectorAll('#MainContent [data-section-type="hero"]')];
  applyHeroText(heroes[0], {
    title: 'PulseLab',
    description: '<p>Train with precision. Perform at a higher level.</p>',
    buttonLabel: 'Explore PulseLab',
    buttonHref: 'pages/pulselab/index.html',
  });
  applyHeroImage(heroes[0], 'assets/media/coreactive/pulselab-rower.png');

  applyHeroText(heroes[1], {
    kicker: 'CoreActive programs',
    title: 'UrbanFit',
    description:
      '<p><strong>Functional, high-energy group training for all ages and levels.</strong></p><p>Structured sessions, real coaching, and a community-driven training floor.</p>',
    buttonLabel: 'Explore UrbanFit',
    buttonHref: 'pages/classes/index.html',
  });
  applyHeroImage(heroes[1], 'assets/media/coreactive/coreactive-cardio.png');

  applyHeroText(heroes[2], {
    kicker: 'Memberships',
    title: 'Join CoreActive',
    description:
      '<p>UrbanFit, PulseLab, and flexible credits are all available through one clear join flow.</p><p><strong>Plans available. Start training now.</strong></p>',
    buttonLabel: 'Join Now',
    buttonHref: 'join/index.html',
  });
  applyHeroImage(heroes[2], 'assets/media/coreactive/woman-poster.jpg');

  applyHeroText(heroes[3], {
    kicker: 'Why CoreActive',
    title: 'Built for real results',
    description:
      '<p><strong>Structured sessions designed for progression.</strong></p><p>Coaches that guide every step, a supportive training environment, and programming built for real results, not trends.</p>',
    buttonLabel: 'View Schedule',
    buttonHref: 'pages/schedule/index.html',
  });
  applyHeroImage(heroes[3], 'assets/media/coreactive/urbanfit-kids.png');

  const sliderSourceSections = [richTextSections[0], richTextSections[1], heroes[0], heroes[1], heroes[2], heroes[3]].filter(
    (section) => section instanceof HTMLElement
  );
  const videoSectionRoot = videoSection?.closest('.shopify-section');
  const existingCarousel = document.querySelector('[data-ca-home-carousel]');

  if (videoSectionRoot instanceof HTMLElement && !existingCarousel && sliderSourceSections.length) {
    const slides = [
      {
        kind: 'text',
        align: 'left',
        kicker: 'Start Here',
        title: '7 Days Free',
        descriptionHtml:
          '<p>Start with a 7-day introduction to structured training and find the CoreActive program that fits your level.</p><p>UrbanFit brings the group energy. PulseLab sharpens performance.</p>',
        cta: { label: 'Start Training', href: 'join/index.html' },
      },
      {
        kind: 'text',
        align: 'left',
        kicker: 'CoreActive',
        title: 'CoreActive',
        descriptionHtml:
          '<p>CoreActive is the umbrella performance fitness brand built around structured training, professional coaching, and measurable progression.</p><p>Choose UrbanFit for high-energy group training or PulseLab for a more focused performance environment.</p>',
        cta: { label: 'Find your program', href: 'pages/classes/index.html' },
      },
      {
        kind: 'image',
        kicker: 'PulseLab',
        title: 'PulseLab',
        descriptionHtml: '<p>Train with precision. Perform at a higher level.</p>',
        image: 'assets/media/coreactive/pulselab-rower.png',
        cta: { label: 'Explore PulseLab', href: 'pages/pulselab/index.html' },
      },
      {
        kind: 'image',
        kicker: 'CoreActive Programs',
        title: 'UrbanFit',
        descriptionHtml:
          '<p><strong>Functional, high-energy group training for all ages and levels.</strong></p><p>Structured sessions, real coaching, and a community-driven training floor.</p>',
        image: 'assets/media/coreactive/coreactive-cardio.png',
        cta: { label: 'Explore UrbanFit', href: 'pages/classes/index.html' },
      },
      {
        kind: 'image',
        kicker: 'Memberships',
        titleHtml: 'Join<br>CoreActive',
        ariaLabel: 'Join CoreActive',
        descriptionHtml:
          '<p>UrbanFit, PulseLab, and flexible credits are all available through one clear join flow.</p><p><strong>Plans available. Start training now.</strong></p>',
        image: 'assets/media/coreactive/woman-poster.jpg',
        cta: { label: 'Join Now', href: 'join/index.html' },
      },
      {
        kind: 'image',
        kicker: 'Why CoreActive',
        title: 'Built for real results',
        descriptionHtml:
          '<p><strong>Structured sessions designed for progression.</strong></p><p>Coaches that guide every step, a supportive training environment, and programming built for real results, not trends.</p>',
        image: 'assets/media/coreactive/urbanfit-kids.png',
        cta: { label: 'View Schedule', href: 'pages/schedule/index.html' },
      },
    ];

    const clonedSlides = [slides[slides.length - 1], ...slides, slides[0]];
    const carousel = document.createElement('section');
    carousel.className = 'ca-home-carousel';
    carousel.setAttribute('data-ca-home-carousel', '');
    carousel.innerHTML = `
      <div class="ca-home-carousel-track" data-ca-home-carousel-track data-ca-slide-count="${slides.length}">
        ${clonedSlides.map((slide) => renderHomeCarouselSlide(slide)).join('')}
      </div>
    `;

    videoSectionRoot.insertAdjacentElement('afterend', carousel);
    sliderSourceSections.forEach((section) => {
      section.hidden = true;
    });
    initHomeCarousel(carousel);
  }

  const logoSection = document.querySelector('#MainContent [data-section-type="logos"] .logo-bar__wrapper');
  if (logoSection) {
    logoSection.innerHTML = `
      <div class="ca-home-trust-strip">
        <div class="ca-home-trust-card">
          <span>Structured programs</span>
          <strong>Clear progression from session one</strong>
        </div>
        <div class="ca-home-trust-card">
          <span>Coach-led training</span>
          <strong>Guidance at every level</strong>
        </div>
        <div class="ca-home-trust-card">
          <span>Trusted by members</span>
          <strong>Across the UK performance community</strong>
        </div>
      </div>
    `;
  }
};

const cartApi = window.__coreactiveCartApi || window.__ballinfitCartApi || null;

const money = (value) =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: window.theme?.currencyCode || 'EUR',
  }).format(value);

const fallbackReadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(fallbackCartKey) || '[]');
  } catch {
    return [];
  }
};

const fallbackWriteCart = (items) => {
  localStorage.setItem(fallbackCartKey, JSON.stringify(items));
};

const readCart = () => (cartApi ? cartApi.readItems() : fallbackReadCart());
const writeCart = (items) => {
  if (cartApi) {
    cartApi.writeItems(items);
    return;
  }
  fallbackWriteCart(items);
};

const buildFallbackCart = () => {
  const items = readCart().map((item) => {
    const unitPrice = Number(item.price_cents ?? Math.round(Number(item.price || 0) * 100));
    const quantity = Number(item.quantity || 1);
    return {
      ...item,
      price_cents: unitPrice,
      line_price: unitPrice * quantity,
    };
  });
  return {
    item_count: items.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
    total_price: items.reduce((sum, item) => sum + Number(item.line_price || 0), 0),
    items,
  };
};

const notifyCartChange = () => {
  if (cartApi) {
    cartApi.notifyCartChange();
    return;
  }

  document.dispatchEvent(
    new CustomEvent('theme:cart:change', {
      detail: {
        cart: buildFallbackCart(),
      },
      bubbles: true,
    })
  );
};

const renderCartCount = () => {
  const count = readCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  document.querySelectorAll('a[href$="cart/"], a[href$="cart"], [data-cart-count]').forEach((node) => {
    if (node.hasAttribute('data-cart-count')) {
      node.textContent = String(count);
      return;
    }

    const text = node.textContent || '';
    node.textContent = /\(\d+\)/.test(text) ? text.replace(/\(\d+\)/, `(${count})`) : text;
  });
};

const productMeta = () => {
  const title =
    document.querySelector('h1')?.textContent?.trim() ||
    document.title.replace(/\s*[|–-].*$/, '').trim() ||
    'COREACTIVE item';
  const image =
    document.querySelector('[data-product-single-media-wrapper] img[src]')?.getAttribute('src') ||
    document.querySelector('.product__media img[src]')?.getAttribute('src') ||
    document.querySelector('img[src]')?.getAttribute('src') ||
    '';
  const priceText = [...document.querySelectorAll('*')]
    .map((node) => node.textContent?.trim() || '')
    .find((text) => /^€\s?\d/.test(text));
  const price = priceText ? Number(priceText.replace(/[^\d,]/g, '').replace(',', '.')) : 0;
  const handleMatch = window.location.pathname.match(/\/products\/([^/]+)/);

  return {
    title,
    image,
    price,
    handle: handleMatch?.[1] || '',
  };
};

const showInlineMessage = (target, message) => {
  let node = target.parentElement?.querySelector('.replica-inline-message');
  if (!node) {
    node = document.createElement('p');
    node.className = 'replica-inline-message';
    target.parentElement?.appendChild(node);
  }
  node.textContent = message;
};

const addLocalCartItem = (quantity = 1) => {
  const meta = productMeta();

  if (cartApi) {
    cartApi.addItem({
      title: meta.title,
      image: meta.image,
      price_cents: Math.round(Number(meta.price || 0) * 100),
      quantity,
      handle: meta.handle,
    });
    return meta;
  }

  const items = readCart();
  const existing = items.find((item) => item.title === meta.title);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ ...meta, quantity });
  }
  writeCart(items);
  return meta;
};

const bindProductForms = () => {
  document.querySelectorAll('form').forEach((form) => {
    const action = form.getAttribute('action') || '';
    const looksLikeLocalStub = form.matches('[data-local-form="true"]');
    const looksLikeCartForm = action.includes('/cart') || form.querySelector('[name="add"]');

    if (!looksLikeLocalStub && !looksLikeCartForm) {
      return;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const quantityField = form.querySelector('[name="quantity"]');
      const quantity = Math.max(1, Number(quantityField?.value || 1));
      const meta = productMeta();

      if (meta.price || window.location.pathname.includes('/products/')) {
        addLocalCartItem(quantity);
        renderCartCount();
        notifyCartChange();
        showInlineMessage(form, 'Added to local demo cart.');
        return;
      }

      showInlineMessage(form, 'This form is stubbed locally for the standalone demo.');
    });
  });
};

const bindShareInputs = () => {
  document.querySelectorAll('[data-share-url]').forEach((node) => {
    if (node instanceof HTMLInputElement) {
      node.value = window.location.href;
    }
  });
};

const renderCartPage = () => {
  const mount = document.querySelector('[data-cart-page]');
  if (!mount) {
    return;
  }

  const items = readCart();
  if (!items.length) {
    mount.innerHTML = '<p class="replica-copy">Your demo cart is empty.</p>';
    return;
  }

  const total = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price_cents ?? Math.round(Number(item.price || 0) * 100)),
    0
  );

  mount.innerHTML =
    items
      .map((item) => {
        const unitPrice = Number(item.price_cents ?? Math.round(Number(item.price || 0) * 100));
        const linePrice = (Number(item.quantity || 0) * unitPrice) / 100;
        return `<div class="product-item"><img src="${item.image || ''}" alt=""><div><strong>${item.title || 'COREACTIVE item'}</strong><div>Quantity: ${Number(item.quantity || 0)}</div></div><div class="replica-price">${money(linePrice)}</div></div>`;
      })
      .join('') +
    `<div class="replica-cart-total"><span>Total</span><span>${money(total / 100)}</span></div>`;
};

const setAuthStatus = (form, message, tone = 'success') => {
  const status = form.querySelector('[data-auth-status]');
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.add('is-visible');
  status.classList.toggle('is-error', tone === 'error');
};

const activateAuthTab = (page, tab) => {
  page.dataset.authCurrent = tab;

  page.querySelectorAll('[data-auth-tab]').forEach((button) => {
    const isActive = button.getAttribute('data-auth-tab') === tab;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  page.querySelectorAll('[data-auth-panel]').forEach((panel) => {
    panel.hidden = panel.getAttribute('data-auth-panel') !== tab;
  });
};

const initAuthPage = () => {
  const page = document.querySelector('[data-auth-page]');
  if (!page) {
    return;
  }

  const searchMode = new URLSearchParams(window.location.search).get('mode');
  const defaultMode = searchMode || document.body.dataset.authDefault || 'login';
  activateAuthTab(page, defaultMode);

  page.querySelectorAll('[data-auth-tab], [data-auth-link-tab]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const tab = button.getAttribute('data-auth-tab') || button.getAttribute('data-auth-link-tab');
      if (!tab) {
        return;
      }
      activateAuthTab(page, tab);
    });
  });

  page.querySelectorAll('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-toggle-password');
      const input = targetId ? document.getElementById(targetId) : null;
      if (!(input instanceof HTMLInputElement)) {
        return;
      }

      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.textContent = show ? 'Hide' : 'Show';
    });
  });

  const rememberedEmail = localStorage.getItem(authEmailKey);
  if (rememberedEmail) {
    page.querySelectorAll('input[name="email"]').forEach((input) => {
      if (input instanceof HTMLInputElement && !input.value) {
        input.value = rememberedEmail;
      }
    });
  }

  page.querySelectorAll('[data-auth-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const mode = form.getAttribute('data-auth-form') || 'login';
      const data = Object.fromEntries(new FormData(form).entries());

      if (typeof data.email === 'string' && data.email) {
        localStorage.setItem(authEmailKey, data.email);
      }

      if (mode === 'signup' && data.password !== data.confirm_password) {
        setAuthStatus(form, 'Passwords need to match before this form is connected to Supabase.', 'error');
        return;
      }

      if (mode === 'login') {
        setAuthStatus(form, 'Login flow is ready. Connect this form to Supabase `signInWithPassword()` next.');
        return;
      }

      setAuthStatus(form, 'Sign-up flow is ready. Connect this form to Supabase `signUp()` and your profile table next.');
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initReplicaHeader();
  initReplicaFooter();
  enhanceHomePage();
  normalizeLegacyFooters();
  rewriteLegacyLinks();
  scrubLegacyBranding();
  renderCartCount();
  bindProductForms();
  bindShareInputs();
  renderCartPage();
  initAuthPage();

  document.querySelectorAll('a[href$="checkout/"], a[href$="checkout"]').forEach((node) => {
    node.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = node.getAttribute('href') || 'checkout/';
    });
  });
});

window.addEventListener('storage', renderCartCount);
document.addEventListener('theme:cart:change', () => {
  renderCartCount();
  renderCartPage();
});
