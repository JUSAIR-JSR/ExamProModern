export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

export function ensureTeacher(req, res, next) {
  if (req.user && req.user.role === "teacher") return next();
  return res.status(403).json({ message: "Forbidden: teacher only" });
}
