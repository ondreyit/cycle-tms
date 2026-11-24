(function () {
  "use strict";

  var toggle = document.querySelector("[data-nav-toggle]");
  var drawer = document.querySelector("[data-nav-drawer]");

  function setNav(open) {
    if (!toggle || !drawer) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNav(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });
  }

  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var modal = document.querySelector("[data-modal]");
  var form = document.querySelector("[data-walkthrough-form]");
  var error = document.querySelector("[data-form-error]");

  function setModal(open) {
    if (!modal) return;
    modal.classList.toggle("is-open", open);
    modal.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("modal-open", open);
    if (open) {
      var first = modal.querySelector("input");
      if (first) first.focus();
    }
  }

  document.querySelectorAll("[data-open-walkthrough]").forEach(function (button) {
    button.addEventListener("click", function () {
      setNav(false);
      setModal(true);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach(function (button) {
    button.addEventListener("click", function () {
      setModal(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal && modal.classList.contains("is-open")) {
      setModal(false);
    }
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (error) error.hidden = true;

      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var company = String(data.get("company") || "").trim();
      var email = String(data.get("email") || "").trim();
      var note = String(data.get("note") || "").trim();

      if (!name || !company || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (error) error.hidden = false;
        return;
      }

      var lines = [
        "Name: " + name,
        "Company: " + company,
        "Email: " + email,
        "",
        note || "Please set a first meeting about Cycle TMS."
      ];

      window.location.href =
        "mailto:info@cycletiger.com?subject=" +
        encodeURIComponent("Cycle TMS — first meeting — " + company) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));
    });
  }
})();
