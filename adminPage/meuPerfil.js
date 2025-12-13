// Funções do Perfil do Administrador (RF09, RF10)

async function carregarPerfil() {
    // A variável global 'usuarioLogado' deve ser acessível a partir do 'adm.js'
    if (!usuarioLogado || !usuarioLogado.usuario_id) return;

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.usuario_id}`);
        
        if (!response.ok) throw new Error('Erro ao buscar perfil');
        
        const perfil = await response.json();
        perfilOriginal = { ...perfil }; // Salva o original para cancelamento
        
        document.getElementById('perfil-nome').value = perfil.nome;
        document.getElementById('perfil-email').value = perfil.email;
        // Assume que o campo pode ser 'CPF' ou 'cpf' vindo do backend
        document.getElementById('perfil-cpf').value = perfil.CPF || perfil.cpf || 'N/A';
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao carregar perfil.');
    }
}

// RF09 - Editar Perfil
function habilitarEdicaoPerfil() {
    document.getElementById('perfil-nome').disabled = false;
    document.getElementById('perfil-email').disabled = false;
    document.getElementById('btn-editar-perfil').style.display = 'none';
    document.getElementById('botoes-salvar-perfil').style.display = 'flex';
}

function cancelarEdicaoPerfil() {
    // Restaura os valores originais
    document.getElementById('perfil-nome').value = perfilOriginal.nome;
    document.getElementById('perfil-email').value = perfilOriginal.email;
    document.getElementById('perfil-nome').disabled = true;
    document.getElementById('perfil-email').disabled = true;
    document.getElementById('btn-editar-perfil').style.display = 'block';
    document.getElementById('botoes-salvar-perfil').style.display = 'none';
}

async function salvarPerfil() {
    const dados = {
        nome: document.getElementById('perfil-nome').value,
        email: document.getElementById('perfil-email').value
    };
    
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.usuario_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        if (!response.ok) throw new Error('Erro ao atualizar perfil');
        
        alert('Perfil atualizado com sucesso!');
        
        // Atualiza o Local Storage e o header
        usuarioLogado.nome = dados.nome;
        usuarioLogado.email = dados.email;
        localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
        document.getElementById('nome-admin').textContent = dados.nome;
        
        cancelarEdicaoPerfil(); // Volta ao modo de visualização
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao atualizar perfil.');
    }
}

// RF10 - Alterar Senha
async function alterarSenha() {
    const senhaAtual = document.getElementById('senha-atual').value;
    const senhaNova = document.getElementById('senha-nova').value;
    const senhaConfirmar = document.getElementById('senha-confirmar').value;
    
    if (!senhaAtual || !senhaNova || !senhaConfirmar) {
        alert('Preencha todos os campos!');
        return;
    }
    
    if (senhaNova !== senhaConfirmar) {
        alert('As novas senhas não coincidem!');
        return;
    }
    
    if (senhaNova.length < 8) {
        alert('A nova senha deve ter no mínimo 8 caracteres!');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/usuarios/alterar-senha', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: usuarioLogado.usuario_id,
                senha_atual: senhaAtual,
                senha_nova: senhaNova
            })
        });
        
        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.message || 'Erro ao alterar senha');
        }
        
        alert('Senha alterada com sucesso!');
        // Limpa os campos
        document.getElementById('senha-atual').value = '';
        document.getElementById('senha-nova').value = '';
        document.getElementById('senha-confirmar').value = '';
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert(erro.message);
    }
}

// Inicia o carregamento do perfil ao carregar a página
document.addEventListener('DOMContentLoaded', carregarPerfil);