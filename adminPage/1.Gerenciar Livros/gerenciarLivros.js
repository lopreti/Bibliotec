/* =======================
   TOAST (SweetAlert)
======================= */
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

/* =======================
   VARIÁVEIS GLOBAIS
======================= */
let todosLivros = [];

/* =======================
   LIVROS
======================= */
async function carregarLivros() {
    const container = document.getElementById('livros-container');
    container.innerHTML = '<div class="loading">Carregando livros...</div>';

    try {
        const response = await fetch('http://localhost:3000/livros');
        if (!response.ok) throw new Error();

        todosLivros = await response.json();
        mostrarLivros(todosLivros);

    } catch (erro) {
        console.error(erro);
        container.innerHTML = '<div class="error">Erro ao carregar livros.</div>';
    }
}

function mostrarLivros(livros) {
    const container = document.getElementById('livros-container');

    if (!livros.length) {
        container.innerHTML = '<div class="empty-state">Nenhum livro encontrado.</div>';
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
                <button class="btn-detalhes" onclick="verDetalhesLivro(${livro.livro_id})">👁️ Detalhes</button>
                <button class="btn-editar-item" onclick="editarLivro(${livro.livro_id})">✏️ Editar</button>
                <button class="btn-deletar" onclick="excluirLivro(${livro.livro_id})">🗑️ Excluir</button>
            </div>
        `;
        container.appendChild(div);
    });
}

/* =======================
   CRUD LIVRO
======================= */
async function editarLivro(id) {
    try {
        const res = await fetch(`http://localhost:3000/livros/${id}`);
        if (!res.ok) throw new Error();

        const livro = await res.json();

        document.getElementById('modal-titulo').textContent = 'Editar Livro';
        document.getElementById('livro-id').value = livro.livro_id;
        document.getElementById('livro-titulo').value = livro.titulo;
        document.getElementById('livro-autor').value = livro.autor;
        document.getElementById('livro-ano').value = livro.publicado_ano || '';
        document.getElementById('livro-quantidade').value = livro.quant_paginas || '';
        document.getElementById('livro-idioma').value = livro.idioma || '';
        document.getElementById('livro-descricao').value = livro.descricao || '';
        document.getElementById('livro-capa-url').value = livro.capa_url || '';

        document.getElementById('modal-livro').style.display = 'block';

    } catch {
        Toast.fire({ icon: 'error', title: 'Erro ao carregar livro' });
    }
}

async function salvarLivro(e) {
    e.preventDefault();

    const id = document.getElementById('livro-id').value;

    const dados = {
        titulo: livro-titulo.value,
        autor: livro-autor.value,
        descricao: livro-descricao.value,
        publicado_ano: livro-ano.value,
        quant_paginas: livro-quantidade.value,
        idioma: livro-idioma.value
    };

    try {
        const res = await fetch(
            id ? `http://localhost:3000/livros/${id}` : 'http://localhost:3000/livros',
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            }
        );

        if (!res.ok) throw new Error();

        Toast.fire({
            icon: 'success',
            title: id ? 'Livro atualizado!' : 'Livro cadastrado!'
        });

        fecharModalLivro();
        carregarLivros();

    } catch {
        Toast.fire({ icon: 'error', title: 'Erro ao salvar livro' });
    }
}

