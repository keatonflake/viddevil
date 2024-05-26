const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'VidDevil API',
    description: 'API for VidDevil',
  },
  host: 'viddevil.onrender.com',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);