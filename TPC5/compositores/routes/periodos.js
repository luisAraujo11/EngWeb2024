var express = require('express');
var router = express.Router();
var axios = require('axios')


/* ---------- GET ---------- */

/* Periodos home page */
router.get('/', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get('http://localhost:3000/periodos')
      .then(resposta => {
        res.render('listaPeriodos', {lista : resposta.data, data: d, titulo: "Lista de períodos"})
      })
      .catch(erro => {
        res.render('error', {error: erro, message: "Erro ao recuperar os períodos"})
      })
  });
  
/* Periodos register */
  router.get('/registo', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    res.render('registoPeriodo', {data: d, titulo: "Registo de período"})
  });

/* Periodos por id */
router.get('/:id', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.get('http://localhost:3000/periodos/' + req.params.id)
    .then(resposta => {
      var title = "Consulta do Período " + resposta.data.id;
      res.render('periodo', {periodo: resposta.data, data: d, titulo: title})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro ao recuperar o período"})
    })
});

// GET /periodo/delete/:id --------------------------------------------------------------------
router.get('/delete/:id', function(req, res, next) {
    var d = new Date().toISOString().substring(0, 16)
    axios.delete('http://localhost:3000/periodos/' + req.params.id)
      .then(resposta => {
        res.render('periodo', {periodo : resposta.data, data: d, titulo: "Delete de período"})
      })
      .catch(erro => {
        res.render('error', {error: erro, message: "Erro ao recuperar o período"})
      })
});

// GET /periodos/edit/:id --------------------------------------------------------------------
router.get('/edit/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/periodos/' + req.params.id)
      .then(resposta => {
          res.render('editPeriodo', {periodo: resposta.data, data: d, titulo: "Edit de periodo"})
      })
      .catch(erro => {
          res.render('error', {error: erro, message: "Erro ao editar1 o periodo"})
      })
});

/* ---------- POST ---------- */

/* Periodos register */
router.post('/registo', function(req, res) {
  var d = new Date().toISOString().substring(0, 16);
  // Assuming req.body.list is a string of IDs separated by commas
  var ids = req.body.list.split(',').map(id => id.trim()); // Split the string into an array and trim whitespace
  var periodoData = {
      id: req.body.id,
      desc: req.body.desc,
      list: ids
  };
  console.log(JSON.stringify(periodoData));
  axios.post('http://localhost:3000/periodos', periodoData)
  .then(resposta => {
    res.render('confirmRegisto', {info: periodoData, data: d, titulo: "Registo de periodo com Sucesso"});
  })
  .catch(erro => {
    res.render('error', {error: erro, message: "Erro ao gravar um periodo novo"});
  });
});

// POST /periodos/edit/:id --------------------------------------------------------------------
router.post('/edit/:id', function(req,res){
  var d = new Date().toISOString().substring(0, 16)
  console.log(JSON.stringify(req.body))
  axios.put('http://localhost:3000/periodos/' + req.params.id, req.body)
  .then(resposta => {
    res.render('confirmEdit', {info: req.body, data: d, titulo: "Edit de periodo com Sucesso"})
  })
  .catch(erro => {
    res.render('error', {error: erro, message: "Erro ao editar2 o periodo"})
  })
});
  
  module.exports = router;
  