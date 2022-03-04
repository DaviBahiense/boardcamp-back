export function validateGame(schema) {
  return (req, res, next) => {

    if (req.body.name === "") {
      return res.sendStatus(400)
    }

    const validation = schema.validate(req.body);
    if (validation.error) {
      res.sendStatus(422);
      return;
    }

    next();
  }
}