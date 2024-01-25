const token = "d83aa658-6caa-43ee-ab28-c76423dc6f05";
const urlBase = `https://api.box3.work/api/Contato/${token}`;

const getContacts = async () => {
  try {
    const response = await fetch(urlBase);
    const lista = await response.json();
    return lista;
  } catch (error) {
    return error;
  }
};

const getContactById = async (id) => {
  try {
    const response = await fetch(`${urlBase}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

const createContact = async (contact) => {
  try {
    const response = await fetch(urlBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    console.log(response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const deleteContact = async (id) => {
  try {
    const response = await fetch(`${urlBase}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

const updateContact = async (id, contact) => {
  try {
    const response = await fetch(`${urlBase}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

if (typeof module !== 'undefined') {
  module.exports = {
    getContacts,
    getContactById,
    createContact,
    deleteContact,
    updateContact
  };
}
