const urlBase = "https://api.box3.work/api/Contato";

export const getContacts = async () => {
  try {
    const response = await fetch(url);
    const lista = await response.json();
    return lista;
  } catch (error) {
    return error;
  }
};

export const getContact = async (id) => {
  try {
    const response = await fetch(`${urlBase}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

export const createContact = async (contact) => {
  try {
    const response = await fetch(urlBase, {
      method: "POST",
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

export const deleteContact = async (id) => {
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

export const updateContact = async (id, contact) => {
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
