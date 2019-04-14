import DOM from './elements-from-dom';

const replaceFileName = (filePath, currencyFlagName) => filePath
  .replace(/(.*)\/.*(\.svg$)/i, `$1/${currencyFlagName.toLowerCase()}$2`);

const updateCurrencyFlagIcons = (sourceCurrency, targetCurrency) => {
  DOM.sourceCurrencyFlag.src = replaceFileName(DOM.sourceCurrencyFlag.src, sourceCurrency);
  DOM.targetCurrencyFlag.src = replaceFileName(DOM.targetCurrencyFlag.src, targetCurrency);
};

export default updateCurrencyFlagIcons;
