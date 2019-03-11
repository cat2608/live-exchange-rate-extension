const sourceCurrency = document.querySelector('.sourceCurrency');
const targetCurrency = document.querySelector('.targetCurrency');
const routeText = document.querySelector('.exchange-rate-route');
const exchangeValue = document.querySelector('.exchange-rate-value');

localStorage.setItem('route', JSON.stringify({ sourceCurrency: 'gbp', targetCurrency: 'eur' }));

const route = JSON.parse(localStorage.getItem('route'));
sourceCurrency.src = sourceCurrency.src.replace(/(.*)\/.*(\.png$)/i, `$1/${route.sourceCurrency}$2`);
targetCurrency.src = targetCurrency.src.replace(/(.*)\/.*(\.png$)/i, `$1/${route.targetCurrency}$2`);

routeText.innerHTML = `${route.sourceCurrency.toUpperCase()} / ${route.targetCurrency.toUpperCase()}`;