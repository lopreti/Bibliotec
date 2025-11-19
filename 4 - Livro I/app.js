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
                document.querySelector("h1").textContent = livro.titulo;
                document.querySelector(".descricao p:nth-of-type(1)").textContent = livro.autor;
                document.querySelector(".descricao p:nth-of-type(2)").textContent = livro.descricao;
                document.querySelector(".livro img").src = livro.capa_url;
                document.querySelector(".descricao h3").textContent = livro.titulo;
                document.querySelector(".informacoes p:nth-of-type(1) span").textContent = livro.quant_paginas;
                document.querySelector(".informacoes p:nth-of-type(2) span").textContent = livro.idioma;
                
                verificarFavorito(livro.livro_id);
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
        btnFavoritar.innerHTML = '❤️ Favoritado';
        btnFavoritar.style.backgroundColor = '#ff4d4d';
        btnFavoritar.style.color = 'white';
        btnFavoritar.onclick = () => removerFavorito(livroId);
    } else {
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
        alert(data.message);
        btnFavoritar.disabled = false;
        verificarFavorito(livroId);
    })
    .catch(err => {
        console.error("Erro ao adicionar favorito:", err);
        alert('Erro ao adicionar aos favoritos');
        btnFavoritar.disabled = false;
        btnFavoritar.innerHTML = '🤍 Favoritar';
    });
}

function removerFavorito(livroId) {
    if (confirm('Deseja remover este livro dos favoritos?')) {
        const btnFavoritar = document.querySelector('.favoritar button');
        btnFavoritar.disabled = true;
        btnFavoritar.innerHTML = 'Removendo...';
        
        fetch(`http://localhost:3000/favoritos/${userId}/${livroId}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            btnFavoritar.disabled = false;
            // Atualizar o botão para o estado não favoritado
            atualizarBotaoFavorito(false, livroId);
        })
        .catch(err => {
            console.error("Erro ao remover favorito:", err);
            alert('Erro ao remover dos favoritos');
            btnFavoritar.disabled = false;
            // Volta ao estado favoritado em caso de erro
            atualizarBotaoFavorito(true, livroId);
        });
    }
}