async function carregarLayout() {

    try {
        const response = await fetch('/NavBar/navbar.html');
        const layout = await response.text(); 
        document.body.insertAdjacentHTML("afterbegin", layout);

        // Após carregar o navbar, atualiza as iniciais do usuário
        atualizarIniciaisUsuario();

    } catch (erro) {
        console.error("Erro ao carregar o layout:", erro);
    }
}

function atualizarIniciaisUsuario() {
    const usuarioLogin = localStorage.getItem('usuarioLogin');
    
    if (usuarioLogin) {
        // Divide o nome em partes
        const partes = usuarioLogin.trim().split(' ');
        
        // Pega a primeira letra do primeiro nome e do segundo nome (se existir)
        let iniciais = partes[0][0].toUpperCase();
        
        if (partes.length > 1) {
            iniciais += partes[1][0].toUpperCase();
        } else {
            // Se houver só um nome, pega a segunda letra
            if (partes[0].length > 1) {
                iniciais += partes[0][1].toUpperCase();
            }
        }
        
        // Atualiza o elemento das iniciais
        setTimeout(() => {
            const perfilIniciais = document.getElementById('perfil-iniciais');
            if (perfilIniciais) {
                perfilIniciais.textContent = iniciais;
            }
        }, 100); // Pequeno delay para garantir que o DOM foi carregado
    }
}

carregarLayout();