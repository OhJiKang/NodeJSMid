let userList = [

];

export const addUser = (newUser) => (userList = [...userList, newUser]);

export const getUserList = (room) => userList.filter((user) => user.room === room);

export const removeUser = (id) => (userList = userList.filter((user) => user.id !== id));

export const findUser = (id) => userList.find((user) => user.id === id);
