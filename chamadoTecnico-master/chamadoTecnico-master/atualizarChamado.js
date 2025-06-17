document.addEventListener('DOMContentLoaded', function () {
  const lista = document.getElementById('listaChamados');
  const statusEtapas = ['Aberto', 'Em andamento', 'Resolvido', 'Fechado'];

  // Buscar chamados que não estão fechados
  fetch('http://localhost:3000/chamados/ativos')
    .then(response => response.json())
    .then(chamados => {
      chamados.forEach(chamado => {
        const card = document.createElement('div');
        card.className = 'pedidoCard';
        card.dataset.id = chamado.id;

        const tipoEl = document.createElement('p');
        tipoEl.innerHTML = `<strong>Tipo:</strong> ${chamado.fk_Categoria_id}`;

        const descricaoEl = document.createElement('p');
        descricaoEl.innerHTML = `<strong>Descrição:</strong> ${chamado.descricao}`;

        const tituloEl = document.createElement('p');
        tituloEl.innerHTML = `<strong>Título:</strong> ${chamado.titulo}`;

        const prioridadeEl = document.createElement('p');
        prioridadeEl.innerHTML = `<strong>Prioridade:</strong> ${chamado.prioridade}`;

        const statusEl = document.createElement('p');
        statusEl.className = 'status';
        statusEl.innerHTML = `<strong>Status:</strong> ${chamado.stats}`;
        const indexStatus = statusEtapas.indexOf(chamado.stats);
        statusEl.dataset.statusIndex = indexStatus >= 0 ? indexStatus : 0;

        const btnStatus = document.createElement('button');
        btnStatus.className = 'btn btnStatus';
        btnStatus.textContent = 'Atualizar Status';

        if (chamado.stats === 'Fechado') {
          btnStatus.disabled = true;
          btnStatus.textContent = 'Pedido Fechado';
          btnStatus.classList.add('btn-disabled');
        }

        card.appendChild(tipoEl);
        card.appendChild(descricaoEl);
        card.appendChild(tituloEl);
        card.appendChild(prioridadeEl);
        card.appendChild(statusEl);
        card.appendChild(btnStatus);

        lista.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar chamados:', error);
    });

  // Atualizar status
  lista.addEventListener('click', function (event) {
    if (event.target.classList.contains('btnStatus')) {
      const card = event.target.closest('.pedidoCard');
      const statusEl = card.querySelector('.status');
      let currentIndex = parseInt(statusEl.dataset.statusIndex, 10);

      if (currentIndex < statusEtapas.length - 1) {
        currentIndex++;
        const novoStatus = statusEtapas[currentIndex];
        statusEl.dataset.statusIndex = currentIndex;
        statusEl.innerHTML = `<strong>Status:</strong> ${novoStatus}`;

        if (currentIndex === statusEtapas.length - 1) {
          event.target.disabled = true;
          event.target.textContent = 'Pedido Fechado';
          event.target.classList.add('btn-disabled');
        }

        const chamadoId = card.dataset.id;
        fetch(`http://localhost:3000/chamados/${chamadoId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ novoStatus })
        })
          .then(res => res.json())
          .then(data => {
            console.log('Status atualizado no servidor:', data);
          })
          .catch(err => {
            console.error('Erro ao atualizar status:', err);
          });

          if(novoStatus === "Fechado"){
            setTimeout(() => {
              location.reload();
              alert("Chamado com status fechado foi finalizado");
            }, 6000);
          }
      }
    }
  });
});