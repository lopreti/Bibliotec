let todosOsLivrosReservados = [];

const userId = 1;

window.addEventListener('load', () => {
    carregarReservados();
});

function carregarReservados() {
    fetch(`http://localhost:3000/reservados/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Favoritos carregados:', data); // Debug
            todosOsLivrosReservados = data;
            renderizarReservados(data);
        })
        .catch(error => {
            console.error('Erro ao carregar favoritos:', error);
            document.getElementById('container-reservados').innerHTML =
                '<p class="mensagem-vazio">Erro ao carregar reservados. Verifique se o servidor está rodando.</p>';
        });
}

function renderizarReservados(livros) {
    const container = document.getElementById('container-reservados');

    if (!livros || livros.length === 0) {
        container.innerHTML = '<p class="mensagem-vazio">Você ainda não tem livros reservados</p>';
        return;
    }

    container.innerHTML = '';

    livros.forEach(livro => {
        container.innerHTML += `
            <div class="livro" id="livro-${livro.livro_id}">
                <button class="btn-remover" onclick="removerReserva(${livro.livro_id})" title="Remover dos Reservados">
                    📖
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
        renderizarReservados(todosOsLivrosReservados);
        return;
    }

    const livrosFiltrados = todosOsLivrosReservados.filter(livro => {
        const titulo = livro.titulo.toLowerCase();
        const autor = livro.autor.toLowerCase();
        return titulo.includes(pesquisaBusca) || autor.includes(pesquisaBusca);
    });

    const container = document.getElementById('container-reservados');

    if (livrosFiltrados.length === 0) {
        container.innerHTML = '<p class="mensagem-vazio">Nenhum livro encontrado</p>';
        return;
    }

    renderizarReservados(livrosFiltrados);
}
function removerReserva(livroId) {
    Swal.fire({
        title: "Deseja remover este livro dos reservados?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, remover",
        cancelButtonText: "Não",
    }).then((result) => {
        if (!result.isConfirmed) return;

        fetch(`http://localhost:3000/reservados/${userId}/${livroId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);

                // REMOVE DO ARRAY LOCAL
                todosOsLivrosReservados = todosOsLivrosReservados.filter(
                    fav => fav.livro_id !== livroId
                );

                // ATUALIZA A LISTA NA TELA
                renderizarReservados(todosOsLivrosReservados);

                Swal.fire({
                    title: "Removido dos reservados!",
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
