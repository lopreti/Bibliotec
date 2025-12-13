// O listener para a tecla 'Enter' está correto
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
    // Captura os valores do formulário
    const identifierValue = document.getElementById('identifier').value.trim();
    const senhaValue = document.querySelector('input[type="password"]').value.trim();

    console.log('Identifier:', identifierValue);
    console.log('Senha:', senhaValue);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });

    // Validação básica
    if (!identifierValue || !senhaValue) {
        Toast.fire({
            title: 'Por favor, preencha todos os campos!',
            icon: 'warning'
        });
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
                // Usamos identifierValue e senhaValue na requisição
                identifier: identifierValue,
                senha: senhaValue
            })
        });

        console.log('Response status:', response.status);

        const data = await response.json();

        console.log('Response data:', data);

        if (response.ok && data.success) {
            // Armazena os dados do usuário no localStorage
            localStorage.setItem('usuarioId', data.usuario_id);
            localStorage.setItem('usuarioLogin', data.nome || data.email || identifierValue);
            
            // Salvar dados completos do usuário
            localStorage.setItem('usuario', JSON.stringify({
                usuario_id: data.usuario_id,
                nome: data.nome,
                email: data.email,
                CPF: data.CPF,
                is_admin: data.is_admin
            }));
            
            // Se tiver token, salva também
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            console.log('Login bem-sucedido, redirecionando...');
            
            Toast.fire({
                title: 'Login realizado com sucesso!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            // ========== REDIRECIONAR BASEADO NO TIPO DE USUÁRIO ==========
            setTimeout(() => {
                if (data.is_admin === 1 || data.is_admin === true) {
                    // Se for admin, vai para o painel administrativo
                    // USAMOS 'gerenciarLivros.html' pois 'adm.html' não existe na sua lista
                    console.log('Usuário é admin, redirecionando para painel admin');
                    window.location.href = '/adminPage/gerenciarUsuarios.html'; 
                } else {
                    // Se for usuário comum, vai para página principal
                    // USAMOS CAMINHO ABSOLUTO para evitar problemas de "../"
                    console.log('Usuário comum, redirecionando para página principal');
                    window.location.href = '/pages/2 - Principal/principal.html'; 

                }
            }, 1500);

        } else {
            Toast.fire({
                title: (data.message || 'Erro ao fazer login. Verifique suas credenciais.'),
                icon: 'error',
                timer: 1500,
                showConfirmButton: false
            });
        }
    } catch (error) {
        console.error('Erro completo:', error);
        Swal.fire({
            title: 'Erro ao conectar com o servidor. Verifique se ele está rodando.',
            icon: 'error',
            // Aumentei o timer para dar tempo de ler a mensagem de erro crítico
            timer: 3000, 
            showConfirmButton: false
        });
    }
});