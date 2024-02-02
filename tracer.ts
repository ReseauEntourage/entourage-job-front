import tracer from 'dd-trace';

const ENV = `${process.env.NODE_ENV}`;

if (ENV === 'production') {
  tracer.init({
    version: process.env.HEROKU_RELEASE_VERSION,
  });
}

export { tracer };
