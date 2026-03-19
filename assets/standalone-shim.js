(function () {
  if (window.__ballinfitStandaloneShim) {
    return;
  }

  window.__ballinfitStandaloneShim = true;

  const NativeXHR = window.XMLHttpRequest;
  const storageKey = 'ballinfit-replica-cart';
  const noteKey = 'ballinfit-replica-cart-note';
  const routeRoots = new Set(['pages', 'collections', 'products', 'account', 'cart', 'checkout', 'join']);

  const escapeHtml = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (match) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match]));

  const slugify = (value) =>
    String(value || 'item')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'item';

  const currencyCode = () => window.theme?.currencyCode || window.theme?.shopCurrency || 'EUR';

  const formatMoney = (cents) =>
    new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: currencyCode(),
    }).format((Number(cents || 0) || 0) / 100);

  const computeBasePath = () => {
    const pathname = window.location.pathname || '/';
    const segments = pathname.split('/').filter(Boolean);
    const filelessSegments = segments[segments.length - 1] === 'index.html' ? segments.slice(0, -1) : segments.slice();
    const routeIndex = filelessSegments.findIndex((segment) => routeRoots.has(segment));

    if (routeIndex > 0) {
      return `/${filelessSegments.slice(0, routeIndex).join('/')}/`;
    }

    if (routeIndex === 0 || filelessSegments.length === 0) {
      return '/';
    }

    return `/${filelessSegments.join('/')}/`;
  };

  const joinBase = (basePath, relativePath) => `${basePath.replace(/\/$/, '')}/${String(relativePath || '').replace(/^\/+/, '')}`;

  const normalizeRoutes = () => {
    const basePath = computeBasePath();
    const code = currencyCode();

    window.Shopify = window.Shopify || {};
    window.Shopify.currency = {
      active: code,
      rate: 1,
      ...(window.Shopify.currency || {}),
    };
    window.Shopify.routes = {
      root: basePath,
      ...(window.Shopify.routes || {}),
    };

    if (window.theme?.routes) {
      window.theme.routes.root_url = basePath;
      window.theme.routes.cart = joinBase(basePath, 'cart');
      window.theme.routes.cart_add_url = joinBase(basePath, 'cart/add');
      window.theme.routes.product_recommendations_url = joinBase(basePath, 'recommendations/products');
      window.theme.routes.account_addresses_url = joinBase(basePath, 'account/addresses');
      window.theme.routes.predictive_search_url = joinBase(basePath, 'search/suggest');
    }

    window.__ballinfitSiteBase = basePath;
    return basePath;
  };

  const readStoredItems = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return [];
    }
  };

  const writeStoredItems = (items) => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  const readCartNote = () => localStorage.getItem(noteKey) || '';
  const writeCartNote = (value) => localStorage.setItem(noteKey, value);

  const pageMeta = () => {
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
    const unitPrice = priceText ? Math.round(Number(priceText.replace(/[^\d,]/g, '').replace(',', '.')) * 100) : 0;
    const handleMatch = window.location.pathname.match(/\/products\/([^/]+)/);
    const handle = handleMatch?.[1] || slugify(title);
    const basePath = normalizeRoutes();

    return {
      title,
      image,
      unitPrice,
      handle,
      url: joinBase(basePath, `products/${handle}`),
    };
  };

  const normalizeItem = (item, index) => {
    const meta = pageMeta();
    const title = item.title || item.product_title || meta.title;
    const handle = item.handle || slugify(title);
    const quantity = Math.max(1, Number(item.quantity || 1));
    const unitPrice = Number(
      item.price_cents ??
        item.price ??
        item.original_price ??
        item.final_price ??
        Math.round(Number(item.price_eur || meta.unitPrice / 100) * 100)
    );
    const key = String(item.key || item.id || `${handle}-${index}`);
    const image = item.image || item.image_url || item.featured_image?.url || meta.image || '';
    const basePath = normalizeRoutes();

    return {
      key,
      id: key,
      title,
      product_title: title,
      handle,
      url: item.url || joinBase(basePath, `products/${handle}`),
      quantity,
      image,
      featured_image: image
        ? {
            url: image,
            alt: title,
            aspect_ratio: 1,
          }
        : null,
      price: unitPrice,
      price_cents: unitPrice,
      original_price: unitPrice,
      final_price: unitPrice,
      line_price: unitPrice * quantity,
      final_line_price: unitPrice * quantity,
      original_line_price: unitPrice * quantity,
      variant_title: item.variant_title || '',
      product_has_only_default_variant: true,
      requires_shipping: false,
      vendor: 'BALLINFIT',
      discounts: [],
      properties: null,
    };
  };

  const readItems = () => {
    const normalized = readStoredItems().map(normalizeItem);
    writeStoredItems(normalized);
    return normalized;
  };

  const writeItems = (items) => {
    writeStoredItems(items.map(normalizeItem));
  };

  const buildCart = () => {
    const items = readItems();
    const totalPrice = items.reduce((sum, item) => sum + Number(item.line_price || 0), 0);

    return {
      token: 'ballinfit-standalone',
      note: readCartNote(),
      attributes: {},
      currency: currencyCode(),
      item_count: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      total_price: totalPrice,
      original_total_price: totalPrice,
      items_subtotal_price: totalPrice,
      total_discount: 0,
      total_weight: 0,
      requires_shipping: false,
      cart_level_discount_applications: [],
      items,
    };
  };

  const notifyCartChange = () => {
    document.dispatchEvent(
      new CustomEvent('theme:cart:change', {
        detail: {
          cart: buildCart(),
        },
        bubbles: true,
      })
    );
  };

  const addItem = (payload = {}) => {
    const meta = pageMeta();
    const quantity = Math.max(1, Number(payload.quantity || 1));
    const unitPrice = Number(payload.price_cents ?? meta.unitPrice ?? 0);
    const handle = payload.handle || meta.handle;
    const key = String(payload.id || payload.key || handle || slugify(payload.title || meta.title));
    const items = readItems();
    const existing = items.find((item) => item.key === key);

    if (existing) {
      existing.quantity += quantity;
      existing.line_price = existing.price_cents * existing.quantity;
      existing.final_line_price = existing.line_price;
      existing.original_line_price = existing.line_price;
      writeItems(items);
      return existing;
    }

    const created = normalizeItem(
      {
        key,
        id: key,
        title: payload.title || meta.title,
        image: payload.image || meta.image,
        price_cents: unitPrice,
        quantity,
        handle,
        url: payload.url || meta.url,
      },
      items.length
    );

    items.push(created);
    writeItems(items);
    return created;
  };

  const updateItemQuantity = (key, quantity) => {
    const items = readItems();
    const nextItems = items
      .map((item) => (item.key === key || String(item.id) === String(key) ? { ...item, quantity: Math.max(0, Number(quantity || 0)) } : item))
      .filter((item) => item.quantity > 0)
      .map(normalizeItem);

    writeItems(nextItems);
    return buildCart();
  };

  const parseBody = (body) => {
    if (!body) {
      return {};
    }

    if (typeof body === 'string') {
      try {
        return JSON.parse(body);
      } catch {
        return Object.fromEntries(new URLSearchParams(body));
      }
    }

    if (body instanceof URLSearchParams) {
      return Object.fromEntries(body.entries());
    }

    if (body instanceof FormData) {
      return Object.fromEntries(body.entries());
    }

    return typeof body === 'object' ? body : {};
  };

  const renderCartItemsHtml = () => {
    const cart = buildCart();

    if (!cart.items.length) {
      return '<div data-api-content=""><div class="cart__items cart__items--blankstate"></div></div>';
    }

    const rows = cart.items
      .map(
        (item) => `<div class="cart__items__row" data-cart-item="">
  <div class="item--loadbar" data-item-loadbar="" style="display:none;"></div>
  <div class="cart__items__grid">
    <div class="cart__items__image">
      <a class="cart__items__img" href="${escapeHtml(item.url || '#')}">
        <img src="${escapeHtml(item.image || '')}" alt="${escapeHtml(item.title)}">
      </a>
    </div>
    <div class="cart__items__content">
      <p class="cart__items__title"><a href="${escapeHtml(item.url || '#')}">${escapeHtml(item.title)}</a></p>
      ${item.variant_title ? `<p class="cart__items__variant">${escapeHtml(item.variant_title)}</p>` : ''}
      <div class="cart__items__actions">
        <label class="visually-hidden" for="cart-item-${escapeHtml(item.key)}">Quantity</label>
        <input id="cart-item-${escapeHtml(item.key)}" type="number" min="0" value="${item.quantity}" data-update-cart="${escapeHtml(item.key)}">
        <button type="button" class="btn btn--text" data-remove-key="${escapeHtml(item.key)}">Remove</button>
      </div>
    </div>
    <div class="cart__items__price">${formatMoney(item.final_line_price)} ${escapeHtml(currencyCode())}</div>
  </div>
</div>`
      )
      .join('');

    return `<div data-api-content=""><div class="cart__items">${rows}</div></div>`;
  };

  const renderCartSubtotalHtml = () => {
    const cart = buildCart();
    return `<div data-api-content=""><div class="drawer__bottom__price"><span>Subtotal</span><strong>${formatMoney(cart.total_price)} ${escapeHtml(currencyCode())}</strong></div></div>`;
  };

  const matchLocalRoute = async ({ url, method, body }) => {
    normalizeRoutes();

    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    const sectionId = url.searchParams.get('section_id');

    if (sectionId === 'api-cart-items') {
      return {
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: renderCartItemsHtml(),
      };
    }

    if (sectionId === 'api-cart-subtotal') {
      return {
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: renderCartSubtotalHtml(),
      };
    }

    if (/\/cart\.js$/.test(pathname) && method === 'GET') {
      return {
        status: 200,
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(buildCart()),
      };
    }

    if (/\/cart\/add\.js$/.test(pathname) && method === 'POST') {
      const data = parseBody(body);
      const added = addItem({
        id: data.id,
        quantity: data.quantity,
      });
      notifyCartChange();
      return {
        status: 200,
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(added),
      };
    }

    if (/\/cart\/change\.js$/.test(pathname) && method === 'POST') {
      const data = parseBody(body);
      const cart = updateItemQuantity(String(data.id || ''), Number(data.quantity || 0));
      notifyCartChange();
      return {
        status: 200,
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(cart),
      };
    }

    if (/\/cart\/update\.js$/.test(pathname) && method === 'POST') {
      const data = parseBody(body);
      if (typeof data.note === 'string') {
        writeCartNote(data.note);
      }
      return {
        status: 200,
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(buildCart()),
      };
    }

    if (/\/cart\/shipping_rates\.json$/.test(pathname) && method === 'GET') {
      return {
        status: 200,
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify({
          shipping_rates: [
            {
              presentment_name: 'Standard shipping',
              price: 0,
            },
          ],
        }),
      };
    }

    return null;
  };

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init = undefined) => {
    const request = input instanceof Request ? input : null;
    const url = new URL(request ? request.url : String(input), window.location.href);
    const method = String(init?.method || request?.method || 'GET').toUpperCase();
    let body = init?.body;

    if (body === undefined && request && method !== 'GET' && method !== 'HEAD') {
      try {
        body = await request.clone().text();
      } catch {
        body = undefined;
      }
    }

    const handled = await matchLocalRoute({ url, method, body });
    if (handled) {
      return new Response(handled.body, {
        status: handled.status,
        headers: {
          'Content-Type': handled.contentType,
        },
      });
    }

    return nativeFetch(input, init);
  };

  class ReplicaXHR {
    constructor() {
      this._native = null;
      this._listeners = new Map();
      this._headers = {};
      this._method = 'GET';
      this._url = null;
      this._responseHeaders = {};
      this.readyState = 0;
      this.status = 0;
      this.statusText = '';
      this.responseType = '';
      this.responseText = '';
      this.response = '';
      this.responseURL = '';
      this.timeout = 0;
      this.withCredentials = false;
      this.onreadystatechange = null;
      this.onload = null;
      this.onloadend = null;
      this.onerror = null;
      this.onabort = null;
      this.ontimeout = null;
      this.upload = {
        addEventListener() {},
        removeEventListener() {},
      };
    }

    addEventListener(type, listener) {
      if (!this._listeners.has(type)) {
        this._listeners.set(type, []);
      }
      this._listeners.get(type).push(listener);
    }

    removeEventListener(type, listener) {
      const listeners = this._listeners.get(type) || [];
      this._listeners.set(
        type,
        listeners.filter((entry) => entry !== listener)
      );
    }

    dispatchEvent(event) {
      const listeners = this._listeners.get(event.type) || [];
      listeners.forEach((listener) => listener.call(this, event));
      return true;
    }

    _emit(type) {
      const event = new Event(type);
      this.dispatchEvent(event);
      const handler = this[`on${type}`];
      if (typeof handler === 'function') {
        handler.call(this, event);
      }
    }

    open(method, url) {
      this._method = String(method || 'GET').toUpperCase();
      this._url = new URL(url, window.location.href);
      this.readyState = 1;
      this._emit('readystatechange');
    }

    setRequestHeader(name, value) {
      this._headers[name] = value;
      if (this._native) {
        this._native.setRequestHeader(name, value);
      }
    }

    getAllResponseHeaders() {
      return Object.entries(this._responseHeaders)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\r\n');
    }

    getResponseHeader(name) {
      return this._responseHeaders[String(name || '').toLowerCase()] || null;
    }

    overrideMimeType() {}

    abort() {
      if (this._native) {
        this._native.abort();
      } else {
        this._emit('abort');
      }
    }

    async send(body = null) {
      const handled = await matchLocalRoute({
        url: this._url,
        method: this._method,
        body,
      });

      if (handled) {
        queueMicrotask(() => {
          this.readyState = 4;
          this.status = handled.status;
          this.statusText = handled.status === 200 ? 'OK' : 'Error';
          this.responseText = handled.body;
          this.responseURL = this._url.href;
          this._responseHeaders = {
            'content-type': handled.contentType,
          };
          this.response =
            this.responseType === 'json' ? JSON.parse(handled.body) : handled.body;
          this._emit('readystatechange');
          this._emit('load');
          this._emit('loadend');
        });
        return;
      }

      const xhr = new NativeXHR();
      this._native = xhr;
      xhr.open(this._method, this._url.href, true);
      xhr.responseType = this.responseType;
      xhr.timeout = this.timeout;
      xhr.withCredentials = this.withCredentials;
      Object.entries(this._headers).forEach(([name, value]) => xhr.setRequestHeader(name, value));

      xhr.onreadystatechange = () => {
        this.readyState = xhr.readyState;
        this.status = xhr.status;
        this.statusText = xhr.statusText;
        this.responseURL = xhr.responseURL;
        this.response = xhr.response;
        this.responseText = xhr.responseType && xhr.responseType !== 'text' ? '' : xhr.responseText;
        this._emit('readystatechange');
      };

      xhr.onload = () => {
        this._emit('load');
      };

      xhr.onloadend = () => {
        this._emit('loadend');
      };

      xhr.onerror = () => {
        this._emit('error');
      };

      xhr.onabort = () => {
        this._emit('abort');
      };

      xhr.ontimeout = () => {
        this._emit('timeout');
      };

      xhr.send(body);
    }
  }

  window.XMLHttpRequest = ReplicaXHR;

  normalizeRoutes();

  window.__ballinfitCartApi = {
    addItem,
    buildCart,
    notifyCartChange,
    normalizeRoutes,
    readItems,
    updateItemQuantity,
    writeItems,
  };
})();
