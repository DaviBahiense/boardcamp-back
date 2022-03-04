export function validateCustomers(schema, rules) {
  return (req, res, next) => {

    const validationRules = rules.validate(req.body);
    if (validationRules.error) {
      res.sendStatus(400);
      return;
    }

    const validation = schema.validate(req.body);
    if (validation.error) {
      res.sendStatus(422);
      return;
    }

    next();
  }
}