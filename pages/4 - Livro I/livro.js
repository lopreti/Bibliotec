const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const userId = localStorage.getItem('usuarioId');

// Função para navegar de volta para a página de origem preservando posição
function voltarParaPágina() {
    // Primeiro tenta usar o contexto armazenado na sessão (mais confiável)
    const stored = sessionStorage.getItem('returnContext');
    if (stored) {
        try {
            const ctx = JSON.parse(stored);
            const targetMap = {
                principal: '/pages/2 - Principal/principal.html',
                favoritos: '/pages/5 -Favoritos/favoritos.html',
                reservados: '/pages/6-Reservados/reservados.html'
            };
            const target = targetMap[ctx.from] || document.referrer || '/pages/2 - Principal/principal.html';

            // preserva posição
            if (ctx.scrollY != null) {
                sessionStorage.setItem('restoreScroll', String(ctx.scrollY));
            }

            // limpa o contexto para que não seja reaplicado depois
            sessionStorage.removeItem('returnContext');

            // navega
            window.location.href = target;
            return;
        } catch (e) {
            // fallback para os próximos métodos
            console.error('Erro ao parsear returnContext', e);
        }
    }

    // Se o parâmetro 'from' veio na URL, usa ele
    const fromParam = params.get('from');
    if (fromParam) {
        const targetMap = {
            principal: '/pages/2 - Principal/principal.html',
            favoritos: '/pages/5 -Favoritos/favoritos.html',
            reservados: '/pages/6-Reservados/reservados.html'
        };

        const target = targetMap[fromParam] || null;
        if (target) {
            // tenta preservar scroll (se houver valor previamente salvo)
            const maybeRestore = sessionStorage.getItem('returnContext');
            if (maybeRestore) {
                try {
                    const ctx = JSON.parse(maybeRestore);
                    if (ctx.scrollY != null) sessionStorage.setItem('restoreScroll', String(ctx.scrollY));
                } catch (e) { }
            }
            window.location.href = target;
            return;
        }
    }

    // Se houver referrer para uma página interna, volta para ela
    if (document.referrer) {
        const ref = document.referrer;
        // se o referrer é uma das páginas do app, navega para ele
        if (ref.includes('/pages/2 - Principal') || ref.includes('/pages/5 -Favoritos') || ref.includes('/pages/6-Reservados')) {
            window.location.href = ref;
            return;
        }
    }

    // fallback: usa history.back() se possível, senão vai para a principal
    if (history.length > 1) {
        history.back();
    } else {
        window.location.href = '/pages/2 - Principal/principal.html';
    }
}

