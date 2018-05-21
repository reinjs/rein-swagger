module.exports = app => {
  app.router.get('/swagger-data', 'swagger.data');
};