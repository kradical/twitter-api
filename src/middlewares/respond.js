const respond = (req, res) => {
  const bodyFound = res.entities || res.entity;

  const status = bodyFound
    ? 200
    : 404;

  const body = res.entities || res.entity || { message: 'Entity Not Found.', status: 404 };

  return res.status(status).json(body);
};

module.exports = {
  respond,
};
