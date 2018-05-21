const path = require('path');
module.exports = class Commander {
  constructor(ctx) {
    this.ctx = ctx;
  }
  
  async add(name, data) {
    const ctx = this.ctx;
    if (data.swagger) {
      let file;
      const relativePath = path.relative(ctx.projectCwd, process.cwd());
      if (!relativePath) {
        file = path.resolve(ctx.projectCwd, 'app', 'swagger', 'paths', name + '.json');
      } else {
        const isInSwagger = relativePath.indexOf('app/swagger/paths') === 0;
        if (isInSwagger) {
          file = path.resolve(process.cwd(), name + '.json');
        } else {
          file = path.resolve(ctx.projectCwd, 'app', 'swagger', 'paths', name + '.json');
        }
      }
      ctx.spinner.start();
      ctx.spinner.name = 'swagger';
      ctx.spinner.info('正在生成文件...');
      await ctx.utils.createFiles(ctx, [{
        file,
        template: path.resolve(__dirname, '.template.ejs')
      }]);
      ctx.spinner.success('全部文件生成完毕');
      return true;
    }
  }
};