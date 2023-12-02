const socket = io();

document.getElementById('form-messages').addEventListener('submit', (e) => {
  e.preventDefault();

  const messageText = document.getElementById('input-messages').value;
  if (!messageText) {
    return;
  }

  const acknowledgements = (errors) => {
    console.log(error);
  };

  socket.emit('send msg client->server', messageText, acknowledgements);
});

socket.on('send msg server->client', (message) => {
  const { createAt, messagesText, username } = message;

  const htmlContent = document.getElementById('app__messages').innerHTML;

  const messagesElement = `
        <div class="message-item">
            <div class="message__row1">
                <p class="message__name">${username}</p>
                <p class="message__date">${createAt}</p>
            </div>
            <div class="message__row2">
                <p class="message__content">
                    ${messagesText}
                </p>
            </div>
        </div>
    `;

  let contentRender = htmlContent + messagesElement;

  document.getElementById('app__messages').innerHTML = contentRender;

  document.getElementById('input-messages').value = '';
});

const queryString = location.search;

const params = Qs.parse(queryString, {
  ignoreQueryPrefix: true,
});
const { room, username } = params;

socket.emit('join room', { room, username });
document.getElementById('app__title').innerHTML = room;

socket.on('send user from server->client', (userList) => {
  // console.log(userList);

  let contentHtml = '';

  // Make Username in String
  userList.map((user) => {
    contentHtml += `<li class="app__item-user">${user.username}</li>`;
  });

  // Push to file chat.html
  document.getElementById('app__list-user--content').innerHTML = contentHtml;
});
