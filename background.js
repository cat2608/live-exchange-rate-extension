chrome.runtime.onInstalled.addListener(function () {

  // eslint-disable-next-line no-undefined
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        actions: [new chrome.declarativeContent.ShowPageAction()],
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlMatches: 'https://*/*' },
          })
        ],
      }
    ]);
  });
});
