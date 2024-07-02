window.onload = function () {
  // Pega os parâmetros de consulta da URL
  const urlParams = new URLSearchParams(window.location.search);

  /*
  // Altera a lista de tags
  const tags = urlParams.get("tags");

  if (tags) {
    const tagArray = JSON.parse(tags);
    const tagContainer = document.querySelector("div.tags");
    tagContainer.innerHTML = ""; // Limpa as tags existentes
    tagArray.forEach((tag) => {
      const newTag = document.createElement("h2");
      newTag.className = `${language}-color`;
      newTag.innerHTML = `<span>•</span> ${tag} <span>•</span>`;
      tagContainer.appendChild(newTag);
    });
  }
  */

  // Altera o título da página
  const title = urlParams.get("title");

  if (title) {
    document.querySelector("#title").textContent = title;
  }

  // Pega o id dos parâmetros da URL
  const id = urlParams.get("id");
  const bgImageElement = document.querySelector(".bg-image");
  const gradientElement = document.querySelector("#bg-gradient");

  if (id) {
    const bgUrl = `/results/${id}/cover_background.jpg`;

    bgImageElement.style.backgroundImage = `url('${bgUrl}')`;
    bgImageElement.classList.add(`bg-[url('${bgUrl}')]`);
  } else {
    gradientElement.remove();

    bgImageElement.classList.add(`bg-[#e5e7eb]`);
  }
};
