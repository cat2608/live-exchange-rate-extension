const settingsBtn = document.querySelector('.settings');
const settingsBox = document.querySelector('.settings-box');
const settingsBoxClassName = settingsBox.className.slice(0);

settingsBtn.onclick = () => {
  const showSettingsBox = settingsBox.className.indexOf("show") === -1;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.executeScript(
    tabs[0].id,
    { code: showSettingsBox ? settingsBox.className += " show" : settingsBox.className = settingsBoxClassName });
});
};