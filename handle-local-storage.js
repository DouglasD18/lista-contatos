export const getLocalStorageContacts = () => {
  const contacts = localStorage.getItem("contacts");
  return JSON.parse(contacts);
}

export const setLocalStorageContacts = (contacts) => {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}
