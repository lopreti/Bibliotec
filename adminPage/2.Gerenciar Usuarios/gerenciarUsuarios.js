const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

async function carregarUsuarios() {
    const container = document.getElementById('usuarios-container');
    container.innerHTML = '<div class="loading">Carregando usuários...</div>';

    try {
        const response = await fetch('http://localhost:3000/usuarios');

        if (!response.ok) throw new Error('Erro ao carregar usuários');

        const usuarios = await response.json();
        mostrarUsuarios(usuarios);

    } catch (erro) {
        console.error('Erro:', erro);
        container.innerHTML = '<div class="error">Erro ao carregar usuários.</div>';
    }
}

function mostrarUsuarios(usuarios) {
    const container = document.getElementById('usuarios-container');

    if (usuarios.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhum usuário encontrado.</p></div>';
        return;
    }

    container.innerHTML = '';

    usuarios.forEach(usuario => {
        const isAdmin = usuario.is_admin === 1 || usuario.is_admin === true;
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
            <button onclick="deletarUsuario(${usuario.usuario_id})" class="btn-deletar">Deletar</button>
          </div>
        `;
        container.appendChild(div);
    });
}


async function deletarUsuario(usuarioId) {
    const result = await Swal.fire({
        title: 'ATENÇÃO',
        text: 'Deletar este usuário permanentemente?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Deletar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error();

        Toast.fire({
            icon: 'success',
            title: 'Usuário deletado!'
        });

        carregarUsuarios();

    } catch (erro) {
        console.error('Erro:', erro);
        Toast.fire({
            icon: 'error',
            title: 'Erro ao deletar usuário'
        });
    }
}

// navbar-admin.js - Script para navbar do administrador

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

document.addEventListener('DOMContentLoaded', carregarUsuarios);