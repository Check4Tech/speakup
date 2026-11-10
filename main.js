/* In-page behavior only. No network calls, no calendar, no email. */
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#site-nav");

  function setOpen(open) {
    if (!toggle || !nav) {
      return;
    }
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close" : "Menu");
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });

    nav.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (link) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    var desktop = window.matchMedia("(min-width: 761px)");
    if (desktop.addEventListener) {
      desktop.addEventListener("change", function (event) {
        if (event.matches) {
          setOpen(false);
        }
      });
    }
  }

  var items = document.querySelectorAll(".faq-list details");
  var faqLock = false;
  items.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (faqLock || !item.open) {
        return;
      }
      faqLock = true;
      items.forEach(function (other) {
        if (other !== item) {
          other.open = false;
        }
      });
      faqLock = false;
    });
  });

  /* Schedule has no calendar yet. The click must not navigate. */
  document.querySelectorAll("[data-schedule]").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
    });
  });

  var navLinks = document.querySelectorAll(".site-nav a");

  function markCurrent() {
    var id = location.hash || "#home";
    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === id) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  markCurrent();
  window.addEventListener("hashchange", markCurrent);
})();
