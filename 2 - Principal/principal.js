let todosOsLivros = [];
let currentIndex = 0;
const livrosPorPagina = 3;

function restaurarLayoutOriginal() {
    document.querySelector(".livros").classList.add("carrossel");
    document.querySelector(".livros").innerHTML = "";
    
    // Mostra o carrossel e o botão "Ver mais" novamente
    document.getElementById('container').style.display = 'flex';
    document.getElementById('botao-veja-mais').style.display = 'block';
    document.getElementById('secao-mais-livros').style.display = 'block';
    document.getElementById('secao-mais-livros').style.marginTop = '150px';
    
    renderizarCarrousel();
    renderizarListaInferior();
    
    // Reattach evento do botão "Ver mais"
    document.getElementById('botao-veja-mais').addEventListener('click', () => {
        console.log("Clicou no botão Ver mais");
        const secao = document.getElementById('secao-mais-livros');
        secao.scrollIntoView({ behavior: 'smooth' });
    });
}

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
            <a href="../4 - Livro I/livro.html?id=${l.livro_id}">
                    <img src="${l.capa_url}" alt="Capa do livro ${l.titulo}">
                </a>
                <h3>${l.titulo}</h3>
                <p>${l.autor}</p>
            </div>
        `;
    });
}

function renderizarListaInferior() {
    const container = document.querySelector(".mais-livros .container");
    container.innerHTML = "";

    if (todosOsLivros.length === 0) {
        container.innerHTML = `<p style='text-align: center; grid-column: 1/-1;'>Nenhum livro encontrado</p>`;
        return;
    }

    todosOsLivros.forEach(l => {
        container.innerHTML += `
            <div class="livro">
                <a href="../4 - Livro I/livro.html?id=${l.livro_id}">
                    <img src="${l.capa_url}" alt="Capa do livro ${l.titulo}">
                </a>
                <h3>${l.titulo}</h3>
                <p>${l.autor}</p>
            </div>
        `;
    });
}

function aplicarLayoutPesquisa() {
    // Esconde o carrossel e o botão "Ver mais"
    document.getElementById('container').style.display = 'none';
    document.getElementById('botao-veja-mais').style.display = 'none';
    // Mostra a seção "Todos os Livros"
    const secaoMaisLivros = document.getElementById('secao-mais-livros');
    secaoMaisLivros.style.display = 'block';
    secaoMaisLivros.style.marginTop = '0';
}

function pesquisarLivros(termo) {
    const pesquisa = termo.toLowerCase().trim();

    if (pesquisa === "") {
        currentIndex = 0;
        // Restaura carrossel
        document.getElementById('container').style.display = 'flex';
        document.getElementById('botao-veja-mais').style.display = 'block';
        document.getElementById('secao-mais-livros').style.display = 'none';
        restaurarLayoutOriginal();
        return;
    }

    const filtrados = todosOsLivros.filter(l =>
        l.titulo.toLowerCase().includes(pesquisa) ||
        l.autor.toLowerCase().includes(pesquisa)
    );

    aplicarLayoutPesquisa();

    const container = document.querySelector(".mais-livros .container");
    container.innerHTML = "";

    if (filtrados.length === 0) {
        container.innerHTML = `<p style='text-align: center; grid-column: 1/-1;'>Nenhum livro encontrado</p>`;
        return;
    }

    filtrados.forEach(l => {
        container.innerHTML += `
            <div class="livro">
                <a href="../4 - Livro I/livro.html?id=${l.livro_id}">
                    <img src="${l.capa_url}" alt="Capa do livro ${l.titulo}">
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
            console.log("Livros carregados:", todosOsLivros);

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
        })
        .catch(err => console.error("Erro ao buscar livros:", err));

    document.querySelector(".barra-pesquisa input")
        .addEventListener("input", e => pesquisarLivros(e.target.value));
    
    document.getElementById('botao-veja-mais').addEventListener('click', () => {
        console.log("Clicou no botão Ver mais");
        const secao = document.getElementById('secao-mais-livros');
        secao.scrollIntoView({ behavior: 'smooth' });
    });
}

document.addEventListener("DOMContentLoaded", inicializar);
