export default function initMenuFadeAnimation() {
  // !Need to fix the problem of hit the function many many times. (Maybe debounce can fix that!)

  const nav = document.querySelector("nav");

  const fadeOutAnimation = function (e) {
    if (e.target.classList.contains("nav__link")) {
      const link = e.target;
      const siblings = link.closest("nav").querySelectorAll(".nav__link");
      const logo = link.closest("nav").querySelector("img");

      siblings.forEach((el) => {
        if (el !== link) {
          el.style.opacity = this;
        }
        logo.style.opacity = this;
      });
    }
  };

  nav.addEventListener("mouseover", fadeOutAnimation.bind(0.5));
  nav.addEventListener("mouseout", fadeOutAnimation.bind(1));
}
