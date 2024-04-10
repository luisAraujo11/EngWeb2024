var express = require('express');
var router = express.Router();
var Compositor = require("../controllers/compositor")

var d = new Date().toISOString().substring(0, 16)

/* GET compositores listing. */
router.get('/', function (req, res, next) {
  Compositor.list()
    .then((data) => res.status(200).render(
      'listaCompositores', {
      'titulo': 'Lista de Compositores',
      'lista': data,
      'data': d
    }))

    .catch(function (error) {
      res.status(503).render('error', { 'error': error })
    })
});

/* GET Compositor register */
router.get('/registo', function(req, res, next) {
  res.render('registoCompositor', {data: d, titulo: "Registo de compositor"})
});

/* GET compositor page. */
router.get('/:id', function (req, res, next) {
  Compositor.findById(req.params.id)
    .then((data) => res.status(200).render(
      'compositor', {
      'titulo': 'Compositor ' + req.params.id,
      'compositor': data,
      'data': d
    }))

    .catch(function (error) {
      res.status(503).render('error', { 'error': error })
    })
});

/* GET compositor delete */
router.get('/delete/:id', function(req, res, next){
  Compositor.delete(req.params.id)
      .then(() => res.status(200).redirect('/compositores'))
      .catch((error) => res.status(506).render('error', {'error': error}))
})

/* GET compositor edit page */
router.get('/edit/:idCompositor', function(req, res, next){

  Compositor.findById(req.params.idCompositor)
      .then((data) => res.status(200).render(
        'editCompositor', {
          'titulo': 'Compositor ' + req.params.idCompositor,
          'compositor': data,
          'data': d
      }))

      .catch((error) => res.status(507).render('error', {'error': error}))
})

/* POST compositor page. */
router.post('/registo', function (req, res, next) {
  console.log(req)
  Compositor.insert(req.body)
      .then((data) => res.status(200).render(
        'confirmRegisto', {
        'titulo': 'Registo compositor',
        'info': data,
        'data': d
      }))

      .catch(function (error) {
        res.status(503).render('error', { 'error': error })
      })
})

// router.post('/registo', async function (req, res, next) {
//   try {
//     // Assuming req.body contains the composer data including the period
//     const compositorData = req.body;

//     // Insert the composer into the Compositor collection
//     // Ensure that the insert method returns the inserted document, including its _id
//     const compositor = await Compositor.insert(compositorData);

//     const periodoUpdateResult = await Periodo.updateOne(
//       { nome: compositorData.periodo }, // Assuming 'periodo' is the field in the composer data
//       { $addToSet: { compositores: compositor._id } } // Add composer ID to the set of composers for the period
//       // Note: $addToSet ensures the composer is only added once
//     );

//     // If needed, check periodoUpdateResult to ensure the update was successful

//     // Render confirmation page
//     res.status(200).render('confirmRegisto', {
//       'titulo': 'Registo compositor',
//       'info': compositor,
//       'data': d
//     });

//   } catch (error) {
//     console.error(error); // Log error for debugging
//     res.status(503).render('error', { 'error': error });
//   }
// });


// PUT edit compositor
router.post('/edit/:id', function (req, res) {
  Compositor.updateCompositor(req.params.id, req.body)
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



