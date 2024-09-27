(function loadPageTime() {
  const start = Date.now();

  function getPageLoadTime() {
    const loadTime = Date.now() - start
    const loadTimeRow = "Страница загрузилась за " + loadTime.toFixed(2) + " миллисекунд";
    let pageLoadTimeElement = document.getElementById('pageLoadTime');
    pageLoadTimeElement.textContent = loadTimeRow
  }

  window.addEventListener("load", getPageLoadTime);
})();
