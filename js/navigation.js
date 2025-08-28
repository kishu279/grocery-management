(function () {
  function setActiveLink(targetPageId) {
    document.querySelectorAll(".nav-link").forEach(function (link) {
      var page = link.getAttribute("data-page");
      if (!page) return;
      link.classList.toggle("active", page === targetPageId);
    });
  }

  function showPage(targetPageId) {
    document.querySelectorAll(".page").forEach(function (page) {
      page.classList.toggle("active", page.id === targetPageId + "-page");
    });
    setActiveLink(targetPageId);
    document.dispatchEvent(
      new CustomEvent("page:changed", { detail: { page: targetPageId } })
    );
  }

  function setupNav() {
    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var page = link.getAttribute("data-page");
        if (page) showPage(page);
        // close mobile menu if open
        var menu = document.querySelector(".nav-menu");
        if (menu) menu.classList.remove("open");
      });
    });

    var toggle = document.querySelector(".nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var menu = document.querySelector(".nav-menu");
        if (menu) menu.classList.toggle("open");
      });
    }
  }

  window.Navigation = {
    showPage: showPage,
    setup: setupNav,
  };
})();
