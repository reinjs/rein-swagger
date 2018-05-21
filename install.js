const fs = require('fs-extra');
const path = require('path');

module.exports = async (projectCwd) => {
  const swaggerCwd = path.resolve(projectCwd, 'app', 'swagger');
  const swaggerSchemaPath = path.resolve(swaggerCwd, 'schema.json');
  const swaggerSecurityPath = path.resolve(swaggerCwd, 'security.json');
  const swaggerTagsPath = path.resolve(swaggerCwd, 'tags.json');
  
  if (!fs.existsSync(swaggerSchemaPath)) fs.outputFileSync(swaggerSchemaPath, '{}', 'utf8');
  if (!fs.existsSync(swaggerSecurityPath)) fs.outputFileSync(swaggerSecurityPath, '{}', 'utf8');
  if (!fs.existsSync(swaggerTagsPath)) fs.outputFileSync(swaggerTagsPath, '[]', 'utf8');
};

