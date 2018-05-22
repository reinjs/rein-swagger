const fs = require('fs-extra');
const path = require('path');

module.exports = async ctx => {
  const swaggerCwd = path.resolve(ctx.projectCwd, 'app', 'swagger');
  const swaggerSchemaPath = path.resolve(swaggerCwd, 'schema.json');
  const swaggerSecurityPath = path.resolve(swaggerCwd, 'security.json');
  const swaggerTagsPath = path.resolve(swaggerCwd, 'tags.json');
  
  if (!fs.existsSync(swaggerSchemaPath)) fs.outputFileSync(swaggerSchemaPath, '{}', 'utf8');
  if (!fs.existsSync(swaggerSecurityPath)) fs.outputFileSync(swaggerSecurityPath, '{}', 'utf8');
  if (!fs.existsSync(swaggerTagsPath)) fs.outputFileSync(swaggerTagsPath, '[]', 'utf8');
  
  return {
    "basePath": "/", // 请求基址
    "host": "127.0.0.1:8080", // 此项目描述
    "protocols": ["http"],
    "description": "Swagger Service Document",
    "email": "shenyunjie@u51.com",
    "license": "ISC",
    "terms": "http://github.com/reinjs",
    "title": "Test Document",
    "scope": "swagger",
    "auth": 'dev'
  }
};