import {
  currencyList,
  getExchangeRateFor,
  getInMemoryStorage,
  setInMemoryStorage,
  updateUi,
  updateUiErrorMessage,
} from './src/index.js';

import DOM from './src/elements-from-dom.js';

const settingsSelectClassName = DOM.settingsSelect.className.slice(0);
const addFavCurrenciesClassName = DOM.addFavCurrencies.className.slice(0);

DOM.settingsBtn.addEventListener('click', () => {
  const showSettingsSelect = DOM.settingsSelect.className.indexOf('show') === -1;
  DOM.settingsBtn.textContent = showSettingsSelect ? 'Close' : '︎Options';
  DOM.settingsSelect.className = showSettingsSelect ? `${settingsSelectClassName} show` : settingsSelectClassName;
  DOM.addFavCurrencies.className = showSettingsSelect ? `${addFavCurrenciesClassName} show` : addFavCurrenciesClassName;
});

DOM.addFavCurrencies.addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

const init = (sourceOrTargetCurrency) => {
  const route = { ...getInMemoryStorage(), ...sourceOrTargetCurrency };
  getExchangeRateFor(route)
    .then(updateUi)
    .catch(updateUiErrorMessage);
};

const populateSelectOption = (select) => {
  currencyList.forEach(c => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    select.appendChild(option);
  });
};

const handleOnSelectCurrency = (select) => {
  select.addEventListener('change', () => {
    const sourceOrTargetCurrency = { [select.id]: select.value };
    setInMemoryStorage({ ...sourceOrTargetCurrency, rate: null });
    init(sourceOrTargetCurrency);
  });
};

DOM.selects.forEach(select => {
  populateSelectOption(select);
  handleOnSelectCurrency(select);
});

init();
