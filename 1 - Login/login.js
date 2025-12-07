// clicar no enter e ja envia as respostas
const identifier = document.getElementById("identifier");
const senha = document.getElementById("senha");
const btn = document.getElementById("btnBotao");

document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        btn.click();     
    }
});


document.getElementById('btnBotao').addEventListener('click', async () => {
    const identifier = document.getElementById('identifier').value.trim();
    const senha = document.querySelector('input[type="password"]').value.trim();

    console.log('Identifier:', identifier);
    console.log('Senha:', senha);


    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });

    // Validação básica
    if (!identifier || !senha) {
        Toast.fire('Por favor, preencha todos os campos!');
        return;
    }

    try {
        console.log('Enviando requisição para http://localhost:3000/login');

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier: identifier,
                senha: senha
            })
        });

        console.log('Response status:', response.status);

        const data = await response.json();

        console.log('Response data:', data);

        if (response.ok && data.success) {
            // Armazena o usuário no localStorage (nome usado para iniciais)
            localStorage.setItem('usuarioId', data.usuario_id);
            localStorage.setItem('usuarioLogin', data.nome || data.email || identifier);

            console.log('Login bem-sucedido, redirecionando...');

            window.location.href = '../2 - Principal/principal.html';
        } else {
            Toast.fire(data.message || 'Erro ao fazer login. Verifique suas credenciais.');
        }
    } catch (error) {
        console.error('Erro completo:', error);
        Toast.fire('Erro ao conectar com o servidor. Verifique se ele está rodando.');
    }
});
