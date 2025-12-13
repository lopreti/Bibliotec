// Dados globais
let usuarioLogado = null;
let todosLivros = [];
let todasReservas = [];
let perfilOriginal = {};

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
  verificarPermissoes();
});

// Verificar se o usuário é admin
async function verificarPermissoes() {
  usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
  
  if (!usuarioLogado) {
    alert('Você precisa estar logado!');
    window.location.href = '../1 - Login/login.html';
    return;
  }
  
  if (usuarioLogado.is_admin !== 1 && usuarioLogado.is_admin !== true) {
    alert('Acesso negado! Apenas administradores.');
    window.location.href = '../2 - Principal/principal.html';
    return;
  }
  
  // Mostrar conteúdo admin
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = 'block';
  });
  
  // Mostrar nome do admin no header
  document.getElementById('nome-admin').textContent = usuarioLogado.nome;
  
  // Carregar dados iniciais
  mostrarSecao('livros', document.querySelector('.btn-menu.active'));
}

// ==================== NAVEGAÇÃO ENTRE SEÇÕES ====================
function mostrarSecao(secao, botaoClicado) {
  // Esconder todas as seções
  document.querySelectorAll('.secao').forEach(s => s.style.display = 'none');
  
  // Remover classe active de todos os botões
  document.querySelectorAll('.btn-menu').forEach(btn => btn.classList.remove('active'));
  
  // Mostrar seção selecionada
  const secaoEl = document.getElementById(`secao-${secao}`);
  if (secaoEl) {
    secaoEl.style.display = 'block';
  }
  
  // Adicionar classe active no botão correspondente
  if (botaoClicado) {
    botaoClicado.classList.add('active');
  }
  
  // Carregar dados da seção
  switch(secao) {
    case 'usuarios':
      carregarUsuarios();
      break;
    case 'livros':
      carregarLivros();
      break;
    case 'reservas':
      carregarReservas();
      break;
    case 'retiradas':
      carregarReservasPendentes();
      break;
    case 'perfil':
      carregarPerfil();
      break;
  }
}

// ==================== GERENCIAR USUÁRIOS ====================
async function carregarUsuarios() {
  const container = document.getElementById('usuarios-container');
  container.innerHTML = '<div class="loading">Carregando usuários...</div>';
  
  try {
    const response = await fetch('http://localhost:3000/usuarios');
    
    if (!response.ok) throw new Error('Erro ao carregar usuários');
    
    const usuarios = await response.json();
    mostrarUsuarios(usuarios);
    
  } catch (erro) {
    console.error('Erro:', erro);
    container.innerHTML = '<div class="error">Erro ao carregar usuários.</div>';
  }
}

