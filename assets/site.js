const fallbackCartKey = 'ballinfit-replica-cart';
const authEmailKey = 'ballinfit-auth-email';
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
            { label: 'UrbanFit Men', href: 'pages/classes/index.html' },
            { label: 'UrbanFit Women', href: 'pages/classes/index.html' },
            { label: 'UrbanFit Kids', href: 'pages/kids/index.html' },
          ],
        },
        {
          title: 'Experience',
          links: [
            { label: 'Training Philosophy', href: 'pages/classes/index.html' },
            { label: 'Class Types', href: 'pages/classes/index.html' },
            { label: 'Coaching Style', href: 'pages/meet-the-trainers/index.html' },
          ],
        },
        {
          title: 'Access',
          links: [
            { label: 'Membership Options', href: 'pages/group-class-memberships/index.html' },
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
        { label: 'UrbanFit Men', href: 'pages/classes/index.html' },
        { label: 'UrbanFit Women', href: 'pages/classes/index.html' },
        { label: 'UrbanFit Kids', href: 'pages/kids/index.html' },
        { label: 'Training Philosophy', href: 'pages/classes/index.html' },
        { label: 'Class Types', href: 'pages/classes/index.html' },
        { label: 'Join UrbanFit', href: 'join/index.html' },
      ],
    },
    {
      key: 'pulselab',
      label: 'PulseLab',
      kind: 'mega',
      href: 'pages/hyrox/index.html',
      columns: [
        {
          title: 'PulseLab',
          links: [
            { label: 'Overview', href: 'pages/hyrox/index.html' },
            { label: 'Training Method', href: 'pages/hyrox/index.html' },
          ],
        },
        {
          title: 'Performance',
          links: [
            { label: 'Who It Is For', href: 'pages/personal-training/index.html' },
            { label: 'Benefits', href: 'pages/hyrox/index.html' },
            { label: 'Results Focus', href: 'pages/personal-training/index.html' },
          ],
        },
        {
          title: 'Access',
          links: [
            { label: 'Membership Options', href: 'pages/memberships-v2/index.html' },
            { label: 'Schedule', href: 'pages/schedule/index.html' },
            { label: 'Join PulseLab', href: 'join/index.html' },
          ],
        },
      ],
      mobileLinks: [
        { label: 'Overview', href: 'pages/hyrox/index.html' },
        { label: 'Training Method', href: 'pages/hyrox/index.html' },
        { label: 'Who It Is For', href: 'pages/personal-training/index.html' },
        { label: 'Membership Options', href: 'pages/memberships-v2/index.html' },
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
            { label: 'UrbanFit Memberships', href: 'pages/group-class-memberships/index.html' },
            { label: 'PulseLab Memberships', href: 'pages/ballin-fitness-memberships/index.html' },
            { label: 'Credits', href: 'pages/get-credits/index.html' },
          ],
        },
        {
          title: 'Information',
          links: [
            { label: 'Pricing', href: 'pages/memberships/index.html' },
            { label: 'How Membership Works', href: 'pages/memberships-v2/index.html' },
            { label: 'Terms', href: 'policies/terms-of-service/index.html' },
          ],
        },
        {
          title: 'Join',
          links: [
            { label: 'Join Online', href: 'join/index.html' },
            { label: 'Sign Up', href: 'join/index.html' },
            { label: 'Member Access', href: 'account/index.html' },
          ],
        },
      ],
      mobileLinks: [
        { label: 'UrbanFit Memberships', href: 'pages/group-class-memberships/index.html' },
        { label: 'PulseLab Memberships', href: 'pages/ballin-fitness-memberships/index.html' },
        { label: 'Credits', href: 'pages/get-credits/index.html' },
        { label: 'Pricing', href: 'pages/memberships/index.html' },
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
      href: 'pages/community/index.html',
    },
    {
      key: 'contact',
      label: 'Contact',
      kind: 'link',
      href: 'pages/contact/index.html',
    },
  ],
  auth: {
    signIn: { label: 'Sign In', href: 'account/index.html' },
    signUp: { label: 'Sign Up', href: 'join/index.html' },
    shop: { label: 'Shop', href: 'collections/frontpage/index.html' },
  },
  mobileDirectLinks: [
    { label: 'Schedule', href: 'pages/schedule/index.html' },
    { label: 'About', href: 'pages/community/index.html' },
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
              <a class="ca-auth-link" href="${siteUrl(
                config.auth.signIn.href
              )}">${escapeHtml(config.auth.signIn.label)}</a>
              <a class="ca-auth-link ca-auth-link--signup" href="${siteUrl(
                config.auth.signUp.href
              )}">${escapeHtml(config.auth.signUp.label)}</a>
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
              <a class="ca-auth-link" href="${siteUrl(
                config.auth.signIn.href
              )}" data-mobile-close-link>${escapeHtml(config.auth.signIn.label)}</a>
              <a class="ca-auth-link ca-auth-link--signup" href="${siteUrl(
                config.auth.signUp.href
              )}" data-mobile-close-link>${escapeHtml(config.auth.signUp.label)}</a>
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

const cartApi = window.__ballinfitCartApi || null;

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
    'BALLINFIT item';
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
        return `<div class="product-item"><img src="${item.image || ''}" alt=""><div><strong>${item.title || 'BALLINFIT item'}</strong><div>Quantity: ${Number(item.quantity || 0)}</div></div><div class="replica-price">${money(linePrice)}</div></div>`;
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
