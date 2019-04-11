import DOM from './elements-from-dom.js';
import { setInMemoryStorage } from './storage.js';
import updateCurrencyFlagIcons from './currency-flag-icons.js';

const updateUiErrorMessage = (err, { sourceCurrency, targetCurrency }) => {
  console.error(err); // eslint-disable-line no-console

  const { exchangeRateData, exchangeRateError, containerFlags } = DOM;
  exchangeRateData.className += ' hide';
  exchangeRateError.className += ' show';
  containerFlags.className += ' opaque';
  updateCurrencyFlagIcons(sourceCurrency, targetCurrency);
  setInMemoryStorage({ errorMessage: true });
};

export default updateUiErrorMessage;
