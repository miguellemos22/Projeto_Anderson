document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/chamados')
      .then(response => response.json())
      .then(chamados => {
        const lista = document.getElementById('listaChamados');
        lista.innerHTML = ''; // Limpa antes de adicionar
  
        if (chamados.length === 0) {
          lista.innerHTML = "<p>Nenhum chamado encontrado.</p>";
          return;
        }
  
        const ul = document.createElement('ul');
  
        chamados.forEach(chamado => {
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>ID:</strong> ${chamado.id}<br>
            <strong>Título:</strong> ${chamado.titulo}<br>
            <strong>Status:</strong> ${chamado.stats}<br>
            <strong>Prioridade:</strong> ${chamado.prioridade}<br>
            <strong>Descrição:</strong> ${chamado.descricao}<br>
            <strong>Data de Criação:</strong> ${formatarData(chamado.data_criacao)}<br>
            <strong>Data de Conclusão:</strong> ${chamado.data_conclusao ? formatarData(chamado.data_conclusao) : 'Em aberto'}
          `;
          ul.appendChild(li);
        });
  
        lista.appendChild(ul);
      })
      .catch(error => {
        console.error('Erro ao buscar chamados:', error);
        const lista = document.getElementById('listaChamados');
        lista.innerHTML = '<p style="color: red;">Erro ao carregar os chamados.</p>';
      });
  });
  
  function formatarData(data) {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  }
  