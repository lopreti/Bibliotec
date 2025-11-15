let todosOsLivros = [];
let currentIndex = 0;
const livrosPorPagina = 3;

function renderizarCarrousel() {
    const containerLivros = document.querySelector(".livros");
    // Marca o container como carrossel para aplicar estilos de destaque
    containerLivros.classList.add('carrossel');
    containerLivros.innerHTML = "";

    if (todosOsLivros.length === 0) {
        containerLivros.innerHTML = "<p style='text-align: center; color: #000000ff; grid-column: 1/-1;'>Nenhum livro encontrado</p>";
        return;
    }

    let livrosParaMostrar = [];
    for (let i = 0; i < livrosPorPagina; i++) {
        const index = (currentIndex + i) % todosOsLivros.length;
        livrosParaMostrar.push(todosOsLivros[index]);
    }

    livrosParaMostrar.forEach((l, posicao) => {
        const urlCapa = l.capa_url;
        const classeDestaque = posicao === 1 ? 'destaque' : '';

        containerLivros.innerHTML += `
            <div class="livro ${classeDestaque}">
                <a href="..//4 - Livro I/index.html?id=${l.ID}">
                    <img src="${urlCapa}" alt="Capa do livro ${l.titulo}">
                </a>
                <h3>${l.titulo}</h3>
                <p>${l.autor}</p>
            </div>
        `;
    });
}

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

function inicializar() {
    fetch("http://localhost:3000/livros")
        .then(res => res.json())
        .then(livros => {
            todosOsLivros = livros;
            renderizarCarrousel();

            const nextBtn = document.getElementById('next-btn');
            const prevBtn = document.getElementById('prev-btn');

            nextBtn.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % todosOsLivros.length;
                renderizarCarrousel();
            });

            prevBtn.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + todosOsLivros.length) % todosOsLivros.length;
                renderizarCarrousel();
            });
        })
        .catch(error => console.error('Erro ao buscar os livros:', error));

    const barraPesquisa = document.querySelector(".barra-pesquisa input");
    barraPesquisa.addEventListener("input", (e) => {
        pesquisarLivros(e.target.value);
    });
}

document.addEventListener("DOMContentLoaded", inicializar);