function promptLogin(actionName) {
    Swal.fire({
        title: `Você precisa estar logado para ${actionName}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Entrar',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            window.location.href = '/pages/1 - Login/login.html';
        }
    });
}

// =========================
//  CARREGAR DADOS DO LIVRO
// =========================

console.log("ID da URL:", id);

if (id) {
    fetch(`http://localhost:3000/livros/${id}`)
        .then(res => res.json())
        .then(livro => {
            console.log("Livro recebido:", livro);
            if (livro.message) {
                document.body.innerHTML = `<h2>${livro.message}</h2>`;
            } else {

                const livroId = livro.ID || livro.id || livro.livro_id;
                console.log("Preenchendo dados do livro:", livroId);

                document.querySelector("#titulo-livro").textContent = livro.titulo;
                document.querySelector("#autor-livro").textContent = livro.autor;
                document.querySelector("#descricao-livro").textContent = livro.descricao;
                document.querySelector("#capa-livro").src = livro.capa_url;
                document.querySelector("#nome-livro").textContent = livro.titulo;
                document.querySelector(".informacoes p:nth-of-type(1) span").textContent = livro.quant_paginas || "N/A";
                document.querySelector(".informacoes p:nth-of-type(2) span").textContent = livro.idioma || "Português";

                // ----------------------------------------------------------------------
                // 💡 CÓDIGO CORRIGIDO PARA EXIBIR CATEGORIAS COMO TAGS (SEM VÍRGULA)
                // ----------------------------------------------------------------------
                const categoriasContainer = document.getElementById("categorias-livro");
                const categoriasString = livro.categorias; // CORRIGIDO para 'categorias' (plural)

                if (categoriasString && categoriasString.trim() !== '') {
                    // 1. Divide a string de categorias usando a vírgula e espaço como separador
                    const categoriasArray = categoriasString.split(', ');
                    let htmlContent = '';

                    // 2. Constrói um <span> para cada categoria, eliminando a vírgula
                    categoriasArray.forEach(categoria => {
                        // Cada <span> será estilizado como uma tag pelo seu livro.css
                        htmlContent += `<span>${categoria}</span> `;
                    });

                    // 3. Insere os spans no HTML
                    categoriasContainer.innerHTML = htmlContent.trim();
                } else {
                    categoriasContainer.textContent = "Não classificado";
                }

                verificarFavorito(livroId);
                verificarReservado(livroId);
            }
        })
        .catch(err => console.error("Erro ao buscar livro:", err));
} else {
    console.log("Nenhum ID foi passado na URL");
    document.body.innerHTML = "<h2>ID do livro não informado.</h2>";
}

// Handler do botão voltar (seta)
const setaVoltar = document.querySelector('.seta-voltar');
if (setaVoltar) {
    setaVoltar.style.cursor = 'pointer';
    setaVoltar.addEventListener('click', (e) => {
        e.preventDefault();
        voltarParaPágina();
    });
}



// =========================
//  FAVORITOS
// =========================

function verificarFavorito(livroId) {
    if (!userId) {
        // Não está logado: deixa botão disponível para redirecionar ao login
        atualizarBotaoFavorito(false, livroId);
        return;
    }

    fetch(`http://localhost:3000/favoritos/${userId}`)
        .then(res => res.json())
        .then(favoritos => {
            const jaFavoritado = favoritos.some(f => f.livro_id == livroId);
            atualizarBotaoFavorito(jaFavoritado, livroId);
        })
        .catch(err => {
            console.error("Erro ao verificar favorito:", err);
            atualizarBotaoFavorito(false, livroId);
        });
}

function atualizarBotaoFavorito(jaFavoritado, livroId) {
    const btnFavoritar = document.querySelector('.favoritar button');

    if (jaFavoritado) {
        btnFavoritar.innerHTML = '🤍 Favoritado';
        btnFavoritar.style.backgroundColor = '#ff4d4d';
        btnFavoritar.style.color = 'white';
        btnFavoritar.onclick = () => removerFavorito(livroId);
    } else {
        btnFavoritar.innerHTML = '❤️ Favoritar';
        btnFavoritar.style.backgroundColor = '';
        btnFavoritar.style.color = '';
        if (!userId) {
            btnFavoritar.onclick = () => promptLogin('favoritar este livro');
        } else {
            btnFavoritar.onclick = () => adicionarFavorito(livroId);
        }
    }
}

function adicionarFavorito(livroId) {
    if (!userId) {
        promptLogin('favoritar este livro');
        return;
    }
    const btnFavoritar = document.querySelector('.favoritar button');
    btnFavoritar.disabled = true;
    btnFavoritar.innerHTML = 'Adicionando...';

    fetch('http://localhost:3000/favoritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario_id: userId,
            livro_id: livroId
        })
    })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                title: data.message,
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            btnFavoritar.disabled = false;
            verificarFavorito(livroId);
        })
        .catch(err => {
            console.error("Erro ao adicionar favorito:", err);
            Swal.fire({
                icon: "warning",
                title: "Erro ao adicionar aos favoritos",
                showConfirmButton: false,
                timer: 1500
            });
            btnFavoritar.disabled = false;
            atualizarBotaoFavorito(false, livroId);
        });
}

