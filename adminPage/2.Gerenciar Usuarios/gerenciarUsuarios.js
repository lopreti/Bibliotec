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
document.addEventListener('DOMContentLoaded', carregarUsuarios);