async function excluirLivro(id) {
    const confirm = await Swal.fire({
        title: 'Excluir livro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Excluir'
    });

    if (!confirm.isConfirmed) return;

    try {
        const res = await fetch(`http://localhost:3000/livros/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();

        Toast.fire({ icon: 'success', title: 'Livro excluído' });
        carregarLivros();

    } catch {
        Toast.fire({ icon: 'error', title: 'Erro ao excluir livro' });
    }
}

/* =======================
   DETALHES
======================= */
async function verDetalhesLivro(id) {
    try {
        const res = await fetch(`http://localhost:3000/livros/${id}`);
        if (!res.ok) throw new Error();

        const livro = await res.json();

        document.getElementById('detalhes-livro-content').innerHTML = `
            <p><strong>Título:</strong> ${livro.titulo}</p>
            <p><strong>Autor:</strong> ${livro.autor}</p>
            <p><strong>Ano:</strong> ${livro.publicado_ano || '-'}</p>
            <p><strong>Páginas:</strong> ${livro.quant_paginas || '-'}</p>
            <p><strong>Idioma:</strong> ${livro.idioma || '-'}</p>
            <p><strong>Descrição:</strong> ${livro.descricao || '-'}</p>
        `;

        document.getElementById('modal-detalhes-livro').style.display = 'block';

    } catch {
        Toast.fire({ icon: 'error', title: 'Erro ao carregar detalhes' });
    }
}

function fecharModalLivro() {
    document.getElementById('modal-livro').style.display = 'none';
}

function fecharModalDetalhes() {
    document.getElementById('modal-detalhes-livro').style.display = 'none';
}

/* =======================
   PESQUISA
======================= */
function pesquisarLivros(texto) {
    const busca = texto.toLowerCase().trim();

    if (!busca) {
        mostrarLivros(todosLivros);
        return;
    }

    const filtrados = todosLivros.filter(l =>
        l.titulo.toLowerCase().includes(busca) ||
        l.autor.toLowerCase().includes(busca)
    );

    mostrarLivros(filtrados);
}

async function carregarDadosAdmin() {
    const adminId = localStorage.getItem('adminId');

    if (!adminId) {
        Swal.fire('Erro', 'Admin não identificado', 'error');
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/admin/${adminId}`);
        const data = await res.json();

        document.getElementById('info-nome').textContent = data.nome || '-';
        document.getElementById('info-email').textContent = data.email || '-';
        document.getElementById('info-cpf').textContent = data.CPF || '-';
        document.getElementById('info-telefone').textContent = data.telefone || '-';

    } catch (err) {
        Swal.fire('Erro', 'Erro ao carregar dados do admin', 'error');
    }
}


function abrirPopupInformacoesAdmin() {
    const overlay = document.createElement('div');
    overlay.id = 'popup-overlay';

    const popup = document.createElement('div');
    popup.id = 'popup-admin';

    popup.innerHTML = `
        <button id="fechar-popup">&times;</button>
        <h2>Perfil do Administrador</h2>

        <div class="info-section"><b>Nome:</b> <span id="info-nome">...</span></div>
        <div class="info-section"><b>Email:</b> <span id="info-email">...</span></div>
        <div class="info-section"><b>CPF:</b> <span id="info-cpf">...</span></div>
        <div class="info-section"><b>Telefone:</b> <span id="info-telefone">...</span></div>

        <hr>

        <h3>Alterar Senha</h3>
        <input type="password" id="senha-atual" placeholder="Senha atual">
        <input type="password" id="nova-senha" placeholder="Nova senha (mín. 8)">
        <button id="btn-alterar-senha">Alterar senha</button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    overlay.onclick = (e) => e.target === overlay && overlay.remove();
    popup.onclick = (e) => e.stopPropagation();
    document.getElementById('fechar-popup').onclick = () => overlay.remove();

    carregarDadosAdmin();
    configurarAlteracaoSenha();
}


/* =======================
   NAVBAR ADMIN (ÚNICA)
======================= */
function setupPerfilMenuAdmin() {
    const perfilWrap = document.querySelector('.perfil');
    const iniciais = document.getElementById('perfil-iniciais');

    if (!perfilWrap || !iniciais) return;

    if (perfilWrap.querySelector('.perfil-menu')) return;

    const menu = document.createElement('div');
    menu.className = 'perfil-menu';
    menu.innerHTML = `
        <button class="btn-infos">Ver Informações</button>
        <button class="btn-logout">Sair</button>
    `;

    perfilWrap.appendChild(menu);

    iniciais.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        menu.classList.remove('show');
    });

    menu.querySelector('.btn-infos').addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.remove('show');
        abrirPopupInformacoesAdmin();
    });

    menu.querySelector('.btn-logout').addEventListener('click', () => {
        menu.classList.remove('show');

        Swal.fire({
            title: 'Deseja realmente sair?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, sair',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                localStorage.removeItem('adminId');
                localStorage.removeItem('adminLogin');
                window.location.href = '/pages/1 - Login/login.html';
            }
        });
    });
}

function configurarAlteracaoSenha() {
    document.getElementById('btn-alterar-senha').onclick = async () => {
        const senhaAtual = document.getElementById('senha-atual').value;
        const novaSenha = document.getElementById('nova-senha').value;
        const adminId = localStorage.getItem('adminId');

        if (!senhaAtual || !novaSenha) {
            Swal.fire('Erro', 'Preencha todos os campos', 'warning');
            return;
        }

        if (novaSenha.length < 8) {
            Swal.fire('Erro', 'Senha deve ter no mínimo 8 caracteres', 'warning');
            return;
        }

        const res = await fetch(`http://localhost:3000/admin/${adminId}/senha`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senhaAtual, novaSenha })
        });

        const data = await res.json();

        if (!res.ok) {
            Swal.fire('Erro', data.message || 'Erro ao alterar senha', 'error');
            return;
        }

        Swal.fire('Sucesso', 'Senha alterada com sucesso', 'success');

        document.getElementById('senha-atual').value = '';
        document.getElementById('nova-senha').value = '';
    };
}


/* =======================
   INIT
======================= */
document.addEventListener('DOMContentLoaded', () => {
    carregarLivros();
    setupPerfilMenuAdmin();

    const barra = document.querySelector('.barra-pesquisa input');
    if (barra) barra.addEventListener('input', e => pesquisarLivros(e.target.value));
});