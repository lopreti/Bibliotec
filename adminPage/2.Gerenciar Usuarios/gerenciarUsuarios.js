/* =========================
   TOAST (SweetAlert)
========================= */
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

/* =========================
   USUÁRIOS
========================= */
async function carregarUsuarios() {
    const container = document.getElementById('usuarios-container');
    container.innerHTML = '<div class="loading">Carregando usuários...</div>';

    try {
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) throw new Error();

        const usuarios = await response.json();
        mostrarUsuarios(usuarios);

    } catch (erro) {
        console.error(erro);
        container.innerHTML = '<div class="error">Erro ao carregar usuários.</div>';
    }
}

function mostrarUsuarios(usuarios) {
    const container = document.getElementById('usuarios-container');

    if (!usuarios || usuarios.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum usuário encontrado.</div>';
        return;
    }

    container.innerHTML = '';

    usuarios.forEach(usuario => {
        const isAdmin = usuario.is_admin === 1;
        const badge = isAdmin
            ? '<span class="admin-badge">ADMIN</span>'
            : '<span class="user-badge">USUÁRIO</span>';

        const div = document.createElement('div');
        div.className = 'usuario-item';
        div.innerHTML = `
            <div class="usuario-info">
                <strong>${usuario.nome}</strong>
                <span>${usuario.email}</span>
                ${badge}
            </div>
            <div class="usuario-acoes">
                <button class="btn-editar" onclick="abrirPopupEditarUsuario(${usuario.usuario_id})">
                    Editar
                </button>
                <button class="btn-deletar" onclick="deletarUsuario(${usuario.usuario_id})">
                    Deletar
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

/* =========================
   EDITAR USUÁRIO
========================= */
async function abrirPopupEditarUsuario(usuarioId) {
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`);
        if (!response.ok) throw new Error();

        const usuario = await response.json();

        const overlay = document.createElement('div');
        overlay.id = 'popup-overlay';

        const popup = document.createElement('div');
        popup.id = 'popup-editar-usuario';

        popup.innerHTML = `
            <button id="fechar-popup">&times;</button>
            <h2>Editar Usuário</h2>

            <label for="edit-nome">Nome:</label>
            <input type="text" id="edit-nome" value="${usuario.nome || ''}">

            <label for="edit-email">Email:</label>
            <input type="email" id="edit-email" value="${usuario.email || ''}">

            <label for="edit-cpf">CPF:</label>
            <input type="text" id="edit-cpf" value="${usuario.CPF || ''}" maxlength="14">

            <label for="edit-telefone">Telefone:</label>
            <input type="text" id="edit-telefone" value="${usuario.telefone || ''}" maxlength="15">

            <div class="btn-container">
                <button id="btn-cancelar-edicao">Cancelar</button>
                <button id="btn-salvar-usuario">Salvar Alterações</button>
            </div>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Fechar ao clicar no overlay
        overlay.onclick = (e) => e.target === overlay && overlay.remove();
        popup.onclick = (e) => e.stopPropagation();
        
        // Botão fechar (X)
        document.getElementById('fechar-popup').onclick = () => overlay.remove();
        
        // Botão cancelar
        document.getElementById('btn-cancelar-edicao').onclick = () => overlay.remove();

        // Botão salvar
        document.getElementById('btn-salvar-usuario').onclick = () => salvarEdicaoUsuario(usuarioId, overlay);

        // Máscaras para CPF e Telefone
        aplicarMascaraCPF();
        aplicarMascaraTelefone();

    } catch (erro) {
        console.error(erro);
        Toast.fire({ icon: 'error', title: 'Erro ao carregar dados do usuário' });
    }
}

async function salvarEdicaoUsuario(usuarioId, overlay) {
    const nome = document.getElementById('edit-nome').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const cpf = document.getElementById('edit-cpf').value.trim();
    const telefone = document.getElementById('edit-telefone').value.trim();

    // Validações básicas
    if (!nome || !email) {
        Swal.fire('Atenção', 'Nome e email são obrigatórios', 'warning');
        return;
    }

    if (!validarEmail(email)) {
        Swal.fire('Atenção', 'Email inválido', 'warning');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome,
                email,
                CPF: cpf,
                telefone
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao atualizar usuário');
        }

        Toast.fire({ icon: 'success', title: 'Usuário atualizado com sucesso!' });
        overlay.remove();
        carregarUsuarios();

    } catch (erro) {
        console.error(erro);
        Swal.fire('Erro', erro.message || 'Erro ao atualizar usuário', 'error');
    }
}

/* =========================
   MÁSCARAS
========================= */
function aplicarMascaraCPF() {
    const input = document.getElementById('edit-cpf');
    if (!input) return;

    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }
        
        e.target.value = value;
    });
}

function aplicarMascaraTelefone() {
    const input = document.getElementById('edit-telefone');
    if (!input) return;

    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 10) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
        }
        
        e.target.value = value;
    });
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/* =========================
   DELETAR USUÁRIO
========================= */
async function deletarUsuario(usuarioId) {
    const confirmacao = await Swal.fire({
        title: 'ATENÇÃO',
        text: 'Deseja deletar este usuário permanentemente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Deletar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmacao.isConfirmed) return;

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error();

        Toast.fire({ icon: 'success', title: 'Usuário deletado!' });
        carregarUsuarios();

    } catch (erro) {
        console.error(erro);
        Toast.fire({ icon: 'error', title: 'Erro ao deletar usuário' });
    }
}

/* =========================
   NAVBAR ADMIN
========================= */
function setupPerfilMenuAdmin() {
    const perfilWrap = document.querySelector('.perfil');
    const iniciais = document.getElementById('perfil-iniciais');

    if (!perfilWrap || !iniciais) return;
    if (perfilWrap.querySelector('.perfil-menu')) return;

    const menu = document.createElement('div');
    menu.className = 'perfil-menu';
    menu.innerHTML = `
        <button class="infos">Ver Informações</button>
        <button class="logout">Sair</button>
    `;
    perfilWrap.appendChild(menu);

    iniciais.style.cursor = 'pointer';
    iniciais.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    };

    document.addEventListener('click', () => {
        menu.classList.remove('show');
    });

    menu.querySelector('.infos').onclick = (e) => {
        e.stopPropagation();
        menu.classList.remove('show');
        abrirPopupInformacoesAdmin();
    };

    menu.querySelector('.logout').onclick = () => {
        Swal.fire({
            title: 'Deseja realmente sair?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, sair'
        }).then(r => {
            if (r.isConfirmed) {
                localStorage.removeItem('adminId');
                localStorage.removeItem('adminLogin');
                window.location.href = '/pages/1 - Login/login.html';
            }
        });
    };
}

/* =========================
   POPUP ADMIN
========================= */
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

/* =========================
   DADOS ADMIN
========================= */
async function carregarDadosAdmin() {
    const adminId = localStorage.getItem('adminId');
    if (!adminId) return;

    const res = await fetch(`http://localhost:3000/admin/${adminId}`);
    const data = await res.json();

    document.getElementById('info-nome').textContent = data.nome || '-';
    document.getElementById('info-email').textContent = data.email || '-';
    document.getElementById('info-cpf').textContent = data.CPF || '-';
    document.getElementById('info-telefone').textContent = data.telefone || '-';
}

/* =========================
   ALTERAR SENHA ADMIN
========================= */
function configurarAlteracaoSenha() {
    document.getElementById('btn-alterar-senha').onclick = async () => {
        const senhaAtual = document.getElementById('senha-atual').value;
        const novaSenha = document.getElementById('nova-senha').value;
        const adminId = localStorage.getItem('adminId');

        if (!novaSenha || novaSenha.length < 8) {
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

        Swal.fire('Sucesso', data.message, 'success');
        document.getElementById('senha-atual').value = '';
        document.getElementById('nova-senha').value = '';
    };
}

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', () => {
    setupPerfilMenuAdmin();
    carregarUsuarios();
});