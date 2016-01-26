

module.exports.file = function (req, res) {
  console.log(req.file,req.files);
  res.json([]);
};
