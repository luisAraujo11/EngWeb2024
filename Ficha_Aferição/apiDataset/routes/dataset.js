var express = require('express');
var router = express.Router();
var Dataset = require("../controllers/dataset")

/* GET home page. */
router.get('/dataset', function(req, res, next) {
  Dataset.list()
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});

/* GET modalidade */
router.get('/dataset/modalidades', function(req, res, next) {
  Dataset.listModalidades()
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});

/* GET dataset page. */
router.get('/dataset/:id', function(req, res, next) {
  Dataset.findById(req.params.id)
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});

/* POST dataset page. */
router.post('/dataset', function(req, res, next){
  console.log(req)
  Dataset.insert(req.body)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(523).jsonp(erro))
})

router.put('/dataset/edit/:id', function(req, res){
  Dataset.update(req.params.id, req.body)
  .then(data => res.status(201).jsonp(data))
  .catch(erro => res.status(524).jsonp(erro))
})

/* GET atletas by modalidade */
router.get('/dataset/modalidades/:modalidade', function(req, res, next) {
  Dataset.findAtletasByModalidade(req.params.modalidade)
  .then((data) => {
    res.jsonp(data)
  }).catch((erro) => {
    res.jsonp(erro)
  });
});


router.delete('/dataset/delete/:id', (req, res) => {
  console.log(req.params.id + "a" )
  Dataset.removeById(req.params.id)
  .then((pessoa) => {
      res.json(pessoa);
      res.end();
  });
});


module.exports = router;