function removerFavorito(livroId) {
    Swal.fire({
        title: "Deseja remover este livro dos favoritos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, remover",
        cancelButtonText: "Não",
    }).then((result) => {
        if (!result.isConfirmed) return;

        const btnFavoritar = document.querySelector('.favoritar button');
        btnFavoritar.disabled = true;
        btnFavoritar.innerHTML = 'Removendo...';

        fetch(`http://localhost:3000/favoritos/${userId}/${livroId}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {

                Swal.fire({
                    title: data.message || "Removido dos favoritos!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                btnFavoritar.disabled = false;
                btnFavoritar.innerHTML = 'Favoritar';

                atualizarBotaoFavorito(false, livroId);
            })
            .catch(err => {
                console.error("Erro ao remover favorito:", err);

                Swal.fire({
                    title: "Erro ao remover dos favoritos",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false
                });

                btnFavoritar.disabled = false;
                atualizarBotaoFavorito(true, livroId);
            });
    });
}



// =========================
//  RESERVADOS
// =========================

function verificarReservado(livroId) {
    if (!userId) {
        atualizarReservados(false, livroId);
        return;
    }

    fetch(`http://localhost:3000/reservados/${userId}`)
        .then(res => res.json())
        .then(reservados => {
            const jaReservado = reservados.some(r => r.livro_id == livroId);
            atualizarReservados(jaReservado, livroId);
        })
        .catch(err => {
            console.error("Erro ao verificar reservado:", err);
            atualizarReservados(false, livroId);
        });
}

function atualizarReservados(jaReservado, livroId) {
    const btnReservar = document.querySelector('.reservar button');

    if (jaReservado) {
        btnReservar.innerHTML = '📖 Reservado';
        btnReservar.style.backgroundColor = '#3651c9';
        btnReservar.style.color = 'white';
        btnReservar.onclick = () => removerReserva(livroId);
    } else {
        btnReservar.innerHTML = '📖 Reservar';
        btnReservar.style.backgroundColor = '';
        btnReservar.style.color = '';
        if (!userId) {
            btnReservar.onclick = () => promptLogin('reservar este livro');
        } else {
            btnReservar.onclick = () => adicionarReservado(livroId);
        }
    }
}

function adicionarReservado(livroId) {
    if (!userId) {
        promptLogin('reservar este livro');
        return;
    }
    const btnReservar = document.querySelector('.reservar button');
    btnReservar.disabled = true;
    btnReservar.innerHTML = 'Adicionando...';

    fetch('http://localhost:3000/reservados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario_id: userId,
            livro_id: livroId
        })
    })
        .then(res => res.json())
        .then(data => {
            Swal.fire({
                title: data.message,
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            btnReservar.disabled = false;
            verificarReservado(livroId);
        })
        .catch(err => {
            console.error("Erro ao adicionar reservado:", err);
            Swal.fire({
                icon: "warning",
                title: "Erro ao adicionar aos reservados",
                showConfirmButton: false,
                timer: 1500
            });
            btnReservar.disabled = false;
            atualizarReservados(false, livroId);
        });
}

function removerReserva(livroId) {
    Swal.fire({
        title: "Deseja remover este livro dos reservados?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, remover",
        cancelButtonText: "Não",
    }).then((result) => {
        if (!result.isConfirmed) return;

        const btnReservar = document.querySelector('.reservar button');
        btnReservar.disabled = true;
        btnReservar.innerHTML = 'Removendo...';

        fetch(`http://localhost:3000/reservados/${userId}/${livroId}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {

                Swal.fire({
                    title: data.message || "Removido dos reservados!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                btnReservar.disabled = false;
                btnReservar.innerHTML = 'Reservar';

                atualizarReservados(false, livroId);
            })
            .catch(err => {
                console.error("Erro ao remover reservado:", err);

                Swal.fire({
                    title: "Erro ao remover dos reservados",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false
                });

                btnReservar.disabled = false;
                atualizarReservados(true, livroId);
            });
    });
}