function mostrarUsuarios(usuarios) {
  const container = document.getElementById('usuarios-container');
  
  if (usuarios.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhum usuário encontrado.</p></div>';
    return;
  }
  
  container.innerHTML = '';
  
  usuarios.forEach(usuario => {
    const isAdmin = usuario.is_admin === 1 || usuario.is_admin === true;
    const badge = isAdmin 
      ? '<span class="admin-badge">ADMIN</span>'
      : '<span class="user-badge">USUÁRIO</span>';
    
    const div = document.createElement('div');
    div.className = 'usuario-item';
    div.innerHTML = `
      <div class="usuario-info">
        <strong>${usuario.nome}</strong>
        <span>${usuario.email}</span>
        ${badge}
      </div>
      <div class="usuario-acoes">
        ${isAdmin 
          ? `<button onclick="removerAdmin(${usuario.usuario_id})" class="btn-remover-admin">Remover Admin</button>`
          : `<button onclick="tornarAdmin(${usuario.usuario_id})" class="btn-tornar-admin">Tornar Admin</button>`
        }
        <button onclick="deletarUsuario(${usuario.usuario_id})" class="btn-deletar">Deletar</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function tornarAdmin(usuarioId) {
  if (!confirm('Tornar este usuário administrador?')) return;
  
  try {
    const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}/admin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_admin: true })
    });
    
    if (!response.ok) throw new Error('Erro ao promover usuário');
    
    alert('Usuário promovido a administrador!');
    carregarUsuarios();
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao promover usuário.');
  }
}

async function removerAdmin(usuarioId) {
  if (!confirm('Remover privilégios de administrador?')) return;
  
  try {
    const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}/admin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_admin: false })
    });
    
    if (!response.ok) throw new Error('Erro');
    
    alert('Privilégios removidos!');
    carregarUsuarios();
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao remover privilégios.');
  }
}

async function deletarUsuario(usuarioId) {
  if (!confirm('ATENÇÃO: Deletar este usuário permanentemente?')) return;
  
  try {
    const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Erro');
    
    alert('Usuário deletado!');
    carregarUsuarios();
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao deletar usuário.');
  }
}

// ==================== GERENCIAR LIVROS (RF02, RF03, RF04, RF08, RF11, RF12) ====================
async function carregarLivros() {
  const container = document.getElementById('livros-container');
  container.innerHTML = '<div class="loading">Carregando livros...</div>';
  
  try {
    const response = await fetch('http://localhost:3000/livros');
    
    if (!response.ok) throw new Error('Erro ao carregar livros');
    
    todosLivros = await response.json();
    mostrarLivros(todosLivros);
    
  } catch (erro) {
    console.error('Erro:', erro);
    container.innerHTML = '<div class="error">Erro ao carregar livros.</div>';
  }
}

function mostrarLivros(livros) {
  const container = document.getElementById('livros-container');
  
  if (livros.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhum livro encontrado.</p></div>';
    return;
  }
  
  container.innerHTML = '';
  
  livros.forEach(livro => {
    const div = document.createElement('div');
    div.className = 'livro-item';
    div.innerHTML = `
      <div class="livro-info">
        <strong>${livro.titulo}</strong>
        <span>Autor: ${livro.autor}</span>
        <span>Ano: ${livro.publicado_ano || 'N/A'} | Páginas: ${livro.quant_paginas || 'N/A'}</span>
      </div>
      <div class="livro-acoes">
        <button onclick="verDetalhesLivro(${livro.livro_id})" class="btn-detalhes">Ver Detalhes</button>
        <button onclick="editarLivro(${livro.livro_id})" class="btn-editar-item">Editar</button>
        <button onclick="excluirLivro(${livro.livro_id})" class="btn-deletar">Excluir</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// RF02 - Cadastrar livro
function abrirModalCadastrarLivro() {
  document.getElementById('modal-titulo').textContent = 'Cadastrar Novo Livro';
  document.getElementById('form-livro').reset();
  document.getElementById('livro-id').value = '';
  document.getElementById('modal-livro').style.display = 'block';
}

// RF03 - Editar livro
async function editarLivro(livroId) {
  try {
    const response = await fetch(`http://localhost:3000/livros/${livroId}`);
    
    if (!response.ok) throw new Error('Erro');
    
    const livro = await response.json();
    
    document.getElementById('modal-titulo').textContent = 'Editar Livro';
    document.getElementById('livro-id').value = livro.livro_id;
    document.getElementById('livro-titulo').value = livro.titulo;
    document.getElementById('livro-autor').value = livro.autor;
    document.getElementById('livro-isbn').value = livro.isbn || '';
    document.getElementById('livro-editora').value = livro.editora || '';
    document.getElementById('livro-ano').value = livro.publicado_ano || '';
    document.getElementById('livro-categoria').value = livro.categorias || '';
    document.getElementById('livro-quantidade').value = livro.quant_paginas || '';
    document.getElementById('livro-localizacao').value = livro.idioma || '';
    document.getElementById('livro-descricao').value = livro.descricao || '';
    
    document.getElementById('modal-livro').style.display = 'block';
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao carregar dados do livro.');
  }
}

async function salvarLivro(event) {
  event.preventDefault();
  
  const livroId = document.getElementById('livro-id').value;
  const dados = {
    titulo: document.getElementById('livro-titulo').value,
    autor: document.getElementById('livro-autor').value,
    descricao: document.getElementById('livro-descricao').value,
    publicado_ano: document.getElementById('livro-ano').value,
    quant_paginas: document.getElementById('livro-quantidade').value,
    idioma: document.getElementById('livro-localizacao').value
  };
  
  try {
    const url = livroId ? `http://localhost:3000/livros/${livroId}` : 'http://localhost:3000/livros';
    const method = livroId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });
    
    if (!response.ok) throw new Error('Erro');
    
    alert(livroId ? 'Livro atualizado!' : 'Livro cadastrado!');
    fecharModalLivro();
    carregarLivros();
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao salvar livro.');
  }
}

function fecharModalLivro() {
  document.getElementById('modal-livro').style.display = 'none';
}

// RF08 - Ver detalhes do livro
async function verDetalhesLivro(livroId) {
  try {
    const response = await fetch(`http://localhost:3000/livros/${livroId}`);
    
    if (!response.ok) throw new Error('Erro');
    
    const livro = await response.json();
    
    const detalhesHTML = `
      <p><strong>Título:</strong> ${livro.titulo}</p>
      <p><strong>Autor:</strong> ${livro.autor}</p>
      <p><strong>Ano:</strong> ${livro.publicado_ano || 'Não informado'}</p>
      <p><strong>Páginas:</strong> ${livro.quant_paginas || 'Não informado'}</p>
      <p><strong>Idioma:</strong> ${livro.idioma || 'Não informado'}</p>
      <p><strong>Categorias:</strong> ${livro.categorias || 'Sem categoria'}</p>
      <p><strong>Descrição:</strong> ${livro.descricao || 'Sem descrição'}</p>
    `;
    
    document.getElementById('detalhes-livro-content').innerHTML = detalhesHTML;
    document.getElementById('modal-detalhes-livro').style.display = 'block';
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao carregar detalhes.');
  }
}

function fecharModalDetalhes() {
  document.getElementById('modal-detalhes-livro').style.display = 'none';
}

// RF12 - Excluir livro
async function excluirLivro(livroId) {
  if (!confirm('ATENÇÃO: Excluir este livro permanentemente?')) return;
  
  try {
    const response = await fetch(`http://localhost:3000/livros/${livroId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Erro');
    
    alert('Livro excluído!');
    carregarLivros();
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao excluir livro.');
  }
}

// Filtrar livros
function filtrarLivros() {
  const busca = document.getElementById('busca-livro').value.toLowerCase();
  
  let livrosFiltrados = todosLivros;
  
  if (busca) {
    livrosFiltrados = livrosFiltrados.filter(l => 
      l.titulo.toLowerCase().includes(busca) ||
      l.autor.toLowerCase().includes(busca)
    );
  }
  
  mostrarLivros(livrosFiltrados);
}

// ==================== RF06 - VER RESERVAS ====================
async function carregarReservas() {
  const container = document.getElementById('reservas-container');
  container.innerHTML = '<div class="loading">Carregando reservas...</div>';
  
  try {
    const response = await fetch('http://localhost:3000/reservas/todas');
    
    if (!response.ok) throw new Error('Erro ao carregar reservas');
    
    todasReservas = await response.json();
    mostrarReservas(todasReservas);
    
  } catch (erro) {
    console.error('Erro:', erro);
    container.innerHTML = '<div class="error">Erro ao carregar reservas. Rota não implementada no backend.</div>';
  }
}

function mostrarReservas(reservas) {
  const container = document.getElementById('reservas-container');
  
  if (reservas.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhuma reserva encontrada.</p></div>';
    return;
  }
  
  container.innerHTML = '';
  
  reservas.forEach(reserva => {
    const div = document.createElement('div');
    div.className = 'reserva-item';
    div.innerHTML = `
      <div class="reserva-info">
        <strong>Livro: ${reserva.titulo}</strong>
        <span>Usuário: ${reserva.usuario_nome}</span>
        <span>Reservado em: ${formatarData(reserva.data_reserva)}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// ==================== RF07 - REGISTRAR RETIRADA ====================
async function carregarReservasPendentes() {
  try {
    const response = await fetch('http://localhost:3000/reservas/pendentes');
    
    if (!response.ok) throw new Error('Erro');
    
    const reservas = await response.json();
    
    const select = document.getElementById('select-reserva');
    select.innerHTML = '<option value="">Selecione uma reserva...</option>';
    
    reservas.forEach(reserva => {
      const option = document.createElement('option');
      option.value = reserva.reserva_id;
      option.dataset.usuario = reserva.usuario_nome;
      option.dataset.livro = reserva.livro_titulo;
      option.dataset.data = reserva.data_reserva;
      option.textContent = `${reserva.livro_titulo} - ${reserva.usuario_nome}`;
      select.appendChild(option);
    });
    
  } catch (erro) {
    console.error('Erro:', erro);
    document.querySelector('#secao-retiradas').innerHTML = '<h2>Registrar Retirada</h2><div class="error">Rota não implementada no backend.</div>';
  }
}

function preencherDadosRetirada() {
  const select = document.getElementById('select-reserva');
  const option = select.options[select.selectedIndex];
  
  if (!option.value) {
    document.getElementById('dados-retirada').style.display = 'none';
    return;
  }
  
  document.getElementById('retirada-usuario').textContent = option.dataset.usuario;
  document.getElementById('retirada-livro').textContent = option.dataset.livro;
  document.getElementById('retirada-data-reserva').textContent = formatarData(option.dataset.data);
  
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('data-retirada').value = hoje;
  
  const devolucao = new Date();
  devolucao.setDate(devolucao.getDate() + 7);
  document.getElementById('data-devolucao-prevista').value = devolucao.toISOString().split('T')[0];
  
  document.getElementById('dados-retirada').style.display = 'block';
}

async function registrarRetirada() {
  const reservaId = document.getElementById('select-reserva').value;
  const dataRetirada = document.getElementById('data-retirada').value;
  const dataDevolucao = document.getElementById('data-devolucao-prevista').value;
  
  if (!reservaId || !dataRetirada || !dataDevolucao) {
    alert('Preencha todos os campos!');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:3000/retiradas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reserva_id: reservaId,
        data_retirada: dataRetirada,
        data_devolucao_prevista: dataDevolucao
      })
    });
    
    if (!response.ok) throw new Error('Erro');
    
    alert('Retirada registrada com sucesso!');
    document.getElementById('dados-retirada').style.display = 'none';
    document.getElementById('select-reserva').value = '';
    carregarReservasPendentes();
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao registrar retirada. Rota não implementada no backend.');
  }
}

