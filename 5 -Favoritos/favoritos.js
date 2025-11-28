let todosOsLivrosFavoritos = [];

const userId = 1;

window.addEventListener('load', () => {
    carregarFavoritos();
});

function carregarFavoritos() {
    fetch(`http://localhost:3000/favoritos/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Favoritos carregados:', data); // Debug
            todosOsLivrosFavoritos = data;
            renderizarFavoritos(data);
        })
        .catch(error => {
            console.error('Erro ao carregar favoritos:', error);
            document.getElementById('container-favoritos').innerHTML =
                '<p class="mensagem-vazio">Erro ao carregar favoritos. Verifique se o servidor está rodando.</p>';
        });
}

function renderizarFavoritos(livros) {
    const container = document.getElementById('container-favoritos');

    if (!livros || livros.length === 0) {
        container.innerHTML = '<p class="mensagem-vazio">Você ainda não tem livros favoritos</p>';
        return;
    }

    container.innerHTML = '';

    livros.forEach(livro => {
        container.innerHTML += `
            <div class="livro" id="livro-${livro.livro_id}">
                <button class="btn-remover" onclick="removerFavorito(${livro.livro_id})" title="Remover dos favoritos">
                    ❤️
                </button>
                <a href="..//4 - Livro I/livro.html?id=${livro.livro_id}">
                    <img src="${livro.capa_url}" alt="Capa do livro ${livro.titulo}">
                </a>
                <h3>${livro.titulo}</h3>
                <p>${livro.autor}</p>
            </div>
        `;
    });
}

function pesquisarLivros(pesquisa) {
    const pesquisaBusca = pesquisa.toLowerCase().trim();

    if (pesquisaBusca === "") {
        renderizarFavoritos(todosOsLivrosFavoritos);
        return;
    }

    const livrosFiltrados = todosOsLivrosFavoritos.filter(livro => {
        const titulo = livro.titulo.toLowerCase();
        const autor = livro.autor.toLowerCase();
        return titulo.includes(pesquisaBusca) || autor.includes(pesquisaBusca);
    });

    const container = document.getElementById('container-favoritos');

    if (livrosFiltrados.length === 0) {
        container.innerHTML = '<p class="mensagem-vazio">Nenhum livro encontrado</p>';
        return;
    }

    renderizarFavoritos(livrosFiltrados);
}
function removerFavorito(livroId) {
    Swal.fire({
        title: "Deseja remover este livro dos favoritos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, remover",
        cancelButtonText: "Não",
    }).then((result) => {
        if (!result.isConfirmed) return;

        fetch(`http://localhost:3000/favoritos/${userId}/${livroId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);

                // REMOVE DO ARRAY LOCAL
                todosOsLivrosFavoritos = todosOsLivrosFavoritos.filter(
                    fav => fav.livro_id !== livroId
                );

                // ATUALIZA A LISTA NA TELA
                renderizarFavoritos(todosOsLivrosFavoritos);

                Swal.fire({
                    title: "Removido dos favoritos!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            })
            .catch(error => {
                console.error('Erro ao remover favorito:', error);
                
                Swal.fire({
                    title: "Erro ao remover favorito",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false
                });
            });
    });
}
