document.addEventListener('DOMContentLoaded', function () {
  const btnAbrir = document.getElementById('btnAbrirChamado');
  const formSection = document.getElementById('formNovoChamado');
  const formChamado = document.getElementById('formChamado');
  const formEditar = document.getElementById('formEditarChamado');
  const lista = document.getElementById('listaChamados');

  const statusEtapas = ['Aberto', 'Em andamento', 'Resolvido', 'Fechado'];

  // Alternar exibição do formulário
  btnAbrir.addEventListener('click', () => {
    formSection.style.display = formSection.style.display === 'none' ? 'block' : 'none';
  });

  // Submissão do novo chamado
  formChamado.addEventListener('submit', async function (event) {
    event.preventDefault();

    const chamado = {
      titulo: document.getElementById("titulo").value,
      descricao: document.getElementById("descricao").value,
      stats: 'Aberto',
      prioridade: document.getElementById("prioridade").value,
      data_criacao: new Date().toISOString().split('T')[0],
      data_conclusao: null,
      fk_Usuario_id: 1,
      fk_Categoria_id: 1,
      tecnico_id: localStorage.getItem("tecnicoId") || 1
    };

    try {
      const response = await fetch('http://localhost:3000/chamado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chamado)
      });

      const data = await response.json();
      if (response.ok) {
        alert("Chamado criado com sucesso!");
        location.reload();
      } else {
        alert("Erro ao criar chamado: " + data.erro);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  });

  // Botão "Editar chamado" só aparece se tipo for técnico
  const tipo = localStorage.getItem("tipo");
  if (tipo === "tecnico") {
    const botaoAtualizar = document.createElement("button");
    botaoAtualizar.id = "botaoAtualizar";
    botaoAtualizar.textContent = "Atualizar chamado";
    botaoAtualizar.classList.add("btn");
    const container = document.getElementById("botoesContainer");
    container.appendChild(botaoAtualizar);
  }

  // Carregar e listar chamados
  fetch('http://localhost:3000/chamados/ativos')
    .then(res => res.json())
    .then(chamados => {
      chamados.forEach(chamado => {
        const card = document.createElement('div');
        card.className = 'pedidoCard';
        card.dataset.id = chamado.id;

        card.innerHTML = `
          <p><strong>Tipo:</strong> ${chamado.fk_Categoria_id}</p>
          <p><strong>Descrição:</strong> ${chamado.descricao}</p>
          <p><strong>Título:</strong> ${chamado.titulo}</p>
          <p><strong>Prioridade:</strong> ${chamado.prioridade}</p>
          <p class="status" data-status-index="${statusEtapas.indexOf(chamado.stats)}"><strong>Status:</strong> ${chamado.stats}</p>
        `;

        const btnStatus = document.createElement('button');
        btnStatus.className = 'btn btnStatus';
        btnStatus.textContent = 'Atualizar Status';
        if (chamado.stats === 'Fechado') {
          btnStatus.disabled = true;
          btnStatus.textContent = 'Pedido Fechado';
        }

        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn btnEditar';
        btnEditar.textContent = 'Editar Chamado';
        btnEditar.dataset.id = chamado.id;

        card.appendChild(btnStatus);
        if (tipo === 'tecnico') card.appendChild(btnEditar);

        lista.appendChild(card);
      });
    });

  // Atualizar Status
  lista.addEventListener('click', function (event) {
    if (event.target.classList.contains('btnStatus')) {
      const card = event.target.closest('.pedidoCard');
      const statusEl = card.querySelector('.status');
      let currentIndex = parseInt(statusEl.dataset.statusIndex, 10);
      const chamadoId = card.dataset.id;

      if (currentIndex < statusEtapas.length - 1) {
        currentIndex++;
        const novoStatus = statusEtapas[currentIndex];
        statusEl.dataset.statusIndex = currentIndex;
        statusEl.innerHTML = `<strong>Status:</strong> ${novoStatus}`;

        if (novoStatus === 'Fechado') {
          event.target.disabled = true;
          event.target.textContent = 'Pedido Fechado';
          setTimeout(() => {
            location.reload();
            alert("Chamado com status fechado foi finalizado");
          }, 6000);
          
        }

        fetch(`http://localhost:3000/chamados/${chamadoId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ novoStatus })
        }).then(res => res.json())
          .then(data => console.log('Status atualizado:', data))
          .catch(err => console.error('Erro ao atualizar status:', err));
      }
    }
  });

  // Abrir formulário de edição
  lista.addEventListener('click', function (event) {
    if (event.target.classList.contains('btnEditar')) {
      const card = event.target.closest('.pedidoCard');
      const chamadoId = card.dataset.id;

      document.getElementById('editarTitulo').value = card.querySelector('p:nth-child(3)').textContent.replace('Título:', '').trim();
      document.getElementById('editarDescricao').value = card.querySelector('p:nth-child(2)').textContent.replace('Descrição:', '').trim();
      document.getElementById('editarStatus').value = card.querySelector('.status').textContent.replace('Status:', '').trim();
      document.getElementById('editarPrioridade').value = card.querySelector('p:nth-child(4)').textContent.replace('Prioridade:', '').trim().toLowerCase();

      formEditar.dataset.id = chamadoId;
      formEditar.style.display = 'block';
      window.scrollTo(0, formEditar.offsetTop);
    }
  });

  // Cancelar edição
  document.getElementById('cancelarEdicao').addEventListener('click', () => {
    formEditar.style.display = 'none';
  });

  // Enviar edição
  formEditar.addEventListener('submit', function (event) {
    event.preventDefault();

    const id = this.dataset.id;
    const dadosAtualizados = {
      titulo: document.getElementById('editarTitulo').value,
      descricao: document.getElementById('editarDescricao').value,
      stats: document.getElementById('editarStatus').value,
      prioridade: document.getElementById('editarPrioridade').value
    };

    fetch(`http://localhost:3000/chamados/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAtualizados)
    })
      .then(res => res.json())
      .then(() => {
        alert('Chamado atualizado com sucesso!');
        formEditar.style.display = 'none';
        location.reload();

      })
      .catch(err => {
        console.error(err);
        alert('Erro ao atualizar chamado');
      });
  });
});
