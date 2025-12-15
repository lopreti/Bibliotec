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
                identifier: identifierValue,
                senha: senhaValue
            })
        });

        console.log('Response status:', response.status);

        const data = await response.json();

        console.log('Response data:', data);

        if (response.ok && data.success) {
            
            const isAdmin = data.is_admin === 1 || data.is_admin === true;
            
            if (isAdmin) {
                localStorage.setItem('adminId', data.usuario_id);
                localStorage.setItem('adminLogin', data.nome || data.email || identifierValue);
                
                console.log('Admin logado! ID:', data.usuario_id);
                
            } else {
                localStorage.setItem('usuarioId', data.usuario_id);
                localStorage.setItem('usuarioLogin', data.nome || data.email || identifierValue);
                
                localStorage.setItem('usuario', JSON.stringify({
                    usuario_id: data.usuario_id,
                    nome: data.nome,
                    email: data.email,
                    CPF: data.CPF,
                    is_admin: data.is_admin
                }));
                
                console.log('Usuário comum logado! ID:', data.usuario_id);
            }
            
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

            setTimeout(() => {
                if (isAdmin) {
                    console.log('Redirecionando admin para painel...');
                    window.location.href = '/adminPage/1.Gerenciar Livros/gerenciarLivros.html'; 
                } else {l
                    console.log('Redirecionando usuário para página principal...');
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
            timer: 3000, 
            showConfirmButton: false
        });
    }
});