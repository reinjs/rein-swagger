const Controller = require('@reinjs/rein-class');

module.exports = class swaggerController extends Controller {
  constructor(...args) {
    super(...args);
  }

  async data() {
    this.ctx.body = this.app.swagger;
  }
};