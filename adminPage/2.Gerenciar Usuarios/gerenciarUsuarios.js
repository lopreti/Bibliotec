// Funções do Gerenciamento de Usuários (RF01, RF13)

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
            ${isAdmin 
              ? `<button onclick="removerAdmin(${usuario.usuario_id})" class="btn-remover-admin">Remover Admin</button>`
              : `<button onclick="tornarAdmin(${usuario.usuario_id})" class="btn-tornar-admin">Tornar Admin</button>`
            }
            <button onclick="deletarUsuario(${usuario.usuario_id})" class="btn-deletar">Deletar</button>
          </div>
        `;
        container.appendChild(div);
    });
}

// RF13 - Tornar Admin
async function tornarAdmin(usuarioId) {
    if (!confirm('Tornar este usuário administrador?')) return;
    
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}/admin`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_admin: true })
        });
        
        if (!response.ok) throw new Error('Erro ao promover usuário');
        
        alert('Usuário promovido a administrador!');
        carregarUsuarios();
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao promover usuário.');
    }
}

// RF13 - Remover Admin
async function removerAdmin(usuarioId) {
    if (!confirm('Remover privilégios de administrador?')) return;
    
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}/admin`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_admin: false })
        });
        
        if (!response.ok) throw new Error('Erro');
        
        alert('Privilégios removidos!');
        carregarUsuarios();
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao remover privilégios.');
    }
}

// RF01 - Deletar Usuário
async function deletarUsuario(usuarioId) {
    if (!confirm('ATENÇÃO: Deletar este usuário permanentemente?')) return;
    
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erro');
        
        alert('Usuário deletado!');
        carregarUsuarios();
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao deletar usuário.');
    }
}

// Inicia o carregamento de usuários ao carregar a página
document.addEventListener('DOMContentLoaded', carregarUsuarios);