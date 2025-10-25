// <!-- JS: Toggle Lihat Detail -->
document.querySelectorAll('[data-toggle="details"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.currentTarget.closest('[data-card]');
    const panel = card.querySelector('[data-details]');
    const icon = e.currentTarget.querySelector('svg');
    const isOpen = !panel.classList.contains('hidden');

    // Tutup semua panel lain
    document.querySelectorAll('[data-card]').forEach(otherCard => {
      if (otherCard !== card) {
        const otherPanel = otherCard.querySelector('[data-details]');
        const otherIcon = otherCard.querySelector('[data-toggle="details"] svg');
        if (otherPanel) otherPanel.classList.add('hidden');
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      }
    });

    // Toggle panel yang diklik
    panel.classList.toggle('hidden', isOpen);
    icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  });
});

// <!-- JS: mobile menu + year -->
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => {
  const isHidden = mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  menuBtn.setAttribute('aria-expanded', String(isHidden));
});
document.getElementById('yearSpan').textContent = new Date().getFullYear();


// <!-- JS: Video Modal -->
document.querySelectorAll('[data-video]').forEach(button => {
  button.addEventListener('click', e => {
    const videoUrl = e.currentTarget.getAttribute('data-video');
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    iframe.src = videoUrl + '?autoplay=1';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  });
});

document.getElementById('closeModal').addEventListener('click', () => {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoFrame');
  iframe.src = '';
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});

// Tutup modal saat klik di luar iframe
document.getElementById('videoModal').addEventListener('click', e => {
  if (e.target.id === 'videoModal') {
    document.getElementById('closeModal').click();
  }
});

  // Tahun dinamis (pastikan hanya ada 1 elemen #yearSpan di halaman)
  const y = document.getElementById('yearSpan'); if (y) y.textContent = new Date().getFullYear();


