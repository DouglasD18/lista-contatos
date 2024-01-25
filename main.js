const contactTableBody = document.getElementById('contactTableBody');
const addContactForm = document.getElementById('addContactForm');
const addContactModal = document.getElementById('addContactModal');
const container = document.querySelector('.container');

const regexTelefone = /^(\d{10}|\d{11})$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatDataNascimento = (dataNascimento) => {
  const [ano, mes, dia] = dataNascimento.split('-');
  return `${dia[0]}${dia[1]}/${mes}/${ano}`;
}

const formatTelefone = (telefone) => {
  const formated = telefone.replace(/\s/g, '').trim();
  const ddd = formated.slice(0, 2);
  let numero = formated.slice(2);
  
  if (numero.length === 8) {
    numero = numero.slice(0, 4) + '-' + numero.slice(4);
  } else if (numero.length === 9) {
    numero = numero.slice(0, 5) + '-' + numero.slice(5);
  }
  
  return `(${ddd}) ${numero}`;
}

const clearModal = () => {
  document.getElementById('nome').value = "";
  document.getElementById('email').value = "";
  document.getElementById('telefone').value = "";
  document.getElementById('ativo').value = "true";
  document.getElementById('dataNascimento').value = "";
  addContactModal.style.display = "none";
}

const handleModalValues = (type) => {
  const button = document.getElementById(type);
  button.disabled = true;

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const telefone = document.getElementById('telefone').value;
  const dataNascimento = document.getElementById('dataNascimento').value;

  if (nome && email && telefone && dataNascimento && regexTelefone.test(telefone.replace(/\s/g, '').trim()) && regexEmail.test(email)) {
    button.disabled = false;
  }
}

// Cria mensagem de carregamento enquanto está sendo feita a requisição à API.
const createLoadingMessage = () => {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'spinner-border';
  loadingDiv.role = 'status'; 

  const loadingSpan = document.createElement('span');
  loadingSpan.className = 'sr-only';
  loadingSpan.innerText = 'Carregando...';
  loadingDiv.appendChild(loadingSpan);

  container.appendChild(loadingDiv);
}; 

// Deleta a mensagem de carregamento.
const deleteLoadingMessage = () => {
  message = container.lastChild;
  container.removeChild(message);
};

const updateContactListener = async (id) => {
  const contact = await getContactById(id);

  if (contact) {
    addContactModal.style.display = "block";
    const salvar = document.getElementById('salvar');
    salvar.style.display = "none";
    const close = document.getElementById('close');

    document.getElementById('nome').value = contact.nome;
    document.getElementById('email').value = contact.email;
    document.getElementById('telefone').value = contact.telefone;
    document.getElementById('ativo').value = contact.ativo;
    document.getElementById('dataNascimento').value = contact.dataNascimento.slice(0, 10);

    // Evento que controla o clique no botão de fechar o modal de adicionar contato.
    close.addEventListener('click', function () {
      clearModal();
    });

    addContactForm.addEventListener('change', handleModalValues("editar"));

    const editar = document.getElementById('editar');
    editar.style.display = "block";
    editar.addEventListener('click', async () => {
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const telefone = document.getElementById('telefone').value;
      const ativo = document.getElementById('ativo').value == "true";
      const dataNascimento = document.getElementById('dataNascimento').value;

      await updateContact(id, { nome, email, telefone, ativo, dataNascimento });
    

      editar.style.display = "none";
      clearModal();

      location.reload();
    })
  }
}

// Função que faz a renderização condicional
const handleContacts = (contacts) => {
  contactTableBody.innerHTML = "";

  if (contacts && contacts.length > 0) {
    contacts.forEach(contact => { 
      appendContactToTable(contact);
    });
  }
}

// Adiciona um contato à tabela de contatos.
const appendContactToTable = (contact) => {
  const { id, nome, telefone, email, ativo, dataNascimento } = contact; 

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${nome}</td>
    <td>${formatTelefone(telefone)}</td>
    <td>${email}</td>
    <td>${ativo}</td>
    <td>${formatDataNascimento(dataNascimento)}</td>
    <td>
      <button class="btn btn-warning btn-sm">Editar</button>
      <button class="btn btn-danger btn-sm">Excluir</button>
    </td>
  `;

  const editButton = row.querySelector('.btn-warning');
  editButton.addEventListener('click', () => updateContactListener(id));

  const deleteButton = row.querySelector('.btn-danger');
  deleteButton.addEventListener('click', async () => {
    await deleteContact(id);
    const contacts = await getContacts();
    handleContacts(contacts);
  });

  contactTableBody.appendChild(row);
}

// Função para carregar a lista de contatos
const loadContacts = async () => {
  createLoadingMessage();
  contacts = await getContacts();
  deleteLoadingMessage();
  if (contacts && contacts.length > 0) {
    handleContacts(contacts);
  }
}

// Função para adicionar ou editar um contato
const saveContact = async (nome, email, telefone, ativo, dataNascimento) => {
  const contact = await createContact({ nome, email, telefone, ativo, dataNascimento });
  appendContactToTable(contact);
}

document.addEventListener('DOMContentLoaded', async function () {
  const addContactButton = document.getElementById('addContactButton');

  // Evento que controla o clique no botão de adicionar contato.
  addContactButton.addEventListener('click', async function () {
    addContactModal.style.display = "block";
    const close = document.getElementById('close');
    const salvar = document.getElementById('salvar');
    salvar.disabled = true;

    // Evento que controla o clique no botão de fechar o modal de adicionar contato.
    close.addEventListener('click', function () {
      clearModal();
    });

    // Evento que controla as mudanças de valores no formulário de adição de contato.
    addContactForm.addEventListener('change', () => handleModalValues('salvar'));
  
    // Evento de envio do formulário
    salvar.addEventListener('click', async function (event) {
      event.preventDefault();
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const telefone = document.getElementById('telefone').value;
      const ativo = document.getElementById('ativo').value == "true";
      const dataNascimento = document.getElementById('dataNascimento').value;
    
      await saveContact(nome, email, telefone, ativo, dataNascimento);
      clearModal();
    });
  });

  // Carregue a lista de contatos ao carregar a página
  await loadContacts();
});
