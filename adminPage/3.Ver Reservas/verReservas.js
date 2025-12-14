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

document.addEventListener('DOMContentLoaded', carregarReservas);
