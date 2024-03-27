export default function initLazyLoading() {
  const imgTargets = document.querySelectorAll("img[data-src]");

  const loadImg = (entries, observer) => {
    const [entry] = entries;
    const img = entry.target;

    if (entry.isIntersecting === true) {
      const attributeLazy = img.getAttribute("src");
      const removeLazy = attributeLazy.replace("-lazy", "");

      img.setAttribute("src", removeLazy);

      img.addEventListener("load", function () {
        img.classList.remove("lazy-img");
        imgObserver.unobserve(img);
      });
    }
  };

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: "200px",
  });

  imgTargets.forEach((img) => {
    imgObserver.observe(img);
  });
}
