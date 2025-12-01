const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const userId = 1;

if (id) {
    fetch(`http://localhost:3000/livros/${id}`)
        .then(res => res.json())
        .then(livro => {
            if (livro.message) {
                document.body.innerHTML = `<h2>${livro.message}</h2>`;
            } else {

                const livroId = livro.ID || livro.id || livro.livro_id;

                document.querySelector("#titulo-livro").textContent = livro.titulo;
                document.querySelector("#autor-livro").textContent = livro.autor;
                document.querySelector("#descricao-livro").textContent = livro.descricao;
                document.querySelector("#capa-livro").src = livro.capa_url;
                document.querySelector("#nome-livro").textContent = livro.titulo;
                document.querySelector(".informacoes p:nth-of-type(1) span").textContent = livro.paginas || "N/A";
                document.querySelector(".informacoes p:nth-of-type(2) span").textContent = livro.idioma || "Português";

                verificarFavorito(livroId);
            }
        })
        .catch(err => console.error("Erro ao buscar livro:", err));
} else {
    document.body.innerHTML = "<h2>ID do livro não informado.</h2>";
}

function verificarFavorito(livroId) {
    fetch(`http://localhost:3000/favoritos/${userId}`)
        .then(res => res.json())
        .then(favoritos => {
            const jaFavoritado = favoritos.some(f => f.livro_id == livroId);
            atualizarBotaoFavorito(jaFavoritado, livroId);
        })
        .catch(err => {
            console.error("Erro ao verificar favorito:", err);
            atualizarBotaoFavorito(false, livroId);
        });
}

function atualizarBotaoFavorito(jaFavoritado, livroId) {
    const btnFavoritar = document.querySelector('.favoritar button');

    if (jaFavoritado) {
        btnFavoritar.innerHTML = '🤍 Favoritado';
        btnFavoritar.style.backgroundColor = '#ff4d4d';
        btnFavoritar.style.color = 'white';
        btnFavoritar.onclick = () => removerFavorito(livroId);
    } else {
        btnFavoritar.innerHTML = '❤️ Favoritar';
        btnFavoritar.style.backgroundColor = '';
        btnFavoritar.style.color = '';
        btnFavoritar.onclick = () => adicionarFavorito(livroId);
    }
}

function adicionarFavorito(livroId) {
    const btnFavoritar = document.querySelector('.favoritar button');
    btnFavoritar.disabled = true;
    btnFavoritar.innerHTML = 'Adicionando...';

    fetch('http://localhost:3000/favoritos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario_id: userId,
            livro_id: livroId
        })
    })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                title: (data.message),
                icon: "success",
                draggable: true,
                showConfirmButton: false,
                timer: 1500
            });
            btnFavoritar.disabled = false;
            verificarFavorito(livroId);
        })
        .catch(err => {
            console.error("Erro ao adicionar favorito:", err);
            Swal.fire({
                position: "top-end",
                icon: "warning",
                title: "Erro ao adicionar aos favoritos",
                showConfirmButton: false,
                timer: 1500
            });
            btnFavoritar.disabled = false;
            atualizarBotaoFavorito(false, livroId);
        });
}

function removerFavorito(livroId) {
    Swal.fire({
        title: "Deseja remover este livro dos favoritos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, remover",
        cancelButtonText: "Não",
    }).then((result) => {
        if (result.isConfirmed) {

            const btnFavoritar = document.querySelector('.favoritar button');
            btnFavoritar.disabled = true;
            btnFavoritar.innerHTML = 'Removendo...';

            fetch(`http://localhost:3000/favoritos/${userId}/${livroId}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {

                    Swal.fire({
                        title: data.message || "Removido dos favoritos!",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });

                    btnFavoritar.disabled = false;
                    btnFavoritar.innerHTML = 'Favoritar';

                    atualizarBotaoFavorito(false, livroId);
                })
                .catch(err => {
                    console.error("Erro ao remover favorito:", err);

                    Swal.fire({
                        title: "Erro ao remover dos favoritos",
                        icon: "error",
                        timer: 1500,
                        showConfirmButton: false
                    });

                    btnFavoritar.disabled = false;
                    atualizarBotaoFavorito(true, livroId);
                });
        }
    });
}

