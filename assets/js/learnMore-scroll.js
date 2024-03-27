export default function initLearnMoreScroll() {
  const btnScrollTo = document.querySelector(".btn--scroll-to");
  const section1 = document.querySelector("#feature");

  btnScrollTo.addEventListener("click", function (e) {
    e.preventDefault();

    const featureCoords = section1.getBoundingClientRect();
    const toScroll = featureCoords.y;

    // window.scrollTo({ behavior: "smooth" }, toScroll);
    section1.scrollIntoView({ behavior: "smooth" });
  });
}
