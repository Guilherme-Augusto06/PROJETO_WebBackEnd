// script.js
document.addEventListener('DOMContentLoaded', function() {
// Função para carregar as despesas na tabela

async function carregarDespesas() {
    try {
        // Carrega as despesas
        const responseDespesas = await axios.get('http://127.0.0.1:5000/list');
        const despesas = responseDespesas.data;

        // Carrega o salário
        const responseSalario = await axios.get('http://127.0.0.1:5000/list_salary');
        const salario = responseSalario.data[0]; // Assume que há apenas um salário na lista

        // Atualiza o salário exibido no modal principal
        document.getElementById('user-salary').innerText = salario.SALARIO.toFixed(2);

        // Atualiza a tabela de despesas
        const tabela = document.querySelector('.tabela-js');
        tabela.innerHTML = '';

      despesas.forEach(despesa => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
          <td>${despesa.ID}</td>
          <td>${despesa.DESPESA}</td>
          <td>R$ ${despesa.VALOR.toFixed(2)}</td>
          <td>
              <button class="btn bg-white delete-btn" type="button" data-bs-toggle="modal" data-bs-target="#modalDel" onclick="excluirDespesa(${despesa.ID})">
                  <span class="material-symbols-outlined text-danger">delete</span>
              </button>
              <button class="btn bg-white edit-btn" id="edit-tarefa-btn" type="button" data-bs-toggle="modal" data-bs-target="#modalEdit" onclick="editarDespesa(${despesa.ID}, '${despesa.DESPESA}', ${despesa.VALOR})">
                  <span class="material-symbols-outlined text-success">edit</span>
              </button>
          </td>
          
          `;
          tabela.appendChild(tr);
      });
  } catch (error) {
      console.error('Erro ao carregar despesas:', error.message);
  }
}

// Função para adicionar uma nova despesa


// Função para editar uma despesa


// Função para excluir uma despesa
// Função para excluir uma despesa

async function carregarGrafico() {
    try {
        // Carrega o total de despesas
        const responseTotalDespesas = await axios.get('http://127.0.0.1:5000/sum');
        const totalDespesas = responseTotalDespesas.data.total;

        // Carrega o salário
        const responseSalario = await axios.get('http://127.0.0.1:5000/list_salary');
        const salario = responseSalario.data[0]; // Assume que há apenas um salário na lista

        // Calcula o restante do salário após despesas
        const restanteSalario = salario.SALARIO - totalDespesas;

        // Obtém o contexto do canvas
        const ctx = document.getElementById('donutChart').getContext('2d');

        // Calcula a porcentagem de despesas em relação ao salário
        const porcentagemDespesas = (totalDespesas / salario.SALARIO) * 100;

        // Define a cor com base nas porcentagens
        let cor;
        let mensagem;
        if (porcentagemDespesas < 50) {
            cor = 'rgba(0, 255, 0, 0.8)'; // Verde
            mensagem = 'Gastos abaixo de 50% do salário';
        } else if (porcentagemDespesas < 70) {
            cor = 'rgba(255, 255, 0, 0.8)'; // Amarelo
            mensagem = 'Gastos entre 50% e 70% do salário';
        } else {
            cor = 'rgba(255, 0, 0, 0.8)'; // Vermelho
            mensagem = 'Gastos acima de 70% do salário';
        }

        // Cria o gráfico de rosca
        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Salário', 'Despesas'],
                datasets: [{
                    data: [salario.SALARIO, totalDespesas],
                    backgroundColor: [cor, 'rgba(75, 192, 192, 0.8)'],
                }],
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                    },
                },
            },
        });

        // Adiciona a mensagem abaixo do gráfico
        const mensagemElement = document.getElementById('mensagemGastos');
        mensagemElement.innerText = mensagem;
        mensagemElement.style.color = cor;
    } catch (error) {
        console.error('Erro ao carregar gráfico:', error.message);
    }
}

// Carrega o gráfico ao carregar a página
carregarGrafico();

// Carrega o gráfico ao carregar a página
carregarGrafico();
// Função para adicionar uma nova despesa
// Função para adicionar uma nova despesa
async function adicionarDespesa() {
    const despesaInput = document.querySelector("#recipient-name");
    const valorInput = document.querySelector("#recipient-valor");
    const errorMessage = document.getElementById('error-message');

    const despesa = despesaInput.value;
    const valor = parseFloat(valorInput.value.replace(',', '.'));

    if (!despesa || isNaN(valor)) {
        errorMessage.innerText = 'Preencha os campos corretamente.';
        return;
    }

    try {
        // Obtém o salário atual
        const responseSalario = await axios.get('http://127.0.0.1:5000/list_salary');
        const salario = responseSalario.data[0]; // Assume que há apenas um salário na lista
        // Verifica se o salário é suficiente para cobrir a despesa
        if (salario.SALARIO < valor) {
            errorMessage.innerText = 'Salário insuficiente para cobrir a despesa.';
            return;
        }

        // Adiciona a nova despesa ao servidor
        const response = await axios.post(`http://127.0.0.1:5000/add`, { despesa: despesa, valor: valor });
        console.log(response.data);

        // Recarrega a tabela
        carregarDespesas();

        // Limpa os campos de entrada após adicionar a despesa
        despesaInput.value = '';
        valorInput.value = '';

        // Fecha o modal de adicionar despesa
        const modal = new bootstrap.Modal(document.getElementById('Modal3'));
        modal.hide();

        // Limpa a mensagem de erro
        errorMessage.innerText = '';

        // Recarrega a página
        location.reload();
    } catch (error) {
        console.error('Erro ao adicionar despesa:', error.message);
    }
}
// Exibir gastos mensais, somente um get com soma de todos os valores



// Função para editar o salário


// Carrega as despesas ao carregar a página
carregarDespesas();
// Adiciona um ouvinte de evento ao botão de adicionar no modal
document.querySelector("#addDespesaBtn").addEventListener("click", adicionarDespesa);

});
function excluirDespesa(id) {
    // Mostra uma caixa de diálogo de confirmação
    const confirmacao = window.confirm('Deseja realmente excluir esta despesa?');
  
    // Se o usuário confirmar, prossegue com a exclusão
    if (confirmacao) {
        axios.delete('http://127.0.0.1:5000/delete', { data: { id } })
            .then(function (response) {
                console.log(response.data);
  
                // Recarrega a tabela
                carregarDespesas();
            })
            .catch(function (error) {
                console.error('Erro ao excluir despesa:', error.message);
            });
    }
  }
  async function editarDespesa(id, despesaAtual, valorAtual) {
    const novoDespesa = prompt('Digite a nova despesa:', despesaAtual);
    const novoValor = parseFloat(prompt('Digite o novo valor:', valorAtual).replace(',', '.'));
  
    if (!novoDespesa || isNaN(novoValor)) {
        alert('Preencha os campos corretamente.');
        return;
    }
  
    try {
        const response = await axios.put(`http://127.0.0.1:5000/update/${id}`, { despesa: novoDespesa, valor: novoValor });
        console.log(response.data);
  
        // Recarrega a tabela
        carregarDespesas();
    } catch (error) {
        console.error('Erro ao editar despesa:', error.message);
    }
  }
  async function editarSalario() {
    const novoSalarioInput = document.getElementById('edit-salary-input');
    const novoSalario = parseFloat(novoSalarioInput.value.replace(',', '.'));

    if (isNaN(novoSalario)) {
        alert('Digite um valor válido para o salário.');
        return;
    }

    try {
        const response = await axios.put('http://127.0.0.1:5000/update_salary', { salario: novoSalario });
        console.log(response.data);

        // Atualiza o salário exibido no modal principal
        document.getElementById('user-salary').innerText = novoSalario.toFixed(2);

        // Fecha o modal de edição de salário
        const modal = new bootstrap.Modal(document.getElementById('modalEditSalary'));
        modal.hide();
    } catch (error) {
        console.error('Erro ao editar salário:', error.message);
    }
}
