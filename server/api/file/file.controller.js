

module.exports.file = function (req, res) {
  console.log(req.file); // en esta variable van la informacion del archivo
  res.json([]);
};
