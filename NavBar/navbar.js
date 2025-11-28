async function carregarLayout() {

    try {
        const response = await fetch('/NavBar/navbar.html');
        const layout = await response.text(); 
        document.body.insertAdjacentHTML("afterbegin", layout);

    } catch (erro) {
        console.error("Erro ao carregar o layout:", erro);
    }
}

carregarLayout();