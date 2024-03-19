var express = require('express');
var router = express.Router();
var axios = require('axios')

/* ---------- GET ----------*/

/* Compositores home page */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/compositores')
    .then(resposta => {
      res.render('listaCompositores', {lista : resposta.data, data: d, titulo: "Lista de compositores"})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro ao recuperar os compositores"})
    })
});

/* Compositores register */
router.get('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.render('registoCompositor', {data: d, titulo: "Registo de compositor"})
});

/* Compositores por id */
router.get('/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/compositores/' + req.params.id)
  .then(resposta => {
    res.render('compositor', {compositor : resposta.data, data: d, titulo: "Consulta de compositor"})
  })
  .catch(erro => {
    res.render('error', {error: erro, message: "Erro ao recuperar1 o compositor"})
  })
});

// GET /composer/delete/:id --------------------------------------------------------------------
router.get('/delete/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16);

  // First, fetch the composer to get their periodo ID
  axios.get(`http://localhost:3000/compositores/${req.params.id}`)
  .then(composerRes => {
    const periodoId = composerRes.data.periodo; // Assuming the composer's data includes the periodo ID

    // Proceed to delete the composer
    axios.delete(`http://localhost:3000/compositores/${req.params.id}`)
    .then(deleteRes => {
      // Now, fetch the relevant period to update its list
      axios.get(`http://localhost:3000/periodos/${periodoId}`)
      .then(periodoRes => {
        const updatedList = periodoRes.data.list.filter(composerId => composerId !== req.params.id);

        // Update the period with the new list
        axios.put(`http://localhost:3000/periodos/${periodoId}`, { ...periodoRes.data, list: updatedList })
        .then(updateRes => {
          // Render confirmation or redirect
          res.redirect('/compositores');
        })
        .catch(updateErr => {
          console.error('Error updating periodo:', updateErr);
          res.render('error', {error: updateErr, message: "Erro ao atualizar o periodo após deletar o compositor"});
        });
      })
      .catch(periodoErr => {
        console.error('Error fetching periodo:', periodoErr);
        res.render('error', {error: periodoErr, message: "Erro ao recuperar o periodo para atualização"});
      });
    })
    .catch(deleteErr => {
      console.error('Error deleting composer:', deleteErr);
      res.render('error', {error: deleteErr, message: "Erro ao deletar o compositor"});
    });
  })
  .catch(composerErr => {
    console.error('Error fetching composer:', composerErr);
    res.render('error', {error: composerErr, message: "Erro ao recuperar o compositor para deleção"});
  });
});

// GET /compositores/edit/:id --------------------------------------------------------------------
router.get('/edit/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/compositores/' + req.params.id)
      .then(resposta => {
          res.render('editCompositor', {compositor: resposta.data, data: d, titulo: "Edit de compositor"})
      })
      .catch(erro => {
          res.render('error', {error: erro, message: "Erro ao editar1 o compositor"})
      })
});

/* ---------- POST ----------*/

/* Compositores register */
router.post('/registo', function(req, res){
  var d = new Date().toISOString().substring(0, 16);

  // Register the new composer
  axios.post('http://localhost:3000/compositores', req.body)
  .then(resposta => {
    // Assuming the new composer's ID is needed and provided in the response
    // If the API doesn't return the new ID, you might already have it in `req.body.id`
    var newComposerId = req.body.id; // or resposta.data.id if the ID is in the response

    // Find the period by its ID from the `periodo` field in the form
    var periodoId = req.body.periodo;
    axios.get(`http://localhost:3000/periodos/${periodoId}`)
    .then(periodoRes => {
      // Ensure the period's list is an array; if not, initialize it
      var updatedList = periodoRes.data.list || [];
      updatedList.push(newComposerId);

      // Update the period with the new list
      axios.put(`http://localhost:3000/periodos/${periodoId}`, { ...periodoRes.data, list: updatedList })
      .then(updateRes => {
        // After successfully updating the period, render the confirmation page
        res.render('confirmRegisto', {info: req.body, data: d, titulo: "Registo de compositor com Sucesso"});
      })
      .catch(updateErr => {
        // Handle errors during the period update
        console.error('Error updating periodo:', updateErr);
        res.render('error', {error: updateErr, message: "Erro ao atualizar o periodo com novo compositor"});
      });
    })
    .catch(periodoErr => {
      // Handle errors fetching the period
      console.error('Error fetching periodo:', periodoErr);
      res.render('error', {error: periodoErr, message: "Erro ao recuperar o periodo para atualização"});
    });
  })
  .catch(erro => {
    // Handle errors during composer registration
    console.error('Error registering composer:', erro);
    res.render('error', {error: erro, message: "Erro ao gravar um compositor novo"});
  });
});


// POST /compositores/edit/:id --------------------------------------------------------------------
router.post('/edit/:id', function(req,res){
  var d = new Date().toISOString().substring(0, 16)
  console.log(JSON.stringify(req.body))
  axios.put('http://localhost:3000/compositores/' + req.params.id, req.body)
  .then(resposta => {
    res.render('confirmEdit', {info: req.body, data: d, titulo: "Edit de compositor com Sucesso"})
  })
  .catch(erro => {
    res.render('error', {error: erro, message: "Erro ao editar2 o compositor"})
  })
});

module.exports = router;