document.getElementById('btnBotao').addEventListener('click', async () => {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value.trim();

    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('CPF:', cpf);
    console.log('Senha:', senha);

    // Validações
    if (!nome) {
        alert('Por favor, preencha o campo de nome!');
        return;
    }

    if (!email) {
        alert('Por favor, preencha o campo de e-mail!');
        return;
    }

    // validação simples de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, informe um e-mail válido!');
        return;
    }

    if (!cpf) {
        alert('Por favor, preencha o campo de CPF!');
        return;
    }

    // validação simples de CPF (apenas dígitos, mínimo 11)
    const cpfDigits = cpf.replace(/\D/g, '');
    if (cpfDigits.length < 11) {
        alert('Por favor, informe um CPF válido (mínimo 11 dígitos)!');
        return;
    }

    if (!senha) {
        alert('Por favor, preencha o campo de senha!');
        return;
    }

    if (senha.length < 8) {
        alert('A senha deve ter no mínimo 8 caracteres!');
        return;
    }

    try {
        console.log('Enviando requisição para http://localhost:3000/cadastro');

        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                cpf: cpfDigits,
                senha: senha
            })
        });

        console.log('Response status:', response.status);

        const data = await response.json();

        console.log('Response data:', data);

        if (response.ok && data.success) {
            alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
            
            // Aguarda um segundo e redireciona
            setTimeout(() => {
                window.location.href = '../1 - Login/login.html';
            }, 1500);
        } else {
            alert(data.message || 'Erro ao realizar cadastro. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro completo:', error);
        alert('Erro ao conectar com o servidor. Verifique se ele está rodando.');
    }
});
