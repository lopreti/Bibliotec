let todasReservas = [];

function formatarData(data) {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
}

async function carregarReservas() {
    const container = document.getElementById('reservas-container');
    if (!container) return;

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
        }

        const div = document.createElement('div');
        div.className = 'reserva-item';
        div.innerHTML = `
            <div class="reserva-info">
                <strong>Livro: ${reserva.titulo}</strong>
                <span>Usuário: ${reserva.usuario_nome}</span>
            </div>
            <div class="reserva-status ${statusClasse}">
                ${statusTexto}
            </div>
        `;
        container.appendChild(div);
    });
}


function setupPerfilMenuAdmin() {
    const perfilWrap = document.querySelector('.perfil');
    if (!perfilWrap || perfilWrap.querySelector('.perfil-menu')) return;

    const menu = document.createElement('div');
    menu.className = 'perfil-menu';
    menu.innerHTML = `
        <button id="btn-infos" class="infos">Ver Informações</button>
        <button id="btn-logout" class="logout">Sair</button>
    `;
    perfilWrap.appendChild(menu);

    const iniciais = document.getElementById('perfil-iniciais');
    iniciais.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    };

    document.addEventListener('click', () => menu.classList.remove('show'));

    document.getElementById('btn-infos').onclick = (e) => {
        e.stopPropagation();
        menu.classList.remove('show');
        abrirPopupInformacoesAdmin();
    };

    document.getElementById('btn-logout').onclick = () => {
        Swal.fire({
            title: 'Deseja sair?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim'
        }).then(r => {
            if (r.isConfirmed) {
                localStorage.removeItem('adminId');
                localStorage.removeItem('adminLogin');
                window.location.href = '/pages/1 - Login/login.html';
            }
        });
    };
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

    document.getElementById('fechar-popup').onclick = () => overlay.remove();
    overlay.onclick = e => e.target === overlay && overlay.remove();
    popup.onclick = e => e.stopPropagation();

    carregarDadosAdmin();
    configurarAlteracaoSenha();
}

async function carregarDadosAdmin() {
    const adminId = localStorage.getItem('adminId');
    if (!adminId) return;

    const res = await fetch(`http://localhost:3000/admin/${adminId}`);
    const data = await res.json();

    document.getElementById('info-nome').textContent = data.nome;
    document.getElementById('info-email').textContent = data.email;
    document.getElementById('info-cpf').textContent = data.CPF;
    document.getElementById('info-telefone').textContent = data.telefone;
}

function configurarAlteracaoSenha() {
    document.getElementById('btn-alterar-senha').onclick = async () => {
        const senhaAtual = document.getElementById('senha-atual').value;
        const novaSenha = document.getElementById('nova-senha').value;
        const adminId = localStorage.getItem('adminId');

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
            Swal.fire('Erro', data.message, 'error');
            return;
        }

        Swal.fire('Sucesso', data.message, 'success');
        document.getElementById('senha-atual').value = '';
        document.getElementById('nova-senha').value = '';
    };
}

document.addEventListener('DOMContentLoaded', () => {
    setupPerfilMenuAdmin();
    carregarReservas();
});
