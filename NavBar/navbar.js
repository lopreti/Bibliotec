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
        // Se já existe um botão de entrar, não recria
        if (perfilWrap.querySelector('.entrar')) return;

        const usuarioLogin = localStorage.getItem('usuarioLogin');

        // Se o usuário NÃO está logado, mostra botão "Entrar"
        if (!usuarioLogin) {
            perfilWrap.innerHTML = `<button id="btn-entrar" class="entrar">Entrar</button>`;
            const btnEntrar = document.getElementById('btn-entrar');
            if (btnEntrar) btnEntrar.addEventListener('click', () => {
                window.location.href = '/pages/1 - Login/login.html';
            });
            return;
        }

        // Usuário logado: cria menu com Informações e Logout
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
                        localStorage.removeItem('usuarioId');
                        window.location.href = '/pages/1 - Login/login.html';
                    }
                });
            });
        }

    } catch (e) {
        console.error('Erro inicializando menu de perfil:', e);
    }
}

// ============================================
// SUBSTITUIR A FUNÇÃO abrirPopupInformacoes()
// NO ARQUIVO: navbar-loader.js
// ============================================

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

    // ✅ Estilos melhorados para melhor visualização
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

        <div style="display: flex; flex-direction: column; gap: 15px;">
            <div class="info-section" style="display: flex; flex-direction: column; gap: 5px;">
                <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px;">Nome de Usuário:</div>
                <div class="info-value" id="info-nome" style="color: #333; font-size: 16px;">Carregando...</div>
            </div>
            <div class="info-section" style="display: flex; flex-direction: column; gap: 5px;">
                <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px;">CPF:</div>
                <div class="info-value" id="info-cpf" style="color: #333; font-size: 16px;">Carregando...</div>
            </div>
            <div class="info-section" style="display: flex; flex-direction: column; gap: 5px;">
                <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px;">Email:</div>
                <div class="info-value" id="info-email" style="color: #333; font-size: 16px;">Carregando...</div>
            </div>
            <div class="info-section" style="display: flex; flex-direction: column; gap: 5px;">
                <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px;">Telefone:</div>
                <div class="info-value" id="info-telefone" style="color: #333; font-size: 16px;">Carregando...</div>
            </div>
        </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    document.getElementById('fechar-popup').addEventListener('click', () => {
        overlay.remove();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    popup.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // BUSCAR DADOS DO USUÁRIO
    (async () => {
        try {
            const usuarioId = localStorage.getItem('usuarioId');
            if (!usuarioId) {
                Swal.fire({ 
                    icon: 'warning', 
                    title: 'Você não está logado', 
                    text: 'Faça login para ver suas informações.' 
                });
                overlay.remove();
                return;
            }

            console.log('Buscando dados do usuário ID:', usuarioId);

            const candidates = [];
            if (location.hostname) candidates.push('');
            candidates.push('http://localhost:3000');
            candidates.push('http://127.0.0.1:3000');

            let resp = null;
            let usedUrl = null;

            for (const base of candidates) {
                const candidateUrl = `${base}/usuarios/${usuarioId}`.replace('//usuarios', '/usuarios');
                console.log('Tentando URL:', candidateUrl);
                try {
                    const r = await fetch(candidateUrl, { method: 'GET' });
                    console.log('Resposta de', candidateUrl, r.status);
                    if (r.status === 200) {
                        resp = r;
                        usedUrl = candidateUrl;
                        break;
                    }
                    if (r.status === 404) {
                        const body = await r.text().catch(() => '');
                        console.warn('404 de', candidateUrl, body.slice(0, 200));
                        continue;
                    }
                    resp = r;
                    usedUrl = candidateUrl;
                    break;
                } catch (e) {
                    console.warn('Erro ao tentar', candidateUrl, e.message || e);
                }
            }

            if (!resp) {
                throw new Error('Nenhuma URL disponível para buscar dados do usuário');
            }

            if (!resp.ok) {
                let body = '';
                try { body = await resp.text(); } catch (e) { /* ignore */ }
                console.error('Resposta inesperada ao buscar usuário:', resp.status, body);

                if (resp.status === 404) {
                    try {
                        const json = JSON.parse(body);
                        Swal.fire({ 
                            icon: 'warning', 
                            title: 'Não encontrado', 
                            text: json.message || 'Usuário não encontrado.' 
                        });
                    } catch (e) {
                        Swal.fire({ 
                            icon: 'warning', 
                            title: 'Não encontrado', 
                            text: 'Usuário não encontrado.' 
                        });
                    }
                    overlay.remove();
                    return;
                }

                throw new Error(`Falha ao obter dados do usuário (status ${resp.status})`);
            }

            const data = await resp.json();
            console.log('Dados recebidos:', data);

            // ✅ CORRIGIDO: Usando os nomes corretos dos campos
            const elNome = document.getElementById('info-nome');
            const elCpf = document.getElementById('info-cpf');
            const elEmail = document.getElementById('info-email');
            const elTelefone = document.getElementById('info-telefone');

            if (elNome) elNome.textContent = data.nome || '-';
            if (elCpf) elCpf.textContent = data.CPF || data.cpf || '-'; // Aceita CPF ou cpf
            if (elEmail) elEmail.textContent = data.email || '-';
            if (elTelefone) elTelefone.textContent = data.telefone || '-';

        } catch (err) {
            console.error('Erro ao carregar informações do usuário:', err);
            Swal.fire({ 
                icon: 'error', 
                title: 'Erro', 
                text: 'Não foi possível carregar suas informações.' 
            });
            overlay.remove();
        }
    })();
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