// eslint-disable-next-line no-extra-parens
const exchangeRateSource = (sourceCurrency, targetCurrency) => (
  `https://api.exchangeratesapi.io/latest?base=${sourceCurrency}&symbols=${targetCurrency}`
);

const getExchangeRateFor = async ({ sourceCurrency, targetCurrency }) => {
  const response = await fetch(exchangeRateSource(sourceCurrency, targetCurrency));
  const exchangeRate = await response.json();
  const now = new Date();

  return {
    rate: exchangeRate.rates[targetCurrency],
    sourceCurrency,
    targetCurrency,
    timeRequested: now.toLocaleString(),
  };
};

export default getExchangeRateFor;
