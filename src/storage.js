import DOM from './elements-from-dom.js';

let store = { ...JSON.parse(localStorage.getItem('exchangeRateQuote')) };

store.sourceCurrency = store.sourceCurrency || DOM.sourceCurrencySelect.value;
store.targetCurrency = store.targetCurrency || DOM.targetCurrencySelect.value;

const getInMemoryStorage = () => ({ ...store });

const setInMemoryStorage = values => {
  store = { ...store, ...values };
};

const setLocalStorage = values => {
  localStorage.setItem('exchangeRateQuote', JSON.stringify(values));
};

export {
  getInMemoryStorage,
  setInMemoryStorage,
  setLocalStorage,
};
