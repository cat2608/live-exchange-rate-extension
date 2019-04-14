import DOM from './elements-from-dom';
import updateCurrencyFlagIcons from './currency-flag-icons';

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
  restoreExchangeRateContainer();
  updateExchangeRateContainer(rate, timeRequested);
  updateCurrencyFlagIcons(sourceCurrency, targetCurrency);
  updateRouteLabel(sourceCurrency, targetCurrency);
  updateCurrencySelectors(sourceCurrency, targetCurrency);

  return { rate, sourceCurrency, targetCurrency, timeRequested };
};

export default updateUI;
