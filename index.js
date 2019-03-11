let store = { ...JSON.parse(localStorage.getItem('exchangeRateQuote')) };
store.sourceCurrency = document.querySelector('#sourceCurrency').value;
store.targetCurrency = document.querySelector('#targetCurrency').value;

let exchangeRateQuote = store;

const updateStore = (values) => {
  store = { ...store, ...values };
};

const updateLocalStorage = (values) => {
  localStorage.setItem('exchangeRateQuote', JSON.stringify(values));
}

const fetchExchangeRate = async () => {
  console.log(store.rate);
  if (!store.rate) {
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
  }

  return exchangeRateQuote;
}

const updateUI = () => {
  fetchExchangeRate()
    .then(result => {
      const exchangeValue = document.querySelector('.exchange-value');
      const exchangeTime = document.querySelector('.exchange-request-time');

      exchangeValue.innerHTML = result.rate.toString().substring(0, 6);
      exchangeTime.innerHTML = result.timeRequested;

    }).catch(err => {
      console.log('{ERROR!}');
      const container = document.querySelector('.container');
      container.className += ' error-message';
      container.innerHTML = "uh-oh! We have a connection problem 😰. Please try again later."
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