let todosOsLivros = [];
let currentIndex = 0; // índice do item central dentro da janela (buffer) exibida
const livrosPorPagina = 3;
let originalTitulo = '';
let originalMaisLivrosBg = '';
let originalSectionH2Display = '';

function restaurarLayoutOriginal() {
    document.querySelector(".livros").classList.add("carrossel");
    document.querySelector(".livros").innerHTML = "";
    
    // Mostra o carrossel e o botão "Ver mais" novamente
    document.getElementById('container').style.display = 'flex';
    document.getElementById('botao-veja-mais').style.display = 'block';
    document.getElementById('secao-mais-livros').style.display = 'block';
    document.getElementById('secao-mais-livros').style.marginTop = '150px';
    
    renderizarCarrousel();
    renderizarListaInferior();
    
    // Reattach evento do botão "Ver mais"
    document.getElementById('botao-veja-mais').addEventListener('click', () => {
        console.log("Clicou no botão Ver mais");
        const secao = document.getElementById('secao-mais-livros');
        secao.scrollIntoView({ behavior: 'smooth' });
    });
    // Restaurar título e fundo original
    const titulo = document.querySelector('h1');
    if (titulo && originalTitulo) titulo.textContent = originalTitulo;
    const secaoMais = document.getElementById('secao-mais-livros');
    if (secaoMais && originalMaisLivrosBg) secaoMais.style.backgroundColor = originalMaisLivrosBg;
    // Restaurar exibição do cabeçalho da seção "Todos os livros"
    const h2sec = document.querySelector('.mais-livros h2');
    if (h2sec && originalSectionH2Display) h2sec.style.display = originalSectionH2Display;
}

function renderizarCarrousel() {
    const containerLivros = document.querySelector(".livros");
    containerLivros.classList.add('carrossel');
    containerLivros.innerHTML = "";

    if (todosOsLivros.length === 0) {
        containerLivros.innerHTML = `<p style='text-align: center;'>Nenhum livro encontrado</p>`;
        return;
    }

    // Janela / buffer com os primeiros 5 (ou menos) livros usados para o carrossel
    const buffer = todosOsLivros.slice(0, Math.min(5, todosOsLivros.length));

    // Se houver menos de 3 no buffer, mostramos todos
    if (buffer.length <= 3) {
        buffer.forEach((l, posicao) => {
            const classeDestaque = posicao === Math.floor(buffer.length / 2) ? 'destaque' : '';
            containerLivros.innerHTML += `
                <div class="livro ${classeDestaque}">
                    <a href="../4 - Livro I/livro.html?id=${l.livro_id}&from=principal">
                        <img src="${l.capa_url}" alt="Capa do livro ${l.titulo}">
                    </a>
                    <h3>${l.titulo}</h3>
                    <p>${l.autor}</p>
                </div>`;
        });
        return;
    }

    // Buffer tem >=3 (normalmente 5). currentIndex representa o índice CENTRAL dentro do buffer
    // Garantir que currentIndex esteja dentro do buffer
    currentIndex = ((currentIndex % buffer.length) + buffer.length) % buffer.length;

    // Os índices visíveis são: centro-1, centro, centro+1 (circular dentro do buffer)
    const offsets = [-1, 0, 1];
    offsets.forEach((offset, posicao) => {
        const idx = ((currentIndex + offset + buffer.length) % buffer.length);
        const l = buffer[idx];
        const classeDestaque = offset === 0 ? 'destaque' : '';

        containerLivros.innerHTML += `
            <div class="livro ${classeDestaque}">
                <a href="../4 - Livro I/livro.html?id=${l.livro_id}&from=principal">
                    <img src="${l.capa_url}" alt="Capa do livro ${l.titulo}">
                </a>
                <h3>${l.titulo}</h3>
                <p>${l.autor}</p>
            </div>`;
    });

    // Re-anexa handlers para salvar contexto caso o usuário clique em um livro
    attachLivroLinksPrincipal();
}

function renderizarListaInferior() {
    const container = document.querySelector(".mais-livros .container");
    container.innerHTML = "";

    if (todosOsLivros.length === 0) {
        container.innerHTML = `<p style='text-align: center; grid-column: 1/-1;'>Nenhum livro encontrado</p>`;
        return;
    }

    todosOsLivros.forEach(l => {
        container.innerHTML += `
            <div class="livro">
                <a href="../4 - Livro I/livro.html?id=${l.livro_id}&from=principal">
                    <img src="${l.capa_url}" alt="Capa do livro ${l.titulo}">
                </a>
                <h3>${l.titulo}</h3>
                <p>${l.autor}</p>
               
        `;
    });
// ...
}

function aplicarLayoutPesquisa() {
    // Esconde o carrossel e o botão "Ver mais"
    document.getElementById('container').style.display = 'none';
    document.getElementById('botao-veja-mais').style.display = 'none';
    // Mostra a seção "Todos os Livros"
    const secaoMaisLivros = document.getElementById('secao-mais-livros');
    secaoMaisLivros.style.display = 'block';
    secaoMaisLivros.style.marginTop = '0';
    // Remove o fundo colorido ao mostrar resultados da pesquisa
    secaoMaisLivros.style.backgroundColor = 'transparent';
    // Ajusta o título para indicar que são todos os livros
    const titulo = document.querySelector('h1');
    if (titulo) titulo.textContent = 'TODOS OS LIVROS';
    // Esconde o cabeçalho da seção inferior para evitar duplicidade
    const h2sec = document.querySelector('.mais-livros h2');
    if (h2sec) h2sec.style.display = 'none';
}

