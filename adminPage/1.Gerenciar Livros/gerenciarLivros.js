const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

async function carregarLivros() {
    const container = document.getElementById('livros-container');
    container.innerHTML = '<div class="loading">Carregando livros...</div>';

    try {
        const response = await fetch('http://localhost:3000/livros');

        if (!response.ok) throw new Error('Erro ao carregar livros');

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
            <button onclick="verDetalhesLivro(${livro.livro_id})" class="btn-detalhes">👁️Ver Detalhes</button>
            <button onclick="editarLivro(${livro.livro_id})" class="btn-editar-item">✏️Editar</button>
            <button onclick="excluirLivro(${livro.livro_id})" class="btn-deletar">🗑️Excluir</button>
          </div>
        `;
        container.appendChild(div);
    });
}

function abrirModalCadastrarLivro() {
    document.getElementById('modal-titulo').textContent = 'Cadastrar Novo Livro';
    document.getElementById('form-livro').reset();
    document.getElementById('livro-id').value = '';
    document.getElementById('modal-livro').style.display = 'block';
}

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
        Toast.fire({
            icon: 'error',
            title: 'Erro ao carregar dados do livro.'
        });
    }
}

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

        Toast.fire({
            icon: 'success',
            title: livroId ? 'Livro atualizado!' : 'Livro cadastrado!'
        });
        fecharModalLivro();
        carregarLivros();

    } catch (erro) {
        console.error('Erro:', erro);
        Toast.fire({
            icon: 'error',
            title: 'Erro ao salvar livro.'
        });
    }
}


function fecharModalLivro() {
    document.getElementById('modal-livro').style.display = 'none';
}

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
        Toast.fire({
            icon: 'error',
            title: 'Erro ao carregar detalhes.'
        });
    }
}

function fecharModalDetalhes() {
    document.getElementById('modal-detalhes-livro').style.display = 'none';
}

async function excluirLivro(livroId) {
    const result = await Swal.fire({
        title: 'ATENÇÃO',
        text: 'Excluir este livro permanentemente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
        const response = await fetch(`http://localhost:3000/livros/${livroId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro');

        Toast.fire({
            icon: 'success',
            title: 'Livro excluído!'
        });
        carregarLivros();

    } catch (erro) {
        console.error('Erro:', erro);
        Toast.fire({
            icon: 'error',
            title: 'Erro ao excluir livro.'
        });
    }
}

function filtrarLivros() {
    const busca = document.getElementById('busca-livro').value.toLowerCase();
    const statusFiltro = document.getElementById('filtro-status').value;

    let livrosFiltrados = todosLivros;

    if (busca) {
        livrosFiltrados = livrosFiltrados.filter(l =>
            l.titulo.toLowerCase().includes(busca) ||
            l.autor.toLowerCase().includes(busca)
        );

        mostrarLivros(livrosFiltrados);
    }

    document.addEventListener('DOMContentLoaded', carregarLivros);
}

function pesquisarLivros(pesquisa) {
    const pesquisaBusca = pesquisa.toLowerCase().trim();

    if (pesquisaBusca === "") {
        mostrarLivros(todosLivros);
        return;
    }

    const livrosFiltrados = todosLivros.filter(livro => {
        const titulo = livro.titulo.toLowerCase();
        const autor = livro.autor.toLowerCase();
        
        return titulo.includes(pesquisaBusca) || autor.includes(pesquisaBusca);
    });

    mostrarLivros(livrosFiltrados);
}

