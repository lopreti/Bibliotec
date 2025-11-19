
function pesquisarLivros(pesquisa) {
    const pesquisaBusca = pesquisa.toLowerCase().trim();

    if (pesquisaBusca === "") {
        currentIndex = 0;
        renderizarCarrousel();
        return;
    }

    const livrosFiltrados = todosOsLivros.filter(livro => {
        const titulo = livro.titulo.toLowerCase();
        const autor = livro.autor.toLowerCase();

        return titulo.includes(pesquisaBusca) || autor.includes(pesquisaBusca);
    });

    const containerLivros = document.querySelector(".livros");
    containerLivros.classList.remove('carrossel');
    containerLivros.innerHTML = "";

    if (livrosFiltrados.length === 0) {
        containerLivros.innerHTML = "<p style='text-align: center; color: #000000ff; grid-column: 1/-1;'>Nenhum livro encontrado</p>";
        return;
    }

    livrosFiltrados.forEach((l, posicao) => {
        const urlCapa = l.capa_url;

        containerLivros.innerHTML += `
            <div class="livro">
                <a href="..//4 - Livro I/index.html?id=${l.ID}">
                    <img src="${urlCapa}" alt="Capa do livro ${l.titulo}">
                </a>
                <h3>${l.titulo}</h3>
                <p>${l.autor}</p>
            </div>
        `;
    });
}