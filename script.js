$(() => {
  const contentDiv = $("#main");
  function loadPage(id) {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
      contentDiv.html(req.responseText);
    });
    req.open("GET", "/pages/" + id + ".html");
    req.send();
  }
  function fixPageURL(url) {
    if (url.trim() == "" || url == "/") return "home";
    else if (url.startsWith("/")) return url.substring(1);
    return url;
  }
  loadPage("home");
  $(document).on("click", "a", (e) => {
    var url = $(e.target).attr("href");
    if (url) {
      try {
        url = new URL(url);
      } catch {
        e.preventDefault();
        loadPage(fixPageURL(url));
        return;
      }
      if (url.origin === document.location.origin) {
        e.preventDefault();
        loadPage(fixPageURL(url.pathname));
      }
    }
  });
});
