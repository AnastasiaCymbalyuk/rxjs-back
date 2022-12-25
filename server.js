/* eslint-disable no-console */
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const faker = require('faker');

const app = new Koa();

app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

const PORT = process.env.PORT || 7070;
const messages = [];

app.use(
  koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
  }),
);

setInterval(() => {
  messages.push({
    id: faker.datatype.uuid(),
    from: faker.internet.email(),
    subject: faker.lorem.words(),
    body: faker.lorem.sentence(),
    received: faker.date.past(),
  });
}, 10000);

function getMessage(id) {
  if (id === '0') {
    return messages;
  }
  const ndx = messages.findIndex((el) => el.id === id);
  const msg = messages.slice(ndx + 1);
  return msg;
}

const router = new Router();
router.get('/messages/unread', async (ctx) => {
  const { id } = ctx.request.query;
  const newMsg = getMessage(id);
  ctx.response.body = newMsg;
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT, () => console.log(`${PORT}`));
