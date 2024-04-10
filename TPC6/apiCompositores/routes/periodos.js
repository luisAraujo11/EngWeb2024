var express = require('express');
var router = express.Router();
var Periodo = require("../controllers/periodo")

var d = new Date().toISOString().substring(0, 16)

/* GET periodos listing. */
router.get('/', function (req, res, next) {
  Periodo.list()
    .then((data) => res.status(200).render(
      'listaPeriodos', {
      'titulo': 'Lista de Períodos',
      'lista': data,
      'data': d
    }))

    .catch(function (error) {
      res.status(503).render('error', { 'error': error })
    })
});

/* GET periodo register */
router.get('/registo', function(req, res, next) {
  res.render('registoPeriodo', {data: d, titulo: "Registo de periodo"})
});

/* GET periodo page. */
router.get('/:id', function (req, res, next) {
  Periodo.findById(req.params.id)
    .then((data) => res.status(200).render(
      'periodo', {
      'titulo': 'Período ' + req.params.id,
      'periodo': data,
      'data': d
    }))

    .catch(function (error) {
      res.status(503).render('error', { 'error': error })
    })
});

/* GET periodo delete */
router.get('/delete/:id', function(req, res, next){
  Periodo.delete(req.params.id)
      .then(() => res.status(200).redirect('/periodos'))
      .catch((error) => res.status(506).render('error', {'error': error}))
})

/* GET periodo edit page */
router.get('/edit/:id', function(req, res, next){

  Periodo.findById(req.params.id)
      .then((data) => res.status(200).render(
        'editPeriodo', {
          'titulo': 'Período ' + req.params.id,
          'periodo': data,
          'data': d
      }))

      .catch((error) => res.status(507).render('error', {'error': error}))
})

/* POST periodo page. */
router.post('/registo', function (req, res, next) {
  console.log(req)
  Periodo.insert(req.body)
      .then((data) => res.status(200).render(
        'confirmRegisto', {
        'titulo': 'Registo periodo',
        'info': data,
        'data': d
      }))

      .catch(function (error) {
        res.status(503).render('error', { 'error': error })
      })
})

// PUT edit periodo
router.post('/edit/:id', function (req, res) {
  Periodo.updatePeriodo(req.params.id, req.body)
    .then((data) => res.status(201).render(
        'confirmEdit', {
        'titulo': 'Registo confirmado',
        'info': data,
        'data': d
      })
    )
    .catch(erro => res.status(524).jsonp(erro))
})

module.exports = router;



