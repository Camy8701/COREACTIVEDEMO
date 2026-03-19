const fallbackCartKey = 'ballinfit-replica-cart';
const authEmailKey = 'ballinfit-auth-email';

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
