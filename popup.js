const settingsBtn = document.querySelector('.settings-label');

let store = { ...JSON.parse(localStorage.getItem('exchangeRateQuote')) };
store.sourceCurrency = store.sourceCurrency || document.querySelector('#sourceCurrency').value;
store.targetCurrency = store.targetCurrency || document.querySelector('#targetCurrency').value;

let exchangeRateQuote = store;

settingsBtn.onclick = () => {
  const settingsBox = document.querySelector('.settings-box');
  const settingsBoxClassName = settingsBox.className.slice(0);

  const showSettingsBox = settingsBox.className.indexOf("show") === -1;

  settingsBtn.textContent = showSettingsBox ? "Close" : "Settings";

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { code: showSettingsBox ? settingsBox.className += " show" : settingsBox.className = settingsBoxClassName });
  });
};

const updateCurrencyFlags = () => {
  const sourceCurrencyFlag = document.querySelector('.sourceCurrency');
  const targetCurrencyFlag = document.querySelector('.targetCurrency');

  sourceCurrencyFlag.src = sourceCurrencyFlag.src.replace(/(.*)\/.*(\.svg$)/i, `$1/${store.sourceCurrency.toLowerCase()}$2`);
  targetCurrencyFlag.src = targetCurrencyFlag.src.replace(/(.*)\/.*(\.svg$)/i, `$1/${store.targetCurrency.toLowerCase()}$2`);
};

const updateRouteText = () => {
  const routeText = document.querySelector('.exchange-rate-route-text');
  routeText.innerHTML = `${store.sourceCurrency.toUpperCase()} / ${store.targetCurrency.toUpperCase()}`;
};

const updateCurrencySelectors = () => {
  const { sourceCurrency, targetCurrency } = store;
  document.querySelector('#sourceCurrency').value = sourceCurrency;
  document.querySelector('#targetCurrency').value = targetCurrency;
};

const updateStore = (values) => {
  store = { ...store, ...values };
};

const updateLocalStorage = (values) => {
  localStorage.setItem('exchangeRateQuote', JSON.stringify(values));
}

const fetchExchangeRate = async () => {
  const response = await fetch(`https://api.exchangeratesapi.io/latest?base=${store.sourceCurrency}&symbols=${store.targetCurrency}`);
  const exchangeRate = await response.json();
  const now = new Date();

  exchangeRateQuote = {
    ...store,
    rate: exchangeRate.rates[store.targetCurrency],
    timeRequested: now.toLocaleString(),
  };

  localStorage.setItem('exchangeRateQuote', JSON.stringify(exchangeRateQuote));
  updateStore(exchangeRateQuote);

  return exchangeRateQuote;
}

const updateUI = () => {
  fetchExchangeRate()
    .then(result => {

      const exchangeValue = document.querySelector('.exchange-rate-value');
      const exchangeTime = document.querySelector('.exchange-rate-date-collected');
      const containerExchangeRateData = document.querySelector('.container-exchange-rate-data');

      exchangeValue.innerHTML = result.rate.toString().substring(0, 6);
      exchangeTime.innerHTML = result.timeRequested;

      updateCurrencyFlags();
      updateRouteText();
      updateCurrencySelectors();

      containerExchangeRateData.className = containerExchangeRateData.className.replace("loader", "");

    }).catch(err => {
      console.info(err); // eslint-disable-line no-console
      const container = document.querySelector('.container-exchange-rate-data');
      container.className += ' error-message';
      container.innerHTML = 'uh-oh! We can’t find the rate right now 😰. Please try again later.'
    });
};

const selects = document.querySelectorAll('select');
selects.forEach(s => {
  s.addEventListener('change', () => {
    const data = { [s.id]: s.value, rate: null };
    updateStore(data);
    updateLocalStorage(data);
    updateUI();
  });
});

updateUI();
