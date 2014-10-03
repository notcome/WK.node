class Task {
  constructor (html, func, args) {
    let code = func.toString();
    if (args)
      this.code = '(' + code + ')';
    else
      this.code = '( function () { return ' + code + '})';

    this.html = html;
    this.args = args || [];
  }

  toString () {
    return JSON.stringify({
      args: this.args,
      code: this.code,
      html: this.html
    });
  }
};

module.exports = Task;