function pesquisarLivros(termo) {
    const pesquisa = termo.toLowerCase().trim();

    if (pesquisa === "") {
        currentIndex = 0;
        // Restaura carrossel
        document.getElementById('container').style.display = 'flex';
        document.getElementById('botao-veja-mais').style.display = 'block';
        document.getElementById('secao-mais-livros').style.display = 'none';
        restaurarLayoutOriginal();
        return;
    }

    const filtrados = todosOsLivros.filter(l =>
        l.titulo.toLowerCase().includes(pesquisa) ||
        l.autor.toLowerCase().includes(pesquisa)
    );

    aplicarLayoutPesquisa();

    const container = document.querySelector(".mais-livros .container");
    container.innerHTML = "";

    if (filtrados.length === 0) {
        container.innerHTML = `<p style='text-align: center; grid-column: 1/-1;'>Nenhum livro encontrado</p>`;
        return;
    }

    // ...
    filtrados.forEach(l => {
        container.innerHTML += `
            <div class="livro">
                <a href="../4 - Livro I/livro.html?id=${l.livro_id}&from=principal">
                    <img src="${l.capa_url}" alt="Capa do livro ${l.titulo}">
                </a>
                <h3>${l.titulo}</h3>
                <p>${l.autor}</p>
               
        `;
    });
// ...
}

function inicializar() {
    // Theme support removed: dark-mode initialization deleted per request.

    fetch("http://localhost:3000/livros")
        .then(res => res.json())
        .then(livros => {
            todosOsLivros = livros;
            console.log("Livros carregados:", todosOsLivros);

                // Inicializa o índice central do carrossel: se houver >=5 livros, centralizamos no 3º (índice 2)
                if (todosOsLivros.length >= 5) {
                    currentIndex = 2;
                } else {
                    currentIndex = Math.floor(todosOsLivros.length / 2);
                }

            renderizarCarrousel();
            renderizarListaInferior();

            // Guarda título e fundo originais para restaurar depois
            const tituloEl = document.querySelector('h1');
            if (tituloEl) originalTitulo = tituloEl.textContent;
            const secaoMais = document.getElementById('secao-mais-livros');
            if (secaoMais) originalMaisLivrosBg = window.getComputedStyle(secaoMais).backgroundColor;
            // Guarda display original do h2 da seção "mais livros"
            const h2sec = document.querySelector('.mais-livros h2');
            if (h2sec) originalSectionH2Display = window.getComputedStyle(h2sec).display;

            document.getElementById('next-btn').addEventListener("click", () => {
                // Avança o centro dentro do buffer de até 5 itens
                const bufferLen = Math.min(5, todosOsLivros.length);
                currentIndex = (currentIndex + 1) % bufferLen;
                renderizarCarrousel();
            });

            document.getElementById('prev-btn').addEventListener("click", () => {
                const bufferLen = Math.min(5, todosOsLivros.length);
                currentIndex = (currentIndex - 1 + bufferLen) % bufferLen;
                renderizarCarrousel();
            });
        })
        .catch(err => console.error("Erro ao buscar livros:", err));

    document.querySelector(".barra-pesquisa input")
        .addEventListener("input", e => pesquisarLivros(e.target.value));
    
    document.getElementById('botao-veja-mais').addEventListener('click', () => {
        console.log("Clicou no botão Ver mais");
        const secao = document.getElementById('secao-mais-livros');
        secao.scrollIntoView({ behavior: 'smooth' });
    });

    // Se houver um valor de restauração de scroll (quando vindo de um livro), aplica-o
    const restore = sessionStorage.getItem('restoreScroll');
    if (restore) {
        try {
            const y = parseInt(restore, 10);
            window.scrollTo({ top: y, behavior: 'instant' });
        } catch (e) { /* ignore */ }
        sessionStorage.removeItem('restoreScroll');
    }

    // Anexa handlers nas âncoras para armazenar o contexto atual antes de navegar para a página do livro
    function attachLivroLinks() {
        document.querySelectorAll('.livros a, .mais-livros .container a').forEach(a => {
            a.addEventListener('click', () => {
                sessionStorage.setItem('returnContext', JSON.stringify({ from: 'principal', scrollY: window.scrollY }));
            });
        });
        // Re-anexa handlers após renderizar a lista inferior
        attachLivroLinksPrincipal();
        // Re-anexa handlers após render de pesquisa
        attachLivroLinksPrincipal();
    }

    // Helper para anexar handlers que salvam contexto antes de navegar ao livro
    function attachLivroLinksPrincipal() {
        document.querySelectorAll('.livros a, .mais-livros .container a').forEach(a => {
            // evita múltiplos listeners
            a.replaceWith(a.cloneNode(true));
        });
        document.querySelectorAll('.livros a, .mais-livros .container a').forEach(a => {
            a.addEventListener('click', () => {
                sessionStorage.setItem('returnContext', JSON.stringify({ from: 'principal', scrollY: window.scrollY }));
            });
        });
    }

    // Chame após renderizações
    attachLivroLinks();
}

document.addEventListener("DOMContentLoaded", inicializar);