// ==================== RF09 e RF10 - PERFIL ====================
async function carregarPerfil() {
  try {
    const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.usuario_id}`);
    
    if (!response.ok) throw new Error('Erro');
    
    const perfil = await response.json();
    perfilOriginal = { ...perfil };
    
    document.getElementById('perfil-nome').value = perfil.nome;
    document.getElementById('perfil-email').value = perfil.email;
    document.getElementById('perfil-cpf').value = perfil.CPF || perfil.cpf;
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao carregar perfil.');
  }
}

function habilitarEdicaoPerfil() {
  document.getElementById('perfil-nome').disabled = false;
  document.getElementById('perfil-email').disabled = false;
  document.getElementById('btn-editar-perfil').style.display = 'none';
  document.getElementById('botoes-salvar-perfil').style.display = 'flex';
}

function cancelarEdicaoPerfil() {
  document.getElementById('perfil-nome').value = perfilOriginal.nome;
  document.getElementById('perfil-email').value = perfilOriginal.email;
  document.getElementById('perfil-nome').disabled = true;
  document.getElementById('perfil-email').disabled = true;
  document.getElementById('btn-editar-perfil').style.display = 'block';
  document.getElementById('botoes-salvar-perfil').style.display = 'none';
}

async function salvarPerfil() {
  const dados = {
    nome: document.getElementById('perfil-nome').value,
    email: document.getElementById('perfil-email').value
  };
  
  try {
    const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.usuario_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });
    
    if (!response.ok) throw new Error('Erro');
    
    alert('Perfil atualizado com sucesso!');
    
    usuarioLogado.nome = dados.nome;
    usuarioLogado.email = dados.email;
    localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
    
    document.getElementById('nome-admin').textContent = dados.nome;
    
    cancelarEdicaoPerfil();
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao atualizar perfil.');
  }
}

async function alterarSenha() {
  const senhaAtual = document.getElementById('senha-atual').value;
  const senhaNova = document.getElementById('senha-nova').value;
  const senhaConfirmar = document.getElementById('senha-confirmar').value;
  
  if (!senhaAtual || !senhaNova || !senhaConfirmar) {
    alert('Preencha todos os campos!');
    return;
  }
  
  if (senhaNova !== senhaConfirmar) {
    alert('As senhas não coincidem!');
    return;
  }
  
  if (senhaNova.length < 8) {
    alert('A nova senha deve ter no mínimo 8 caracteres!');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:3000/usuarios/alterar-senha', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario_id: usuarioLogado.usuario_id,
        senha_atual: senhaAtual,
        senha_nova: senhaNova
      })
    });
    
    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.message || 'Erro ao alterar senha');
    }
    
    alert('Senha alterada com sucesso!');
    document.getElementById('senha-atual').value = '';
    document.getElementById('senha-nova').value = '';
    document.getElementById('senha-confirmar').value = '';
    
  } catch (erro) {
    console.error('Erro:', erro);
    alert(erro.message);
  }
}

// ==================== UTILITÁRIOS ====================
function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
}

function logout() {
  if (confirm('Tem certeza que deseja sair?')) {
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioLogin');
    window.location.href = '../1 - Login/login.html';
  }
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
  const modalLivro = document.getElementById('modal-livro');
  const modalDetalhes = document.getElementById('modal-detalhes-livro');
  
  if (event.target === modalLivro) {
    fecharModalLivro();
  }
  if (event.target === modalDetalhes) {
    fecharModalDetalhes();
  }
}