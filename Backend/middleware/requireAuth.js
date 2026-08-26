export function requireAuth(req, res, next) {
  const user = req.session?.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = user.userId ?? user._id ?? user.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized (missing user id in session)" });
  }

  req.user = user;
  req.userId = String(userId);
  next();
}
