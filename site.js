"use strict";

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-navigation");
const appMenu = navigation.querySelector(".app-menu");
const isArabic = document.documentElement.lang === "ar-SA";
const openNavigationLabel = isArabic ? "افتح القائمة" : "Open navigation";
const closeNavigationLabel = isArabic ? "أغلق القائمة" : "Close navigation";

const languageLink = document.querySelector("[data-language-switch]");
const languageTarget = new URL(languageLink.href);

function updateLanguageLink() {
  languageTarget.hash = window.location.hash;
  languageLink.href = languageTarget.href;
}

updateLanguageLink();
window.addEventListener("hashchange", updateLanguageLink);

function setNavigation(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? closeNavigationLabel : openNavigationLabel);
  navigation.classList.toggle("is-open", open);
  if (!open) appMenu.open = false;
}

menuButton.addEventListener("click", () => setNavigation(menuButton.getAttribute("aria-expanded") === "false"));

document.addEventListener("click", (event) => {
  if (!appMenu.contains(event.target)) appMenu.open = false;
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (appMenu.open) {
    appMenu.open = false;
    appMenu.querySelector("summary").focus();
  } else if (menuButton.getAttribute("aria-expanded") === "true") {
    setNavigation(false);
    menuButton.focus();
  }
});

matchMedia("(min-width: 70rem)").addEventListener("change", (event) => {
  if (event.matches) setNavigation(false);
});

const screenDialog = document.querySelector(".image-dialog");

if (screenDialog && typeof screenDialog.showModal === "function") {
  const title = screenDialog.querySelector("h2");
  const image = screenDialog.querySelector("img");
  const caption = screenDialog.querySelector("p");
  const original = screenDialog.querySelector(".original-image");
  let lastLink;

  for (const link of document.querySelectorAll("[data-enlarge]")) {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      lastLink = link;
      title.textContent = link.dataset.title;
      image.src = link.href;
      original.href = link.href;
      image.alt = link.querySelector("img").alt;
      caption.textContent = link.dataset.caption;
      screenDialog.showModal();
      document.body.classList.add("dialog-open");
    });
  }

  screenDialog.querySelector(".dialog-close").addEventListener("click", () => screenDialog.close());
  screenDialog.addEventListener("click", (event) => {
    if (event.target === screenDialog) screenDialog.close();
  });
  screenDialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    image.removeAttribute("src");
    lastLink?.focus();
  });
}
