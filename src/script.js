$(() => {
  document.baseTitle = document.title;
  const contentDiv = $("#main");
  var currentPage;
  function loadPage(id) {
    if (!id)
      id =
        document.location.pathname == "/"
          ? "home"
          : document.location.pathname.slice(1);
    if (id != currentPage) {
      const req = new XMLHttpRequest();
      function error() {
        document.title = `${req.status} - ${document.baseTitle}`;
        const html = `<div align="center"><h2>${req.status} error 💀</h2><p>${req.statusText}</p></div>`;
        contentDiv.html(html);
        window.history.pushState(
          { html: html, title: document.title },
          document.title,
          new URL(id == "home" ? "" : id, document.location.origin).href
        );
      }
      req.addEventListener("load", () => {
        if (req.readyState == 4) {
          if (req.status == 200) {
            const isHome = id == "home";
            currentPage = id;
            document.title = isHome
              ? document.baseTitle
              : `${
                  id.charAt(0).toUpperCase() + id.slice(1).replace("-", " ")
                } - ${document.baseTitle}`;
            contentDiv.html(req.responseText);
            window.history.pushState(
              { html: req.responseText, title: document.title },
              document.title,
              new URL(isHome ? "" : id, document.location.origin).href
            );
          } else error();
        }
      });
      req.addEventListener("error", error);
      req.open("GET", "/pages/" + id + ".html", true);
      req.send();
    }
  }
  function fixPageURL(url) {
    if (url.trim() == "" || url == "/") return "home";
    else if (url.startsWith("/")) return url.slice(1);
    return url;
  }
  loadPage();
  $(window).on("popstate", (e) => {
    if (e.state) {
      contentDiv.html(e.state.html);
      document.title = e.state.title;
    }
  });
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
