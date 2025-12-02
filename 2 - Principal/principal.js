let todosOsLivros = [];
let currentIndex = 0;
const livrosPorPagina = 3;

// --------------------------
// FUNÇÃO: Restabelecer layout original
// --------------------------
function restaurarLayoutOriginal() {
    document.querySelector(".livros").classList.add("carrossel");
    document.querySelector(".livros").innerHTML = "";
    document.querySelector(".mais-livros .container").innerHTML = "";
    renderizarCarrousel();
    renderizarListaInferior();
}

// --------------------------
// FUNÇÃO PRINCIPAL DO CARROSSEL
// --------------------------
function renderizarCarrousel() {
    const containerLivros = document.querySelector(".livros");
    containerLivros.classList.add('carrossel');
    containerLivros.innerHTML = "";

    if (todosOsLivros.length === 0) {
        containerLivros.innerHTML = `<p style='text-align: center;'>Nenhum livro encontrado</p>`;
        return;
    }

    let livrosParaMostrar = [];
    for (let i = 0; i < livrosPorPagina; i++) {
        const index = (currentIndex + i) % todosOsLivros.length;
        livrosParaMostrar.push(todosOsLivros[index]);
    }

    livrosParaMostrar.forEach((l, posicao) => {
        const classeDestaque = posicao === 1 ? 'destaque' : '';

        containerLivros.innerHTML += `
            <div class="livro ${classeDestaque}">
<<<<<<< HEAD:2 - Principal/principal.js
            <a href="../4 - Livro I/livro.html?id=${l.id || l.livro_id}">
                    <img src="${l.capa_url}" alt="Capa do livro ${l.titulo}">
                </a>
                <h3>${l.titulo}</h3>
                <p>${l.autor}</p>
            </div>
        `;
    });
}

// --------------------------
// LISTA INFERIOR (MOSTRAR TODOS OS LIVROS EXCETO OS 3 DO CARROSSEL)
// --------------------------
function renderizarListaInferior() {
    const container = document.querySelector(".mais-livros .container");
    container.innerHTML = "";

    if (todosOsLivros.length <= livrosPorPagina) return;

    const livrosInferiores = todosOsLivros.slice(livrosPorPagina);

    livrosInferiores.forEach(l => {
        container.innerHTML += `
            <div class="livro">
                <a href="..//4 - Livro I/livro.html?id=${l.id}">
                    <img src="${l.capa_url}" alt="Capa do livro ${l.titulo}">
=======
                <a href="..//4 - Livro I/index.html?id=${l.ID}">
                    <img src="${urlCapa}" alt="Capa do livro ${l.titulo}">
>>>>>>> origin/lavíz:2 - Principal/app.js
                </a>
                <h3>${l.titulo}</h3>
                <p>${l.autor}</p>
            </div>
        `;
    });
}

// --------------------------
// REMOVER LAYOUT DE CARROSSEL (para pesquisa)
// --------------------------
function aplicarLayoutPesquisa() {
    document.querySelector(".livros").classList.remove("carrossel");
    document.querySelector(".livros").innerHTML = "";
    document.querySelector(".mais-livros .container").innerHTML = "";
}

// --------------------------
// PESQUISA
// --------------------------
function pesquisarLivros(termo) {
    const pesquisa = termo.toLowerCase().trim();

    if (pesquisa === "") {
        currentIndex = 0;
        restaurarLayoutOriginal();
        return;
    }

    const filtrados = todosOsLivros.filter(l =>
        l.titulo.toLowerCase().includes(pesquisa) ||
        l.autor.toLowerCase().includes(pesquisa)
    );

    aplicarLayoutPesquisa();

    const container = document.querySelector(".livros");

    if (filtrados.length === 0) {
        container.innerHTML = `<p style='text-align: center;'>Nenhum livro encontrado</p>`;
        return;
    }

    filtrados.forEach(l => {
        container.innerHTML += `
            <div class="livro">
<<<<<<< HEAD:2 - Principal/principal.js
                <a href="..//4 - Livro I/livro.html?id=${l.id}">
                    <img src="${l.capa_url}" alt="Capa do livro ${l.titulo}">
=======
                <a href="..//4 - Livro I/index.html?id=${l.ID}">
                    <img src="${urlCapa}" alt="Capa do livro ${l.titulo}">
>>>>>>> origin/lavíz:2 - Principal/app.js
                </a>
                <h3>${l.titulo}</h3>
                <p>${l.autor}</p>
            </div>
        `;
    });
}

// --------------------------
// INICIALIZAR
// --------------------------
function inicializar() {
    fetch("http://localhost:3000/livros")
        .then(res => res.json())
        .then(livros => {
            todosOsLivros = livros;

            renderizarCarrousel();
            renderizarListaInferior();

            document.getElementById('next-btn').addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % todosOsLivros.length;
                renderizarCarrousel();
            });

            document.getElementById('prev-btn').addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + todosOsLivros.length) % todosOsLivros.length;
                renderizarCarrousel();
            });
        });

    document.querySelector(".barra-pesquisa input")
        .addEventListener("input", e => pesquisarLivros(e.target.value));
}

document.addEventListener("DOMContentLoaded", inicializar);
