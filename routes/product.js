var express = require('express');
var router = express.Router();

var products = [
  { name: 'apple juice', description: 'good', price: 12.12 },
  { name: 'banana juice', description: 'just so sos', price: 4.50 }
]
router.get('/a', function(req, res) {
  res.json(products);
});
router.get('/a/:id', function(req, res) {
  res.json(products[req.params.id]);
})
module.exports = router;
