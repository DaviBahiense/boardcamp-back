export function validateCategory(schema) {
  return (req, res, next) => {
    if (req.body.name === ""){
      res.sendStatus(400)
      return
    }

    const validation = schema.validate(req.body);
    if (validation.error) {
      res.sendStatus(422);
      return;
    }

    next();
  }
}