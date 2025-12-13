// Dados globais
let usuarioLogado = null;
let perfilOriginal = {};

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    verificarPermissoes();
});

async function verificarPermissoes() {
    usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

    if (!usuarioLogado) {
        alert('Você precisa estar logado!');
        window.location.href = '/pages/1 - Login/login.html';
        return;
    }

    if (usuarioLogado.is_admin !== 1 && usuarioLogado.is_admin !== true) {
        alert('Acesso negado! Apenas administradores.');
        window.location.href = '/pages/2 - Principal/principal.html';
        return;
    }

    const nomeAdminEl = document.getElementById('nome-admin');
    if (nomeAdminEl) {
        nomeAdminEl.textContent = usuarioLogado.nome;
    }

    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = 'block';
    });
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.clear();
        window.location.href = '/pages/1 - Login/login.html';
    }
}
