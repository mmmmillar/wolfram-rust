module.exports = function (first, operator, second, options) {
  switch (operator) {
    case "===":
      return first === second ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
};
