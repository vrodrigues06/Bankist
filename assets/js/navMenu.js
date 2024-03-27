export default function initMenu() {
  // ! NavBar Links Scroll
  // ? Here I use the one of most import concept of javaScript Events, the Bubbling propagation

  const menuList = document.querySelector(".nav__links");

  const scrollHandler = (e) => {
    if (e.target.classList.contains("nav__link")) {
      const id = e.target.getAttribute("href");

      if (id !== "./app.html" && id !== "#") {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  menuList.addEventListener("click", scrollHandler);

  // ! Navbar Close

  const contentNav = document.querySelector(".collapse");
  const btnNav = document.querySelector(".navbar-toggler");
  const navList = document.querySelector(".navbar-nav");
  const navToggler = document.querySelector(".navbar-toggler-icon");

  const closeMenu = (e) => {
    if (
      e.target !== contentNav &&
      e.target !== navList &&
      e.target !== btnNav &&
      e.target !== navToggler
    ) {
      btnNav.classList.toggle("collapsed");
      btnNav.setAttribute("aria-expanded", "false");
      contentNav.classList.remove("collapse");
      contentNav.classList.add("out");
      contentNav.classList.remove("show");

      contentNav.addEventListener(
        "animationend",
        function handler() {
          contentNav.classList.remove("out");
          contentNav.classList.add("collapse");
          contentNav.removeEventListener("animationend", handler);
        },
        { once: true }
      );
    }
  };

  document.addEventListener("click", function (e) {
    if (btnNav.getAttribute("aria-expanded") === "true") {
      closeMenu(e);
    }
  });

  // !Sticy Navigation and animation

  const nav = document.querySelector(".container-fluid");
  const navHeight = nav.getBoundingClientRect().height;

  const stickyNav = (entries) => {
    const [entry] = entries;

    if (entry.isIntersecting === false) {
      nav.classList.add("sticky");
      nav.style.zIndex = 9999;
      nav.classList.remove("slideOut");
    } else {
      nav.classList.add("slideOut");

      const handleAnimationEnd = (e) => {
        if (e.animationName === "slideOut") {
          nav.classList.remove("slideOut");
          nav.classList.remove("sticky");
          nav.style.zIndex = 0;
          nav.removeEventListener("animationend", handleAnimationEnd);
        }
      };

      nav.addEventListener("animationend", handleAnimationEnd);
    }
  };

  const observer = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `${-navHeight}px`,
  });

  observer.observe(document.querySelector(".header"));
}
