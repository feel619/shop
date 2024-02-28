module.exports = function (headler) {
  return async (req, res, next) => {
    try {
      const respnose = await headler();
    } catch (error) {
      next(error);
    }
  };
};
