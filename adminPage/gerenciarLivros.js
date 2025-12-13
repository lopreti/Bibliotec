async function carregarLivros() {
    const container = document.getElementById('livros-container');
    container.innerHTML = '<div class="loading">Carregando livros...</div>';
    
    try {
        const response = await fetch('http://localhost:3000/livros');
        
        if (!response.ok) throw new Error('Erro ao carregar livros');
        
        // Atualiza a variável global que é usada para filtros
        todosLivros = await response.json(); 
        mostrarLivros(todosLivros);
        
    } catch (erro) {
        console.error('Erro:', erro);
        container.innerHTML = '<div class="error">Erro ao carregar livros.</div>';
    }
}

function mostrarLivros(livros) {
    const container = document.getElementById('livros-container');
    
    if (livros.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhum livro encontrado.</p></div>';
        return;
    }
    
    container.innerHTML = '';
    
    livros.forEach(livro => {
        const div = document.createElement('div');
        div.className = 'livro-item';
        div.innerHTML = `
          <div class="livro-info">
            <strong>${livro.titulo}</strong>
            <span>Autor: ${livro.autor}</span>
            <span>Ano: ${livro.publicado_ano || 'N/A'} | Páginas: ${livro.quant_paginas || 'N/A'}</span>
          </div>
          <div class="livro-acoes">
            <button onclick="verDetalhesLivro(${livro.livro_id})" class="btn-detalhes">Ver Detalhes</button>
            <button onclick="editarLivro(${livro.livro_id})" class="btn-editar-item">Editar</button>
            <button onclick="excluirLivro(${livro.livro_id})" class="btn-deletar">Excluir</button>
          </div>
        `;
        container.appendChild(div);
    });
}

// RF02 - Cadastrar livro
function abrirModalCadastrarLivro() {
    document.getElementById('modal-titulo').textContent = 'Cadastrar Novo Livro';
    document.getElementById('form-livro').reset();
    document.getElementById('livro-id').value = '';
    document.getElementById('modal-livro').style.display = 'block';
}

// RF03 - Editar livro
async function editarLivro(livroId) {
    try {
        const response = await fetch(`http://localhost:3000/livros/${livroId}`);
        
        if (!response.ok) throw new Error('Erro');
        
        const livro = await response.json();
        
        document.getElementById('modal-titulo').textContent = 'Editar Livro';
        document.getElementById('livro-id').value = livro.livro_id;
        document.getElementById('livro-titulo').value = livro.titulo;
        document.getElementById('livro-autor').value = livro.autor;
        document.getElementById('livro-ano').value = livro.publicado_ano || '';
        document.getElementById('livro-categoria').value = livro.categorias || '';
        document.getElementById('livro-quantidade').value = livro.quant_paginas || '';
        document.getElementById('livro-idioma').value = livro.idioma || ''; 
        document.getElementById('livro-descricao').value = livro.descricao || '';
        document.getElementById('livro-capa-url').value = livro.capa_url || ''; 
        
        document.getElementById('modal-livro').style.display = 'block';
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao carregar dados do livro.');
    }
}

// RF02/RF03 - Salvar livro (POST/PUT)
async function salvarLivro(event) {
    event.preventDefault();

    const livroId = document.getElementById('livro-id').value;

    const dados = {
        titulo: document.getElementById('livro-titulo').value,
        autor: document.getElementById('livro-autor').value,
        descricao: document.getElementById('livro-descricao').value,
        publicado_ano: document.getElementById('livro-ano').value,
        quant_paginas: document.getElementById('livro-quantidade').value,
        idioma: document.getElementById('livro-idioma').value
    };

    try {
        const url = livroId
            ? `http://localhost:3000/livros/${livroId}`
            : 'http://localhost:3000/livros';

        const method = livroId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) throw new Error('Erro');

        alert(livroId ? 'Livro atualizado!' : 'Livro cadastrado!');
        fecharModalLivro();
        carregarLivros();

    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao salvar livro.');
    }
}


function fecharModalLivro() {
    document.getElementById('modal-livro').style.display = 'none';
}

// RF08 - Ver detalhes do livro
async function verDetalhesLivro(livroId) {
    try {
        const response = await fetch(`http://localhost:3000/livros/${livroId}`);
        
        if (!response.ok) throw new Error('Erro');
        
        const livro = await response.json();
        
        const detalhesHTML = `
          <p><strong>Capa:</strong> <img src="${livro.capa_url}" alt="Capa do Livro" style="max-width: 100px; display: block; margin: 5px 0;"></p>
          <p><strong>Título:</strong> ${livro.titulo}</p>
          <p><strong>Autor:</strong> ${livro.autor}</p>
          <p><strong>Ano:</strong> ${livro.publicado_ano || 'Não informado'}</p>
          <p><strong>Páginas:</strong> ${livro.quant_paginas || 'Não informado'}</p>
          <p><strong>Idioma:</strong> ${livro.idioma || 'Não informado'}</p>
          <p><strong>Categorias:</strong> ${livro.categorias || 'Sem categoria'}</p>
          <p><strong>Descrição:</strong> ${livro.descricao || 'Sem descrição'}</p>
        `;
        
        document.getElementById('detalhes-livro-content').innerHTML = detalhesHTML;
        document.getElementById('modal-detalhes-livro').style.display = 'block';
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao carregar detalhes.');
    }
}

function fecharModalDetalhes() {
    document.getElementById('modal-detalhes-livro').style.display = 'none';
}

// RF12 - Excluir livro
async function excluirLivro(livroId) {
    if (!confirm('ATENÇÃO: Excluir este livro permanentemente?')) return;
    
    try {
        const response = await fetch(`http://localhost:3000/livros/${livroId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erro');
        
        alert('Livro excluído!');
        carregarLivros();
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao excluir livro.');
    }
}

// RF11 - Filtrar livros
function filtrarLivros() {
    const busca = document.getElementById('busca-livro').value.toLowerCase();
    const statusFiltro = document.getElementById('filtro-status').value;
    
    let livrosFiltrados = todosLivros; // Usa a variável global

    if (busca) {
        livrosFiltrados = livrosFiltrados.filter(l => 
          l.titulo.toLowerCase().includes(busca) ||
          l.autor.toLowerCase().includes(busca)
        );
    }

    // A lógica de filtragem por status ('ativos', 'inativos', 'todos')
    // depende de como seu backend define o status de disponibilidade do livro.
    // Como essa informação não está clara nos dados (todosLivros), 
    // a filtragem por status foi omitida. Se o backend fornecer, a lógica deve ser implementada aqui.
    
    mostrarLivros(livrosFiltrados);
}

// Inicia o carregamento de livros ao carregar a página
document.addEventListener('DOMContentLoaded', carregarLivros);