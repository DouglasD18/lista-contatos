const contactTableBody = document.getElementById('contactTableBody');
const addContactForm = document.getElementById('addContactForm');
const addContactModal = document.getElementById('addContactModal');
const container = document.querySelector('.container');

const regexTelefone = /^\(\d{2}\) \d{4}-\d{4}$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clearModal = () => {
  location.reload();
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
  const contact = getContactById(id);
  if (contact) {
    addContactModal.style.display = "block";
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const ativo = document.getElementById('ativo').value == "true";
    const dataNascimento = document.getElementById('dataNascimento').value;

    await updateContact(id, { nome, email, telefone, ativo, dataNascimento });
    setLocalStorageContacts("");
  
    clearModal();
  }
}

// Adiciona um contato à tabela de contatos.
const appendContactToTable = (contact) => {
  const { id, nome, telefone, email, ativo, dataNascimento } = contact; 

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${nome}</td>
    <td>${telefone}</td>
    <td>${email}</td>
    <td>${ativo}</td>
    <td>${dataNascimento}</td>
    <td>
      <button class="btn btn-warning btn-sm">Editar</button>
      <button class="btn btn-danger btn-sm">Excluir</button>
    </td>
  `;
  console.log(row.innerHTML);

  const editButton = row.querySelector('.btn-warning');
  editButton.addEventListener('click', updateContactListener(id));

  const deleteButton = row.querySelector('.btn-danger');
  deleteButton.addEventListener('click', async (event) => {
    await deleteContact(id);
    const contactRow = event.target;
    contactRow.remove();
    setLocalStorageContacts(contactTableBody);
  });

  contactTableBody.appendChild(row);
}

// Função para carregar a lista de contatos
const loadContacts = async () => {
  let contacts = getLocalStorageContacts();
  if (contacts && contacts.length > 0) {
    contactTableBody.innerHTML = contacts;
  } else {
    createLoadingMessage();
    contacts = await getContacts();
    deleteLoadingMessage();
    if (contacts && contacts.length > 0) {
      contacts.forEach(contact => {
        appendContactToTable(contact);
      });
      setLocalStorageContacts(contactTableBody);
    }
  }
}

// Função para adicionar ou editar um contato
const saveContact = async (name, email, telefone, ativo, dataNascimento) => {
  const contact = await createContact({name, email, telefone, ativo, dataNascimento});
  appendContactToTable(contact);
  setLocalStorageContacts(contactTableBody);
}

document.addEventListener('DOMContentLoaded', async function () {
  const addContactButton = document.getElementById('addContactButton');
  const salvar = document.getElementById('salvar');
  salvar.disabled = true;

  // Evento que controla o clique no botão de adicionar contato.
  addContactButton.addEventListener('click', async function () {
    addContactModal.style.display = "block";
    const close = document.getElementById('close');

    // Evento que controla o clique no botão de fechar o modal de adicionar contato.
    close.addEventListener('click', function () {
      clearModal();
    });

    // Evento que controla as mudanças de valores no formulário de adição de contato.
    addContactForm.addEventListener('change', function () {
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const telefone = document.getElementById('telefone').value;
      const ativo = document.getElementById('ativo').value;
      const dataNascimento = document.getElementById('dataNascimento').value;
  
      if (nome && email && telefone && ativo && dataNascimento && regexTelefone.test(telefone) && regexEmail.test(email)) {
        salvar.disabled = false;
      }
    });
  
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
