const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const userId = 1;

// =========================
//  CARREGAR DADOS DO LIVRO
// =========================

console.log("ID da URL:", id);

if (id) {
    fetch(`http://localhost:3000/livros/${id}`)
        .then(res => res.json())
        .then(livro => {
            console.log("Livro recebido:", livro);
            if (livro.message) {
                document.body.innerHTML = `<h2>${livro.message}</h2>`;
            } else {

                const livroId = livro.ID || livro.id || livro.livro_id;
                console.log("Preenchendo dados do livro:", livroId);

                document.querySelector("#titulo-livro").textContent = livro.titulo;
                document.querySelector("#autor-livro").textContent = livro.autor;
                document.querySelector("#descricao-livro").textContent = livro.descricao;
                document.querySelector("#capa-livro").src = livro.capa_url;
                document.querySelector("#nome-livro").textContent = livro.titulo;
                document.querySelector(".informacoes p:nth-of-type(1) span").textContent = livro.quant_paginas || "N/A";
                document.querySelector(".informacoes p:nth-of-type(2) span").textContent = livro.idioma || "Português";

                verificarFavorito(livroId);
                verificarReservado(livroId);
            }
        })
        .catch(err => console.error("Erro ao buscar livro:", err));
} else {
    console.log("Nenhum ID foi passado na URL");
    document.body.innerHTML = "<h2>ID do livro não informado.</h2>";
}



// =========================
//  FAVORITOS
// =========================

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario_id: userId,
            livro_id: livroId
        })
    })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                title: data.message,
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            btnFavoritar.disabled = false;
            verificarFavorito(livroId);
        })
        .catch(err => {
            console.error("Erro ao adicionar favorito:", err);
            Swal.fire({
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
        if (!result.isConfirmed) return;

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
    });
}



// =========================
//  RESERVADOS
// =========================

function verificarReservado(livroId) {
    fetch(`http://localhost:3000/reservados/${userId}`)
        .then(res => res.json())
        .then(reservados => {
            const jaReservado = reservados.some(r => r.livro_id == livroId);
            atualizarReservados(jaReservado, livroId);
        })
        .catch(err => {
            console.error("Erro ao verificar reservado:", err);
            atualizarReservados(false, livroId);
        });
}

function atualizarReservados(jaReservado, livroId) {
    const btnReservar = document.querySelector('.reservar button');

    if (jaReservado) {
        btnReservar.innerHTML = '📖 Reservado';
        btnReservar.style.backgroundColor = '#3651c9';
        btnReservar.style.color = 'white';
        btnReservar.onclick = () => removerReserva(livroId);
    } else {
        btnReservar.innerHTML = '📖 Reservar';
        btnReservar.style.backgroundColor = '';
        btnReservar.style.color = '';
        btnReservar.onclick = () => adicionarReservado(livroId);
    }
}

function adicionarReservado(livroId) {
    const btnReservar = document.querySelector('.reservar button');
    btnReservar.disabled = true;
    btnReservar.innerHTML = 'Adicionando...';

    fetch('http://localhost:3000/reservados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario_id: userId,
            livro_id: livroId
        })
    })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                title: data.message,
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            btnReservar.disabled = false;
            verificarReservado(livroId);
        })
        .catch(err => {
            console.error("Erro ao adicionar reservado:", err);
            Swal.fire({
                icon: "warning",
                title: "Erro ao adicionar aos reservados",
                showConfirmButton: false,
                timer: 1500
            });
            btnReservar.disabled = false;
            atualizarReservados(false, livroId);
        });
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

        const btnReservar = document.querySelector('.reservar button');
        btnReservar.disabled = true;
        btnReservar.innerHTML = 'Removendo...';

        fetch(`http://localhost:3000/reservados/${userId}/${livroId}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {

                Swal.fire({
                    title: data.message || "Removido dos reservados!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                btnReservar.disabled = false;
                btnReservar.innerHTML = 'Reservar';

                atualizarReservados(false, livroId);
            })
            .catch(err => {
                console.error("Erro ao remover reservado:", err);

                Swal.fire({
                    title: "Erro ao remover dos reservados",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false
                });

                btnReservar.disabled = false;
                atualizarReservados(true, livroId);
            });
    });
}
