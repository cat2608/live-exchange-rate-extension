import axios from "axios";

const ACCESS_KEY = "f57009f0-c800-4e68-a25b-dfb93cade22c";

// eslint-disable-next-line no-extra-parens
const exchangeRateSource = (sourceCurrency, targetCurrency) => (
  `http://api.exchangeratesapi.io/v1/latest?access_key=${ACCESS_KEY}&format=1base=${sourceCurrency}&symbols=${targetCurrency}`
);

const getExchangeRateFor = async ({ sourceCurrency, targetCurrency }) => {
  const { data: exchangeRate } = await axios.get(exchangeRateSource(sourceCurrency, targetCurrency));
  const now = new Date();

  return {
    rate: exchangeRate.rates[targetCurrency],
    sourceCurrency,
    targetCurrency,
    timeRequested: now.toLocaleString(),
  };
};

export default getExchangeRateFor;
