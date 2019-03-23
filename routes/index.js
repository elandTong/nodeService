var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tong', function (req, res, next) {
  res.send('tong hole!');
});

module.exports = router;
