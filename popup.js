const settingsBtn = document.querySelector('.settings-label');
const settingsSelect = document.querySelector('.settings-select');
const addFavCurrencies = document.querySelector('.add-currencies-label');

const settingsSelectClassName = settingsSelect.className.slice(0);
const addFavCurrenciesClassName = addFavCurrencies.className.slice(0);

let store = { ...JSON.parse(localStorage.getItem('exchangeRateQuote')) };
store.sourceCurrency = store.sourceCurrency || document.querySelector('#sourceCurrency').value;
store.targetCurrency = store.targetCurrency || document.querySelector('#targetCurrency').value;

settingsBtn.addEventListener('click', () => {
  const showSettingsSelect = settingsSelect.className.indexOf('show') === -1;
  settingsBtn.textContent = showSettingsSelect ? 'Close' : '︎Options';
  settingsSelect.className = showSettingsSelect ? `${settingsSelectClassName} show` : settingsSelectClassName;
  addFavCurrencies.className = showSettingsSelect ? `${addFavCurrenciesClassName} show` : addFavCurrenciesClassName;
});

addFavCurrencies.addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

const replaceFileName = (filePath, currencyFlagName) => filePath
  .replace(/(.*)\/.*(\.svg$)/i, `$1/${currencyFlagName.toLowerCase()}$2`);

const updateCurrencyFlagsIcon = () => {
  const sourceCurrencyFlag = document.querySelector('.sourceCurrency');
  const targetCurrencyFlag = document.querySelector('.targetCurrency');

  sourceCurrencyFlag.src = replaceFileName(sourceCurrencyFlag.src, store.sourceCurrency);
  targetCurrencyFlag.src = replaceFileName(targetCurrencyFlag.src, store.targetCurrency);
};

const updateRouteLabel = () => {
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
};

// eslint-disable-next-line no-extra-parens
const exchangeRateSource = (sourceCurrency, targetCurrency) => (
  `https://api.exchangeratesapi.io/latest?base=${sourceCurrency}&symbols=${targetCurrency}`
);

const fetchExchangeRateFor = async (route) => {
  const { sourceCurrency, targetCurrency } = route;
  const response = await fetch(exchangeRateSource(sourceCurrency, targetCurrency));
  const exchangeRate = await response.json();
  const now = new Date();

  return {
    ...store,
    ...route,
    rate: exchangeRate.rates[store.targetCurrency],
    timeRequested: now.toLocaleString(),
  };
};

const getElementsFromDom = () => ({
  containerExchangeRateData: document.querySelector('.container-exchange-rate'),
  containerFlags: document.querySelector('.container-flags'),
  exchangeRateData: document.querySelector('.exchange-rate-data'),
  exchangeRateError: document.querySelector('.exchange-rate-error'),
  exchangeTime: document.querySelector('.exchange-rate-date-collected'),
  exchangeValue: document.querySelector('.exchange-rate-value'),
});

const restoreExchangeRateDataContainer = () => {
  const { exchangeRateData, exchangeRateError, containerFlags } = getElementsFromDom();
  exchangeRateData.className = exchangeRateData.className.replace("hide", "");
  exchangeRateError.className = exchangeRateError.className.replace("show", "");
  containerFlags.className = containerFlags.className.replace("opaque", "");
};

const updateContainerExchangeRate = ({ rate, timeRequested }) => {
  const { exchangeValue, exchangeTime, containerExchangeRateData } = getElementsFromDom();
  exchangeValue.innerHTML = rate.toString().substring(0, 6);
  exchangeTime.innerHTML = timeRequested;
  containerExchangeRateData.className = containerExchangeRateData.className.replace("loader", "");
};

const updateUI = (data) => {
  const route = { ...store, ...data };

  fetchExchangeRateFor(route)
    .then(result => {

      if (store.errorMessage) {
        restoreExchangeRateDataContainer();
        updateStore({ errorMessage: null });
      }

      updateContainerExchangeRate(result);

      updateCurrencyFlagsIcon();
      updateRouteLabel();
      updateCurrencySelectors();

      updateStore(result);
      updateLocalStorage(result);

    }).catch(err => {
      console.info(err); // eslint-disable-line no-console
      const { exchangeRateData, exchangeRateError, containerFlags } = getElementsFromDom();
      exchangeRateData.className += ' hide';
      exchangeRateError.className += ' show';
      containerFlags.className += ' opaque';
      updateCurrencyFlagsIcon();
      updateStore({ errorMessage: true });
    });
};

/* eslint-disable */
const currencies = [
  'AED', 'ANG', 'ARS', 'AUD', 'BBD', 'BDT', 'BGN', 'BHD', 'BMD', 'BRL', 'CAD', 'CHF', 'CLP',
  'CNY', 'CZK', 'DKK', 'EUR', 'FJD', 'GBP', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'JOD',
  'JPY', 'KES', 'KRW', 'KWD', 'LBP', 'LKR', 'MAD', 'MUR', 'MXN', 'MYR', 'NGN', 'NOK', 'NZD',
  'OMR', 'PGK', 'PHP', 'PKR', 'PLN', 'QAR', 'RON', 'RSD', 'RUB', 'SAR', 'SBD', 'SEK', 'SGD',
  'THB', 'TND', 'TOP', 'TRY', 'TWD', 'USD', 'VND', 'VUV', 'WST', 'XPF', 'ZAR',
];
/* eslint-enable */

const selects = document.querySelectorAll('select');

const populateSelectOption = (select) => {
  currencies.forEach(c => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    select.appendChild(option);
  });
};

const handleOnSelectCurrency = (select) => {
  select.addEventListener('change', () => {
    const data = { [select.id]: select.value, rate: null };
    updateStore(data);
    updateUI(data);
  });
};

selects.forEach(select => {
  populateSelectOption(select);
  handleOnSelectCurrency(select);
});

updateUI();
