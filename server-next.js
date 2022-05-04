const next = require('next');
const cors = require('cors');
const express = require('express');
const enforce = require('express-sslify');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // enable ssl redirect
    if (!dev) server.use(enforce.HTTPS({ trustProtoHeader: true }));

    server.use(
      cors({
        origin: [
          process.env.API_URL,
          process.env.SERVER_URL,
          process.env.CDN_URL,
        ],
      })
    );

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
