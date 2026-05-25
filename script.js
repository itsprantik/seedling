(function(){
  const currencyPrices = {
    'USD': [42, 58, 75, 36, 64, 82, 48, 54, 29, 96, 118, 149],
    'CAD': [58, 80, 103, 50, 88, 113, 66, 74, 40, 132, 162, 205],
    'AUD': [65, 89, 116, 55, 99, 126, 74, 83, 45, 148, 182, 230],
    'GBP': [33, 45, 59, 28, 50, 64, 37, 42, 23, 75, 92, 116],
    'EUR': [38, 52, 68, 33, 58, 74, 43, 49, 26, 86, 106, 134],
    'INR': [3490, 4814, 6225, 2989, 5312, 6807, 3985, 4483, 2408, 7970, 9796, 12371],
    'AED': [154, 213, 275, 132, 235, 301, 176, 198, 107, 353, 433, 547],
    'SAR': [158, 218, 281, 135, 240, 308, 180, 203, 109, 360, 443, 559],
    'SGD': [57, 78, 101, 49, 86, 111, 65, 73, 39, 130, 159, 201],
    'JPY': [6510, 8990, 11625, 5580, 9920, 12710, 7440, 8370, 4495, 14880, 18290, 23095],
    'BRL': [235, 324, 420, 202, 358, 459, 269, 302, 162, 538, 661, 834],
    'MXN': [714, 986, 1275, 612, 1088, 1394, 816, 918, 493, 1632, 2006, 2533],
    'CNY': [302, 418, 540, 259, 461, 590, 346, 389, 209, 691, 850, 1073],
    'ZAR': [756, 1044, 1350, 648, 1152, 1476, 864, 972, 522, 1728, 2124, 2682]
  };

  const countryCurrency = {
    US: 'USD',
    GB: 'GBP',
    DE: 'EUR',
    FR: 'EUR',
    IN: 'INR',
    CA: 'CAD',
    AU: 'AUD',
    IT: 'EUR',
    ES: 'EUR',
    NL: 'EUR',
    AE: 'AED',
    SA: 'SAR',
    SG: 'SGD',
    JP: 'JPY',
    BR: 'BRL',
    MX: 'MXN',
    CN: 'CNY',
    ZA: 'ZAR'
  };

  const localeByCountry = {
    US: 'en-US',
    GB: 'en-GB',
    DE: 'de-DE',
    FR: 'fr-FR',
    IN: 'en-IN',
    CA: 'en-CA',
    AU: 'en-AU',
    IT: 'it-IT',
    ES: 'es-ES',
    NL: 'nl-NL',
    AE: 'en-AE',
    SA: 'ar-SA',
    SG: 'en-SG',
    JP: 'ja-JP',
    BR: 'pt-BR',
    MX: 'es-MX',
    CN: 'zh-CN',
    ZA: 'en-ZA'
  };

  const defaultCountry = 'US';
  const companyEmail = 'seedlingcorporation@gmail.com';
  const companyWhatsApp = '919709239892';

  const countrySelectEls = document.querySelectorAll('#countrySelect');
  const buyButtons = document.querySelectorAll('.buy-btn');
  const shopNowLinks = document.querySelectorAll('.shop-now');

  function detectCountry(){
    const saved = localStorage.getItem('seedling_country');
    if(saved) return saved;
    const nav = navigator.language || navigator.userLanguage || 'en-US';
    const parts = nav.split('-');
    const c = (parts[1] || parts[0]).toUpperCase();
    return countryCurrency[c] ? c : defaultCountry;
  }

  function setCountry(countryCode){
    localStorage.setItem('seedling_country', countryCode);
    countrySelectEls.forEach(s => { if(s) s.value = countryCode; });
    updatePricesFor(countryCode);
  }

  function updatePricesFor(countryCode){
    const currency = countryCurrency[countryCode] || 'USD';
    const locale = localeByCountry[countryCode] || 'en-US';
    const prices = currencyPrices[currency] || currencyPrices['USD'];

    document.querySelectorAll('.product-card').forEach((card, idx) => {
      const priceEl = card.querySelector('.price');
      if(!priceEl) return;
      const amount = prices[idx] !== undefined ? prices[idx] : prices[0];
      const formatted = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
      priceEl.textContent = formatted;
    });
  }

  const initialCountry = detectCountry();
  setCountry(initialCountry);

  countrySelectEls.forEach(select => {
    select.addEventListener('change', (e) => setCountry(e.target.value));
  });

  shopNowLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      localStorage.setItem('seedling_country', document.querySelector('#countrySelect')?.value || initialCountry);
    });
  });

  const modal = document.getElementById('orderModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalName = document.getElementById('orderName');
  const modalQty = document.getElementById('orderQty');
  const modalCancel = document.getElementById('modalCancel');
  const modalWhatsApp = document.getElementById('modalWhatsApp');
  const modalEmail = document.getElementById('modalEmail');

  let currentProduct = null;

  function openModalFor(productIndex){
    const country = localStorage.getItem('seedling_country') || initialCountry;
    const currency = countryCurrency[country] || 'USD';
    const locale = localeByCountry[country] || 'en-US';
    const prices = currencyPrices[currency] || currencyPrices['USD'];
    const price = prices[productIndex];
    const formatted = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(price);

    currentProduct = { index: productIndex, price, formatted };
    modalTitle.textContent = 'Confirm order — ' + document.querySelector('.product-card[data-index="' + productIndex + '"] h3')?.textContent || 'Product';
    modalDesc.textContent = `Price: ${formatted}`;
    modalName.value = '';
    modalQty.value = 1;
    modal.style.display = 'flex';
  }

  function closeModal(){ modal.style.display = 'none'; }

  function sendOrder(method){
    const name = modalName.value.trim() || 'Customer';
    const qty = Number(modalQty.value) || 1;

    const country = localStorage.getItem('seedling_country') || initialCountry;
    const currency = countryCurrency[country] || 'USD';
    const locale = localeByCountry[country] || 'en-US';
    const total = currentProduct.price * qty;
    const formattedTotal = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(total);
    const productTitle = document.querySelector('.product-card[data-index="' + currentProduct.index + '"] h3')?.textContent || 'Product';

    const orderSummary = `Order from Seedling\n\nName: ${name}\nProduct: ${productTitle}\nQuantity: ${qty}\nTotal: ${formattedTotal}\nCountry: ${country}`;

    if(method === 'email'){
      const subject = encodeURIComponent(`Seedling order: ${productTitle}`);
      const body = encodeURIComponent(orderSummary + '\n\nPlease confirm the order and provide payment details.');
      window.location.href = `mailto:${companyEmail}?subject=${subject}&body=${body}`;
    } else if(method === 'whatsapp'){
      const text = encodeURIComponent(orderSummary + '\n\nPlease confirm this order.');
      window.open(`https://wa.me/${companyWhatsApp}?text=${text}`, '_blank');
    }

    closeModal();
  }

  buyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const idx = Number(btn.dataset.index || btn.getAttribute('data-index')) || 0;
      openModalFor(idx);
    });
  });

  modalCancel?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
  modalWhatsApp?.addEventListener('click', () => sendOrder('whatsapp'));
  modalEmail?.addEventListener('click', () => sendOrder('email'));
})();
