module.exports = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.redirect('/login'); // Redirige al login si no es admin
};

