const isAuthorized = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new Error("Not authorized", { cause: 400 }));
    return next();
  };
};

export default isAuthorized;
