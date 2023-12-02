import dayjs from 'dayjs';

export const createMessages = (messagesText, username) => ({
  messagesText,
  username,
  createAt: dayjs().format('DD/MM/YYYY - HH:mm:ss'),
});
