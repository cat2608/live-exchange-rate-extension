import DOM from './elements-from-dom';
import updateCurrencyFlagIcons from './currency-flag-icons';

const isErrorMessageDisplayed = (exchangeRateData, exchangeRateError, containerFlags) => {
  const exchangeRateContainerIsHidden = exchangeRateData.className.indexOf('hide') !== -1;
  const exchangeRateErrorMessageIsShown = exchangeRateError.className.indexOf('show') !== -1;
  const imageFlagsAreOpaque = containerFlags.className.indexOf('opaque') !== -1;

  return exchangeRateContainerIsHidden && exchangeRateErrorMessageIsShown && imageFlagsAreOpaque;
};

const updateUiErrorMessage = (err, { sourceCurrency, targetCurrency }) => {
  console.error(err); // eslint-disable-line no-console

  const { exchangeRateData, exchangeRateError, containerFlags } = DOM;

  if (!isErrorMessageDisplayed(exchangeRateData, exchangeRateError, containerFlags)) {
    exchangeRateData.className = `${exchangeRateData.className} hide`;
    exchangeRateError.className = `${exchangeRateError.className} show`;
    containerFlags.className = `${containerFlags.className} opaque`;
  }

  updateCurrencyFlagIcons(sourceCurrency, targetCurrency);
};

export default updateUiErrorMessage;
