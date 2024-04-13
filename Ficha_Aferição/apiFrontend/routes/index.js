var express = require('express');
var router = express.Router();

var express = require('express');
var router = express.Router();
var axios = require('axios')

var d = new Date().toISOString().substring(0, 16)

/* ---------- GET ----------*/

/* Pessoas home page */
router.get('/', function(req, res, next) {
  axios.get('http://localhost:7777/dataset')
    .then(resposta => {
      res.render('listaPessoas', {lista : resposta.data, data: d, titulo: "Lista de pessoas"})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro ao recuperar as pessoas"})
    })
});

/* Pessoas register */
router.get('/registo', function(req, res, next) {
  res.render('registoPessoa', {data: d, titulo: "Registo de pessoa"})
});

// GET /dataset/delete/:id --------------------------------------------------------------------
router.get('/delete/:id', function(req, res) {
  // Proceder com a deleção do pessoa
  axios.delete('http://localhost:7777/dataset/delete/' + req.params.id)
    .then(() => {
      // Redirecionar para a lista de pessoas ou renderizar confirmação
      res.redirect('/');
    })
    .catch(error => {
      // Tratar o erro de deleção
      console.error('Error deleting:', error);
      res.render('error', {error: error, message: "Erro ao deletar"});
    });
});


// GET /dataset/edit/:id --------------------------------------------------------------------
router.get('/edit/:id', function(req, res, next) {
  axios.get('http://localhost:7777/dataset/' + req.params.id)
      .then(resposta => {
          res.render('editPessoa', {pessoa: resposta.data, data: d, titulo: "Edit de pessoa"})
      })
      .catch(erro => {
          res.render('error', {error: erro, message: "Erro ao editar a pessoa"})
      })
});

/* Pessoas por id */
router.get('/:id', function(req, res, next) {
  axios.get('http://localhost:7777/dataset/' + req.params.id)
  .then(resposta => {

    res.render('Pessoa', {pessoa : resposta.data, data: d, titulo: "Consulta de pessoa"})
  })
  .catch(erro => {
    res.render('error', {error: erro, message: "Erro ao recuperar o pessoa"})
  })
});

/* ---------- POST ----------*/

/* Pessoa register */
router.post('/registo', function(req, res) {
  // Registrar o novo pessoa
  axios.post('http://localhost:7777/dataset', req.body)
    .then(resposta => {
      // Após o registro bem-sucedido, renderizar a página de confirmação
      // A resposta da API pode ser usada para passar informações adicionais, se necessário
      // Aqui, estamos apenas supondo que você deseja mostrar uma confirmação genérica
      res.render('confirmRegisto', {info: req.body, data : d, titulo: "Registo de pessoa com sucesso"});
    })
    .catch(erro => {
      // Tratar erros durante o registro do pessoa
      console.error('Erro ao registrar pessoa:', erro);
      res.render('error', {error: erro, message: "Erro ao registar um novo pessoa"});
    });
});

// POST /pessoas/edit/:id --------------------------------------------------------------------
router.post('/edit/:id', function(req,res){
  console.log(JSON.stringify(req.body))
  axios.put('http://localhost:7777/dataset/edit/' + req.params.id, req.body)
  .then(() => {
    res.render('confirmEdit', {info: req.body, data: d, titulo: "Edit de Pessoa com Sucesso"})
  })
  .catch(erro => {
    res.render('error', {error: erro, message: "Erro ao editar2 o pessoa"})
  })
});

module.exports = router;
