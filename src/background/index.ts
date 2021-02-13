import lzstring from 'lz-string';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type } = message;
  if (type == 'get') {
    fetch(message.url)
      .then((response) => response.json())
      .then((response) => sendResponse(response))
      .catch();
    return true;
  }
});

chrome.contextMenus.removeAll();
chrome.contextMenus.create({
  id: 'playground',
  title: 'Paste on ts playground',
  contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === 'playground') {
    const selectionText = await getSelectionTextWithBreaks();
    const zippedCode = lzstring.compressToEncodedURIComponent(selectionText);
    const playgroundURL = `https://www.typescriptlang.org/play/#code/${zippedCode}`;
    chrome.tabs.create({
      url: playgroundURL,
      active: true,
    });
  }
});

function getSelectionTextWithBreaks() {
  return new Promise((resolve, reject) => {
    chrome.tabs.executeScript(
      {
        code: 'window.getSelection().toString();',
      },
      (selection) => {
        if (selection) {
          const selected = selection[0];
          resolve(selected);
        }
      }
    );
  });
}
