/* In-page behavior only. No server posts and no calendar. The questionnaire opens a mail draft. */
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

  function questionnaireRecipient() {
    var codes = [115, 112, 101, 97, 107, 117, 112, 115, 108, 112, 49, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109];
    return codes.map(function (code) {
      return String.fromCharCode(code);
    }).join("");
  }

  var contactEmail = document.querySelector("#contact-email");
  if (contactEmail) {
    var address = questionnaireRecipient();
    contactEmail.textContent = address;
    contactEmail.setAttribute("href", "mailto:" + address);
  }

  function formatUsPhone(value) {
    var digits = value.replace(/\D/g, "");
    if (digits.length === 11 && digits.charAt(0) === "1") {
      digits = digits.slice(1);
    }
    digits = digits.slice(0, 10);
    if (digits.length < 4) {
      return digits.length ? "(" + digits : "";
    }
    if (digits.length < 7) {
      return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    }
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
  }

  var faqForm = document.querySelector("#faq-form");
  if (faqForm) {
    var phone = faqForm.querySelector("#faq-phone");
    if (phone) {
      phone.addEventListener("input", function () {
        var caret = phone.selectionStart;
        var digitsBefore = phone.value.slice(0, caret).replace(/\D/g, "").length;
        var formatted = formatUsPhone(phone.value);
        phone.value = formatted;
        var pos = 0;
        var seen = 0;
        while (pos < formatted.length && seen < digitsBefore) {
          if (/\d/.test(formatted.charAt(pos))) {
            seen += 1;
          }
          pos += 1;
        }
        phone.setSelectionRange(pos, pos);
      });
    }

    faqForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var lines = [];
      faqForm.querySelectorAll(".field").forEach(function (field) {
        var label = field.querySelector("label");
        var control = field.querySelector("input, textarea, select");
        if (!control) {
          return;
        }
        lines.push(label ? label.textContent : control.name);
        lines.push(control.value);
        lines.push("");
      });
      var draft = "mailto:" + questionnaireRecipient()
        + "?subject=" + encodeURIComponent("Speak Up questionnaire")
        + "&body=" + encodeURIComponent(lines.join("\n"));
      window.location.href = draft;
    });
  }

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
