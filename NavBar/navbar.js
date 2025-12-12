async function carregarLayout() {
    try {
        const response = await fetch('/NavBar/navbar.html');
        const layout = await response.text();
        document.body.insertAdjacentHTML("afterbegin", layout);

        atualizarIniciaisUsuario();
        setupPerfilMenu();

    } catch (erro) {
        console.error("Erro ao carregar o layout:", erro);
    }
}

function setupPerfilMenu() {
    try {
        const perfilWrap = document.querySelector('.perfil');
        if (!perfilWrap) return;

        if (perfilWrap.querySelector('.perfil-menu')) return;

        const menu = document.createElement('div');
        menu.className = 'perfil-menu';
        menu.innerHTML = `
            <button id="btn-infos" class="infos">Ver Informações</button>
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

        document.addEventListener('click', () => {
            menu.classList.remove('show');
        });

        const btnInfos = document.getElementById('btn-infos');
        if (btnInfos) {
            btnInfos.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.remove('show');
                abrirPopupInformacoes();
            });
        }
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
                        localStorage.removeItem('usuarioLogin');
                        window.location.href = '../1 - Login/login.html';
                    }
                });
            });
        }

    } catch (e) {
        console.error('Erro inicializando menu de perfil:', e);
    }
}

function abrirPopupInformacoes() {
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
        
        <h2 style="margin-top: 0; margin-bottom: 20px; color: #333;">Informações do seu perfil</h2>

        <div class="info-section">
            <div class="info-label">Nome de Usuário:</div>
            <div class="info-value">-</div>
        </div>
        <div class="info-section">
            <div class="info-label">CPF:</div>
            <div class="info-value">-</div>
        </div>
        <div class="info-section">
            <div class="info-label">Email:</div>
            <div class="info-value">-</div>
        </div>
        <div class="info-section">
            <div class="info-label">Telefone:</div>
            <div class="info-value">-</div>
        </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // FECHAR NO X
    document.getElementById('fechar-popup').addEventListener('click', () => {
        overlay.remove();
    });

    // FECHAR AO CLICAR FORA DO POPUP
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    // IMPEDIR FECHAR AO CLICAR NO POPUP
    popup.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}


function atualizarIniciaisUsuario() {
    const usuarioLogin = localStorage.getItem('usuarioLogin');

    if (usuarioLogin) {
        const partes = usuarioLogin.trim().split(' ');
        let iniciais = partes[0][0].toUpperCase();

        if (partes.length > 1) {
            iniciais += partes[1][0].toUpperCase();
        } else if (partes[0].length > 1) {
            iniciais += partes[0][1].toUpperCase();
        }

        setTimeout(() => {
            const perfilIniciais = document.getElementById('perfil-iniciais');
            if (perfilIniciais) {
                perfilIniciais.textContent = iniciais;
            }
        }, 100);
    }
}

carregarLayout();