// ---------- CART CORE ----------
    const CART_KEY = 'cart_items_v1';
    const fmt = (n) => (n || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

    const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; } };
    const setCart = (items) => { localStorage.setItem(CART_KEY, JSON.stringify(items)); updateBadge(items); renderCart(items); };

    // Badges (desktop + mobile)
    const updateBadge = (items = getCart()) => {
      const count = items.reduce((a, it) => a + it.qty, 0);
      ['cartBadge', 'cartBadgeMobile'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = count;
      });
    };

    // Render ke 2 panel
    const renderCart = (items = getCart()) => {
      const sets = [
        { list: 'cartItems', total: 'cartTotal' },                 // desktop
        { list: 'cartItemsMobile', total: 'cartTotalMobile' },     // mobile
      ];
      sets.forEach(({ list, total }) => {
        const wrap = document.getElementById(list);
        const totalEl = document.getElementById(total);
        if (!wrap || !totalEl) return;

        if (!items.length) {
          wrap.innerHTML = `<div class="py-6 text-sm text-slate-500">Keranjang masih kosong.</div>`;
          totalEl.textContent = fmt(0);
          return;
        }

        wrap.innerHTML = items.map(it => `
          <div class="py-4 flex items-start justify-between gap-4">
            <div>
              <div class="font-medium text-slate-900">${it.name}</div>
              <div class="text-sm text-slate-500">Sesi: ${it.sessions} • Qty: ${it.qty}</div>
              <div class="text-sm text-slate-700 mt-1">${fmt(it.price)} <span class="text-slate-400">/ paket</span></div>
            </div>
            <div class="flex items-center gap-2">
              <button class="px-2 py-1 ring-1 ring-slate-200 rounded hover:bg-slate-50" data-dec="${it.id}">−</button>
              <button class="px-2 py-1 ring-1 ring-slate-200 rounded hover:bg-slate-50" data-inc="${it.id}">+</button>
              <button class="px-2 py-1 text-red-600 hover:underline" data-remove="${it.id}">Hapus</button>
            </div>
          </div>
        `).join('');

        const totalVal = items.reduce((a, it) => a + it.price * it.qty, 0);
        totalEl.textContent = fmt(totalVal);
      });
    };

    // ---------- OPEN/CLOSE (desktop dropdown & mobile drawer) ----------
    const cartBtn       = document.getElementById('cartBtn');            // desktop icon
    const cartPanel     = document.getElementById('cartPanel');          // desktop dropdown
    const closeBtn      = document.getElementById('closeCart');
    const clearBtn      = document.getElementById('clearCart');

    const cartBtnMobile = document.getElementById('cartBtnMobile');      // mobile icon
    const cartPanelMob  = document.getElementById('cartPanelMobile');    // mobile drawer
    const overlayMob    = document.getElementById('cartOverlayMobile');
    const closeBtnMob   = document.getElementById('closeCartMobile');
    const clearBtnMob   = document.getElementById('clearCartMobile');

    const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

    function openCart() {
      if (isMobile()) {
        if (!cartPanelMob) return;
        cartPanelMob.classList.remove('translate-x-full');
        overlayMob?.classList.remove('hidden');
      } else {
        if (!cartPanel) return;
        cartPanel.classList.remove('hidden');
        cartPanel.classList.add('animate-slideIn');
        cartPanel.setAttribute('aria-hidden', 'false');
      }
    }
    function closeCart() {
      if (isMobile()) {
        if (!cartPanelMob) return;
        cartPanelMob.classList.add('translate-x-full');
        overlayMob?.classList.add('hidden');
      } else {
        if (!cartPanel) return;
        cartPanel.classList.add('hidden');
        cartPanel.setAttribute('aria-hidden', 'true');
      }
    }

    // Toggle desktop
    cartBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const hidden = cartPanel?.classList.contains('hidden');
      hidden ? openCart() : closeCart();
    });
    // Toggle mobile
    cartBtnMobile?.addEventListener('click', (e) => {
      e.preventDefault();
      const hidden = cartPanelMob?.classList.contains('translate-x-full');
      hidden ? openCart() : closeCart();
    });
    // Close buttons
    closeBtn?.addEventListener('click', closeCart);
    closeBtnMob?.addEventListener('click', closeCart);
    overlayMob?.addEventListener('click', closeCart);

    // Klik di luar area (desktop) → tutup
    document.addEventListener('click', (e) => {
      if (!cartPanel || isMobile()) return;
      const inside = cartPanel.contains(e.target) || cartBtn.contains(e.target);
      if (!inside) closeCart();
    });
    // ESC
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

    // ---------- INIT + EVENT: Add/Inc/Dec/Remove ----------
    document.addEventListener('DOMContentLoaded', () => {
      updateBadge();
      renderCart();

      // Tambah ke keranjang
      document.body.addEventListener('click', (e) => {
        const addBtn = e.target.closest('[data-add-to-cart]');
        if (addBtn) {
          e.preventDefault();
          const card = addBtn.closest('[data-card]');
          if (!card) return;

          const id = card.dataset.id;
          const name = card.dataset.name;
          const price = parseInt(card.dataset.price || '0', 10);
          const sessions = parseInt(card.dataset.sessions || '0', 10);

          let items = getCart();
          const found = items.find(i => i.id === id);
          if (found) found.qty += 1;
          else items.push({ id, name, price, sessions, qty: 1 });

          setCart(items);
          openCart(); // buka panel sesuai device
        }

        // Inc/Dec/Remove (delegation)
        const inc = e.target.closest('[data-inc]');
        const dec = e.target.closest('[data-dec]');
        const rem = e.target.closest('[data-remove]');
        if (inc || dec || rem) {
          let items = getCart();
          const id = (inc && inc.dataset.inc) || (dec && dec.dataset.dec) || (rem && rem.dataset.remove);
          const idx = items.findIndex(i => i.id === id);
          if (idx === -1) return;

          if (inc) items[idx].qty += 1;
          if (dec) items[idx].qty = Math.max(1, items[idx].qty - 1);
          if (rem) items.splice(idx, 1);

          setCart(items);
        }
      });

      // Kosongkan keranjang (dua tombol)
      clearBtn?.addEventListener('click', () => setCart([]));
      clearBtnMob?.addEventListener('click', () => setCart([]));
    });