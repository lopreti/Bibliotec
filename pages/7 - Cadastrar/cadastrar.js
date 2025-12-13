const form = document.getElementById("formCadastro");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value.trim();

    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('CPF:', cpf);
    console.log('Senha:', senha);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });

    // Validações
    if (!nome) {
        Toast.fire('Por favor, preencha o campo de nome!');
        return;
    }

    if (!email) {
        Toast.fire('Por favor, preencha o campo de e-mail!');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Toast.fire('Por favor, informe um e-mail válido!');
        return;
    }

    if (!cpf) {
        Toast.fire('Por favor, preencha o campo de CPF!');
        return;
    }

    const cpfDigits = cpf.replace(/\D/g, '');
    if (cpfDigits.length < 11) {
        Toast.fire('Por favor, informe um CPF válido (mínimo 11 dígitos)!');
        return;
    }

    if (!senha) {
        Toast.fire('Por favor, preencha o campo de senha!');
        return;
    }

    if (senha.length < 8) {
        Toast.fire('A senha deve ter no mínimo 8 caracteres!');
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
            Swal.fire({
                title: "Cadastro realizado com sucesso!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            setTimeout(() => {
                window.location.href = '/pages/1 - Login/login.html';
            }, 1500);

        } else {
            Toast.fire(data.message || 'Erro ao realizar cadastro. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro completo:', error);
        Toast.fire('Erro ao conectar com o servidor. Verifique se ele está rodando.');
    }
});
