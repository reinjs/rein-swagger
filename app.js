const fs = require('fs');
const path = require('path');
const Mount = require('koa-mount');
const Static = require('koa-static');
const utils = require('@reinjs/rein-utils');
const licenseUrl = require('oss-license-name-to-url');
const packageCache = require('./package.json');

//more api see http://petstore.swagger.io/v2/swagger.json
module.exports = async (app, plugin) => {
  const config = plugin.config || {};
  const ProjectPackageCachePath = path.resolve(app.config.cwd, 'package.json');
  if (!fs.existsSync(ProjectPackageCachePath)) throw new Error('找不到项目配置文件`package.json` on `' + ProjectPackageCachePath + '`');
  const Pkg = utils.loadFile(ProjectPackageCachePath);
  
  const staticMiddleware = Mount('/swagger', Static(path.resolve(__dirname, 'public'), { index: 'index.html' }));
  if (typeof config.auth === 'string' && app.env === config.auth) {
    app.use(staticMiddleware);
  } else if (typeof config.auth === 'function') {
    app.use(canViewSwagger(config.auth, staticMiddleware));
  }
  
  app.started(async () => {
    const result = app.swagger = {};
    result.basePath = config.basePath || '/';
    result.host = config.host || '127.0.0.1:8080';
    result.schemes = config.protocols || ['http'];
    result.swagger = packageCache.version;
    result.paths = {};
    
    result.externalDocs = {};
    result.externalDocs.description = config.description || 'Swagger Document';
    result.externalDocs.url = Pkg.homepage || 'https://github.com/reinjs/rein-swagger';
    
    result.info = {};
    result.info.contact = {};
    result.info.contact.email = Pkg.email || config.email || 'evio@vip.qq.com';
    result.info.description = Pkg.description;
    result.info.license = {};
    result.info.license.name = Pkg.license || config.license || 'MIT';
    result.info.license.url = licenseUrl(result.info.license.name);
    result.info.termsOfService = config.terms || 'https://github.com/reinjs';
    result.info.title = config.title || 'Swagger Api Document';
    result.info.version = Pkg.version;
    
    const jsonSchemaFilePath = path.resolve(app.config.cwd, 'app', 'swagger', 'schema.json');
    const securityDefinitionsFilePath = path.resolve(app.config.cwd, 'app', 'swagger', 'security.json');
    const tagFilePath = path.resolve(app.config.cwd, 'app', 'swagger', 'tags.json');
  
    /**
     * tags: [...]
     *  - description
     *  - externalDocs
     *    - description
     *    - url
     *  - name
     * @type {*|Array}
     */
    result.tags = fs.existsSync(tagFilePath)
      ? utils.loadFile(tagFilePath) || config.tags || []
      : [];
    
    // see https://swagger.io/docs/specification/data-models/dictionaries/
    result.definitions = fs.existsSync(jsonSchemaFilePath)
      ? utils.loadFile(jsonSchemaFilePath) || config.schema || {}
      : {};
    
    result.securityDefinitions = fs.existsSync(securityDefinitionsFilePath)
      ? utils.loadFile(jsonSchemaFilePath) || config.security || {}
      : {};
    
    const extras = app.router.extra;
    const swagger = extras[config.scope || 'swagger'];
    if (swagger) {
      const paths = {};
      const swaggerPath = path.resolve(app.config.cwd, 'app', 'swagger', 'paths');
      for (const rule in swagger) {
        paths[rule] = {};
        for (let i = 0; i < swagger[rule].length; i++) {
          const rulePath = swagger[rule][i].path;
          const files = [
            path.resolve(swaggerPath, rulePath.replace(/^\//, './') + '.json'),
            path.resolve(swaggerPath, rulePath.replace(/^\//, './') + '.js')
          ].filter(file => fs.existsSync(file));
          if (files.length) {
            paths[rule][swagger[rule][i].method.toLowerCase()] = utils.loadFile(files[0]);
          }
        }
      }
      result.paths = paths;
    }
  });
};

function canViewSwagger(authorize, middleware) {
  return async (ctx, next) => {
    const res = await authorize(ctx);
    if (res || res === undefined) return middleware(ctx, next);
    await next();
  }
}