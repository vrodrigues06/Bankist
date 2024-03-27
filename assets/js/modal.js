export default function initModal() {
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const btnCloseModal = document.querySelector(".btn--close-modal");
  const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
  const inputText = document.getElementById("toFocus");
  const modalElArrays = [btnCloseModal, overlay, ...btnsOpenModal];

  const toggleModal = (e) => {
    e.preventDefault();
    modal.classList.toggle("hidden");
    overlay.classList.toggle("hidden");

    if (!modal.classList.contains("hidden")) {
      setTimeout(() => {
        if (inputText) inputText.focus();
      }, 700);
    }
  };

  modalElArrays.forEach((el) => {
    if (el) el.addEventListener("click", toggleModal);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      toggleModal(e);
    }
  });
}
