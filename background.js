chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "showInformation",
    title: "showInformation", //
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if ("showInformation" === info.menuItemId) {
    showInformation(info.selectionText);
  }
});

const showInformation = (selected) => {
  console.log(selected);
};
