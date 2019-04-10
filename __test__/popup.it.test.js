describe('Default currency route', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:9000/popup.html');
  });

  it('should be GBP for source currency', async () => {
    const sourceCurrency = await page.$eval('#sourceCurrency', e => e.value);
    expect(sourceCurrency).toBe('GBP');
  });

  it('should be BRL for target currency', async () => {
    const targetCurrency = await page.$eval('#targetCurrency', e => e.value);
    expect(targetCurrency).toBe('BRL');
  });

  it('should show label', async () => {
    const routeText = await page.$eval('.exchange-rate-route-text', e => e.innerHTML);
    expect(routeText).toBe('GBP / BRL');
  });
});