function setupPerfilMenuAdmin() {
    try {
        const perfilWrap = document.querySelector('.perfil');
        if (!perfilWrap) return;

        // Se já existe o menu, não recria
        if (perfilWrap.querySelector('.perfil-menu')) return;

        // Cria o menu dropdown
        const menu = document.createElement('div');
        menu.className = 'perfil-menu';
        menu.innerHTML = `
            <button id="btn-infos" class="infos">Ver Informações</button>
            <button id="btn-logout" class="logout">Sair</button>
        `;

        perfilWrap.appendChild(menu);

        // Adiciona evento de clique nas iniciais
        const iniciais = document.getElementById('perfil-iniciais');
        if (iniciais) {
            iniciais.style.cursor = 'pointer';
            iniciais.addEventListener('click', (ev) => {
                ev.stopPropagation();
                menu.classList.toggle('show');
            });
        }

        // Fecha o menu ao clicar fora
        document.addEventListener('click', () => {
            menu.classList.remove('show');
        });

        // Botão "Ver Informações"
        const btnInfos = document.getElementById('btn-infos');
        if (btnInfos) {
            btnInfos.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.remove('show');
                abrirPopupInformacoesAdmin();
            });
        }

        // Botão "Sair"
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                Swal.fire({
                    title: "Deseja realmente sair?",
                    icon: "warning",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Sim, sair"
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Remove dados do admin
                        localStorage.removeItem('adminLogin');
                        localStorage.removeItem('adminId');
                        // Redireciona para login
                        window.location.href = '/pages/1 - Login/login.html';
                    }
                });
            });
        }

    } catch (e) {
        console.error('Erro inicializando menu de perfil admin:', e);
    }
}

function abrirPopupInformacoesAdmin() {
    const overlay = document.createElement('div');
    overlay.id = 'popup-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;

    const popup = document.createElement('div');
    popup.id = 'popup-informacoes';
    popup.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        min-width: 400px;
        max-width: 90%;
        position: relative;
    `;

    popup.innerHTML = `
        <button id="fechar-popup" style="
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            line-height: 1;
            padding: 5px 10px;
        ">&times;</button>
        
        <h2 style="margin-top: 0; margin-bottom: 20px; color: #333;">Informações do Administrador</h2>

        <div style="display: flex; flex-direction: column; gap: 15px;">
            <div class="info-section" style="display: flex; flex-direction: column; gap: 5px;">
                <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px;">Nome:</div>
                <div class="info-value" id="info-nome" style="color: #333; font-size: 16px;">Carregando...</div>
            </div>
            <div class="info-section" style="display: flex; flex-direction: column; gap: 5px;">
                <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px;">Email:</div>
                <div class="info-value" id="info-email" style="color: #333; font-size: 16px;">Carregando...</div>
            </div>
            <div class="info-section" style="display: flex; flex-direction: column; gap: 5px;">
                <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px;">Cargo:</div>
                <div class="info-value" style="color: #333; font-size: 16px;">Administrador</div>
            </div>
        </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Fecha ao clicar no X
    document.getElementById('fechar-popup').addEventListener('click', () => {
        overlay.remove();
    });

    // Fecha ao clicar fora do popup
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    // Impede que cliques dentro do popup fechem ele
    popup.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Buscar dados do admin
    (async () => {
        try {
            const adminId = localStorage.getItem('adminId');
            
            if (!adminId) {
                Swal.fire({ 
                    icon: 'warning', 
                    title: 'Erro', 
                    text: 'ID do administrador não encontrado.' 
                });
                overlay.remove();
                return;
            }

            console.log('Buscando dados do admin ID:', adminId);

            const response = await fetch(`http://localhost:3000/admin/${adminId}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.status}`);
            }

            const data = await response.json();
            console.log('Dados do admin recebidos:', data);

            // Atualiza os campos
            const elNome = document.getElementById('info-nome');
            const elEmail = document.getElementById('info-email');

            if (elNome) elNome.textContent = data.nome || 'Administrador';
            if (elEmail) elEmail.textContent = data.email || '-';

        } catch (err) {
            console.error('Erro ao carregar informações do admin:', err);
            Swal.fire({ 
                icon: 'error', 
                title: 'Erro', 
                text: 'Não foi possível carregar as informações.' 
            });
            overlay.remove();
        }
    })();
}

// Inicializa o menu quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    setupPerfilMenuAdmin();
});

// Adiciona evento na barra de pesquisa quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    const barraPesquisa = document.querySelector('.barra-pesquisa input');
    
    if (barraPesquisa) {
        barraPesquisa.addEventListener('input', (e) => {
            pesquisarLivros(e.target.value);
        });
    }
});