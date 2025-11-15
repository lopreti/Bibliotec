let todosOsLivros = [];

function renderizarLivros(livros) {
    const containerLivros  = document.querySelector(".livros");
    containerLivros.innerHTML = ""; 

    if (livros.length === 0) {
        containerLivros.innerHTML = "<p style='text-align: center; color: #000000ff; grid-column: 1/-1;'>Nenhum livro encontrado</p>";
        return;
    }

    livros.forEach(l => {
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

function pesquisarLivros(pesquisa) {
    const pesquisaBusca = pesquisa.toLowerCase().trim();
    
    if (pesquisaBusca === "") {
        renderizarLivros(todosOsLivros);
        return;
    }
    
    const livrosFiltrados = todosOsLivros.filter(livro => {
        const titulo = livro.titulo.toLowerCase();
        const autor = livro.autor.toLowerCase();
        
        return titulo.includes(pesquisaBusca) || autor.includes(pesquisaBusca);
    });
    
    renderizarLivros(livrosFiltrados);
}

function inicializar() {
    fetch("http://localhost:3000/livros")
        .then(res => res.json())
        .then(livros => {
            todosOsLivros = livros;
            renderizarLivros(livros);
        })
        .catch(error => console.error('Erro ao buscar os livros:', error));

    const barraPesquisa = document.querySelector(".barra-pesquisa input");

    barraPesquisa.addEventListener("input", (e) => {
        pesquisarLivros(e.target.value);
    });
}

document.addEventListener("DOMContentLoaded", inicializar);