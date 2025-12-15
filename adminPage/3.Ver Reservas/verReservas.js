let todasReservas = [];

function formatarData(data) {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
}

async function carregarReservas() {
    const container = document.getElementById('reservas-container');
    container.innerHTML = '<div class="loading">Carregando reservas...</div>';

    try {
        const response = await fetch('http://localhost:3000/reservas/todas');
        if (!response.ok) throw new Error('Erro ao carregar reservas');

        todasReservas = await response.json();
        mostrarReservas(todasReservas);

    } catch (erro) {
        console.error(erro);
        container.innerHTML = '<div class="error">Erro ao carregar reservas.</div>';
    }
}

function mostrarReservas(reservas) {
    const container = document.getElementById('reservas-container');

    if (!reservas || reservas.length === 0) {
        container.innerHTML = '<p>Nenhuma reserva encontrada.</p>';
        return;
    }

    container.innerHTML = '';

    reservas.forEach(reserva => {
        let statusTexto = 'PENDENTE';
        let statusClasse = 'status-pendente';

        switch (reserva.status) {
            case 'reservado':
                statusTexto = 'RESERVADO';
                statusClasse = 'status-reservado';
                break;
            case 'retirado':
                statusTexto = 'EMPRESTADO';
                statusClasse = 'status-retirado';
                break;
            case 'concluido':
                statusTexto = 'CONCLUÍDO';
                statusClasse = 'status-concluido';
                break;
            default:
                statusTexto = 'PENDENTE';
                statusClasse = 'status-pendente';
        }

        const div = document.createElement('div');
        div.className = 'reserva-item';
        div.innerHTML = `
            <div class="reserva-info">
                <strong>Livro: ${reserva.titulo}</strong>
                <span>Usuário: ${reserva.usuario_nome}</span>
                <span>Reservado em: ${formatarData(reserva.data_reserva)}</span>
            </div>
            <div class="reserva-status ${statusClasse}">
                ${statusTexto}
            </div>
        `;
        container.appendChild(div);
    });
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

document.addEventListener('DOMContentLoaded', carregarReservas);
