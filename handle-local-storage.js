const getLocalStorageContacts = () => {
  const contacts = localStorage.getItem("contacts");
  return JSON.parse(contacts);
}

const setLocalStorageContacts = (contacts) => {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

if (typeof module !== 'undefined') {
  module.exports = {
    getLocalStorageContacts,
    setLocalStorageContacts
  };
}
