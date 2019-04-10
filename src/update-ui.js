import { getInMemoryStorage, setInMemoryStorage, setLocalStorage } from './storage.js';
import DOM from './elements-from-dom.js';
import updateCurrencyFlagIcons from './currency-flag-icons.js';

const updateRouteLabel = (sourceCurrency, targetCurrency) => {
  const { routeText } = DOM;
  routeText.innerHTML = `${sourceCurrency.toUpperCase()} / ${targetCurrency.toUpperCase()}`;
};

const updateCurrencySelectors = (sourceCurrency, targetCurrency) => {
  const { sourceCurrencySelect, targetCurrencySelect } = DOM;
  sourceCurrencySelect.value = sourceCurrency;
  targetCurrencySelect.value = targetCurrency;
};

const restoreExchangeRateContainer = () => {
  const { exchangeRateData, exchangeRateError, containerFlags } = DOM;
  exchangeRateData.className = exchangeRateData.className.replace("hide", "");
  exchangeRateError.className = exchangeRateError.className.replace("show", "");
  containerFlags.className = containerFlags.className.replace("opaque", "");
};

const updateExchangeRateContainer = (rate, timeRequested) => {
  const { exchangeValue, exchangeTime, containerExchangeRate } = DOM;
  exchangeValue.innerHTML = rate.toString().substring(0, 6);
  exchangeTime.innerHTML = timeRequested;
  containerExchangeRate.className = containerExchangeRate.className.replace("loader", "");
};

const updateUI = ({ rate, sourceCurrency, targetCurrency, timeRequested }) => {

  if (getInMemoryStorage.errorMessage) {
    restoreExchangeRateContainer();
    setInMemoryStorage({ errorMessage: null });
    setLocalStorage({ errorMessage: null });
  }

  updateExchangeRateContainer(rate, timeRequested);

  updateCurrencyFlagIcons(sourceCurrency, targetCurrency);
  updateRouteLabel(sourceCurrency, targetCurrency);
  updateCurrencySelectors(sourceCurrency, targetCurrency);

  setInMemoryStorage({ rate, sourceCurrency, targetCurrency, timeRequested });
  setLocalStorage({ rate, sourceCurrency, targetCurrency, timeRequested });

};

export default updateUI;
