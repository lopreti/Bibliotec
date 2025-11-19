const params = new URLSearchParams(window.location.search);
const id = params.get('id');

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
            }
        })
        .catch(err => console.error("Erro ao buscar livro:", err));
} else {
    document.body.innerHTML = "<h2>ID do livro não informado.</h2>";
}