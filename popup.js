const settingsBtn = document.querySelector('.settings-label');
const settingsBox = document.querySelector('.settings-box');
const settingsBoxClassName = settingsBox.className.slice(0);

const sourceCurrency = document.querySelector('.sourceCurrency');
const targetCurrency = document.querySelector('.targetCurrency');
const routeText = document.querySelector('.exchange-rate-route');

let store = { ...JSON.parse(localStorage.getItem('exchangeRateQuote')) };
let exchangeRateQuote = store;


const updateCurrencyFlags = () => {
  sourceCurrency.src = sourceCurrency.src.replace(/(.*)\/.*(\.svg$)/i, `$1/${store.sourceCurrency.toLowerCase()}$2`);
  targetCurrency.src = targetCurrency.src.replace(/(.*)\/.*(\.svg$)/i, `$1/${store.targetCurrency.toLowerCase()}$2`);
};

const updateRouteText = () => {
  routeText.innerHTML = `${store.sourceCurrency.toUpperCase()} / ${store.targetCurrency.toUpperCase()}`;
};

settingsBtn.onclick = () => {
  const showSettingsBox = settingsBox.className.indexOf("show") === -1;

  settingsBtn.textContent = showSettingsBox ? "Close" : "Settings";

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { code: showSettingsBox ? settingsBox.className += " show" : settingsBox.className = settingsBoxClassName });
  });
};

store.sourceCurrency = document.querySelector('#sourceCurrency').value;
store.targetCurrency = document.querySelector('#targetCurrency').value;


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
      console.log(result);
      const exchangeValue = document.querySelector('.exchange-rate-value');
      const exchangeTime = document.querySelector('.exchange-rate-date-collected');
      const containerEchangeRateData = document.querySelector('.container-exchange-rate-data');

      exchangeValue.innerHTML = result.rate.toString().substring(0, 6);
      exchangeTime.innerHTML = result.timeRequested;

      updateCurrencyFlags();
      updateRouteText();
      console.log('containerEchangeRateData.className ::', containerEchangeRateData.className);
      containerEchangeRateData.className = containerEchangeRateData.className.replace("loader", "");

    }).catch(err => {
      console.log('{ERROR!}', err);
      const container = document.querySelector('.container-exchange-rate-data');
      container.className += ' error-message';
      container.innerHTML = "uh-oh! We can’t find the rate right now 😰. Please try again later."
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