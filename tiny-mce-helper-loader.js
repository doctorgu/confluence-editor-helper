const resources = [
  "react.development.js",
  "react-dom.development.js",
  "hmall-part-compiled.js",
];
resources.forEach((resource) => {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL(resource);
  document.body.appendChild(s);
});
