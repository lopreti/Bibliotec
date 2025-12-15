let todosOsLivrosReservados = [];

const userId = localStorage.getItem('usuarioId');

if (!userId) {
    document.getElementById('container-reservados').innerHTML =
        '<p class="mensagem-vazio">Você precisa estar logado para ver seus reservados.</p>';
} else {
    window.addEventListener('load', () => {
        carregarReservados();
    });
}

function carregarReservados() {
    fetch(`http://localhost:3000/reservados/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Reservados carregados:', data); // Debug
            todosOsLivrosReservados = data;
            renderizarReservados(data);

            const restore = sessionStorage.getItem('restoreScroll');
            if (restore) {
                try {
                    window.scrollTo({ top: parseInt(restore, 10), behavior: 'instant' });
                } catch (e) {}
                sessionStorage.removeItem('restoreScroll');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar reservados:', error);
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
                <a href="../4 - Livro I/livro.html?id=${livro.livro_id}&from=reservados">
                    <img src="${livro.capa_url}" alt="Capa do livro ${livro.titulo}">
                </a>
                <h3>${livro.titulo}</h3>
                <p>${livro.autor}</p>
            </div>
        `;
    });

    document.querySelectorAll('#container-reservados a').forEach(a => {
        a.addEventListener('click', () => {
            sessionStorage.setItem(
                'returnContext',
                JSON.stringify({ from: 'reservados', scrollY: window.scrollY })
            );
        });
    });
}

function pesquisarLivros(pesquisa) {
    const pesquisaBusca = pesquisa.toLowerCase().trim();

    if (pesquisaBusca === "") {
        renderizarReservados(todosOsLivrosReservados);
        return;
    }

    const livrosFiltrados = todosOsLivrosReservados.filter(livro => {
        return (
            livro.titulo.toLowerCase().includes(pesquisaBusca) ||
            livro.autor.toLowerCase().includes(pesquisaBusca)
        );
    });

    if (livrosFiltrados.length === 0) {
        document.getElementById('container-reservados').innerHTML =
            '<p class="mensagem-vazio">Nenhum livro encontrado</p>';
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

                todosOsLivrosReservados = todosOsLivrosReservados.filter(
                    livro => livro.livro_id !== livroId
                );

                renderizarReservados(todosOsLivrosReservados);

                Swal.fire({
                    title: "Removido dos reservados!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            })
            .catch(error => {
                console.error('Erro ao remover reserva:', error);
                Swal.fire({
                    title: "Erro ao remover reserva",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false
                });
            });
    });
}
