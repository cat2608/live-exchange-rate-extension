import DOM from './elements-from-dom';

let store = { ...JSON.parse(localStorage.getItem('exchangeRateQuote')) };

store.sourceCurrency = store.sourceCurrency || DOM.sourceCurrencySelect.value;
store.targetCurrency = store.targetCurrency || DOM.targetCurrencySelect.value;

const getInMemoryStore = () => ({ ...store });

const setInMemoryStore = values => {
  store = { ...store, ...values };
};

const setLocalStorage = values => {
  localStorage.setItem('exchangeRateQuote', JSON.stringify(values));
};

const updateStores = ({ sourceCurrency, targetCurrency }) => {
  setInMemoryStore({ sourceCurrency, targetCurrency });
  setLocalStorage({ sourceCurrency, targetCurrency });
};

export {
  getInMemoryStore,
  updateStores,
  setInMemoryStore,
};
