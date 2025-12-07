async function carregarLayout() {

    try {
        const response = await fetch('/NavBar/navbar.html');
        const layout = await response.text(); 
        document.body.insertAdjacentHTML("afterbegin", layout);

        // Após carregar o navbar, atualiza as iniciais do usuário
            atualizarIniciaisUsuario();

            // Inicializa tema (botão global no navbar)
            setupNavbarTheme();
            // Inicializa menu de perfil (logout)
            setupPerfilMenu();

    } catch (erro) {
        console.error("Erro ao carregar o layout:", erro);
    }
}

function setupPerfilMenu() {
    try {
        const perfilWrap = document.querySelector('.perfil');
        if (!perfilWrap) return;

        // Não duplicar menu caso já exista
        if (perfilWrap.querySelector('.perfil-menu')) return;

        const menu = document.createElement('div');
        menu.className = 'perfil-menu';
        menu.innerHTML = `
            <button id="btn-logout" class="logout">Sair</button>
        `;

        perfilWrap.appendChild(menu);

        const iniciais = document.getElementById('perfil-iniciais');
        if (iniciais) {
            iniciais.style.cursor = 'pointer';
            iniciais.addEventListener('click', (ev) => {
                ev.stopPropagation();
                menu.classList.toggle('show');
            });
        }

        // Fecha ao clicar fora
        document.addEventListener('click', () => {
            menu.classList.remove('show');
        });

        // Logout
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                // Limpa dados de sessão/localStorage e redireciona para a página de login
                localStorage.removeItem('usuarioLogin');
                // Caso precise limpar mais itens, adicionar aqui
                window.location.href = '/1 - Login/login.html';
            });
        }
    } catch (e) {
        console.error('Erro inicializando menu de perfil:', e);
    }
}

function setupNavbarTheme() {
    try {
        const btn = document.getElementById('btn-dark-mode');
        const saved = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('dark', saved === 'dark');

        if (!btn) return;

        const updateIcon = () => {
            btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
        };

        btn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcon();
        });

        updateIcon();
    } catch (e) {
        console.error('Erro ao inicializar tema do navbar:', e);
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