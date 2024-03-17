var http = require('http')
var fs = require('fs')
var url = require('url')
var axios = require('axios')
const { parse } = require('querystring');
var static = require('./static.js')             // Colocar na mesma pasta
var templates = require('./templates')          // Necessario criar e colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

var compositoresServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    var comp_regex = /\/compositores\/C[0-9]{2,3}/
    var comp_por_per_regex = /\/compositores\?periodo=(\w+)/
    var edit_comp_regex = /\/compositores\/edit\/C[0-9]{2,3}/
    var del_comp_regex = /\/compositores\/delete\/C[0-9]{2,3}/

    var per_regex = /\/periodos\/\w+(?<!edit|delete)/ // evita entrar no edit e delete (look ahead)
    var edit_per_regex = /\/periodos\/edit\/\w+/
    var del_per_regex = /\/periodos\/delete\/\w+/

    // Handling request
    if (static.staticResource(req)) {
        static.serveStaticResource(req, res)
    }
    else {
        switch (req.method) {
            case "GET":
                if (req.url == "/") { // pagina principal
                    fs.readFile('principal.html', function (erro, dados) {
                        res.writeHead(200, { 'Content-Type': 'text/html' })
                        res.write(dados)
                        res.end()
                    })
                }
                // GET /compositores --------------------------------------------------------------------
                else if (req.url == '/compositores') {
                    axios.get('http://localhost:3000/compositores')
                        .then(resposta => {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            res.end(templates.composersListPage(resposta.data, d))
                        })
                        .catch(erro => {
                            res.writeHead(520, { 'Content-Type': 'text/html' })
                            res.end(templates.errorPage(erro, d))
                        })
                }

                // GET /compositores por periodo --------------------------------------------------------------------
                else if (comp_por_per_regex.test(req.url)) {
                    axios.get('http://localhost:3000' + req.url)
                        .then(resposta => {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            res.end(templates.composersListPage(resposta.data, d))
                        })
                        .catch(erro => {
                            res.writeHead(520, { 'Content-Type': 'text/html' })
                            res.end(templates.errorPage(erro, d))
                        })
                }

                // GET /compositores/id --------------------------------------------------------------------
                else if (comp_regex.test(req.url)) {
                    axios.get('http://localhost:3000' + req.url)
                        .then(resposta => {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            res.end(templates.composerPage(resposta.data, d))
                        })
                        .catch(erro => {
                            res.writeHead(520, { 'Content-Type': 'text/html' })
                            res.end(templates.errorPage(erro, d))
                        })
                }

                // GET /compositores/registo --------------------------------------------------------------------
                else if (req.url == '/compositores/registo') {
                    res.writeHead(200, { 'Content-Type': 'text/html' })
                    res.end(templates.composerFormPage(d))
                }

                // GET /periodos/registo --------------------------------------------------------------------
                else if (req.url == '/periodos/registo') {
                    // Example list - replace with actual data source
                    let list = []; // This could be empty or fetched dynamically
                
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    // Pass the list as an argument to the template function
                    res.end(templates.periodoFormPage(d, list));
                }
                
                // GET /periodos --------------------------------------------------------------------
                else if (req.url == '/periodos') {
                    console.log("11111")
                    axios.get('http://localhost:3000/periodos')
                        .then(resposta => {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            res.end(templates.periodosListPage(resposta.data, d))
                        })
                        .catch(erro => {
                            res.writeHead(520, { 'Content-Type': 'text/html' })
                            res.end(templates.errorPage(erro, d))
                        })
                }

                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if (edit_comp_regex.test(req.url)) {
                    var partes = req.url.split('/')
                    idCompositor = partes[partes.length - 1] // partes(3) 
                    axios.get('http://localhost:3000/compositores/' + idCompositor)
                        .then(resposta => {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            res.end(templates.composerFormEditPage(resposta.data, d))
                        })
                        .catch(erro => {
                            res.writeHead(520, { 'Content-Type': 'text/html' })
                            res.end(templates.errorPage(erro, d))
                        })
                }
                // GET /periodos/edit/:id --------------------------------------------------------------------
                else if (edit_per_regex.test(req.url)) {
                    console.log("33333")
                    var partes = req.url.split('/')
                    idPeriodo = partes[partes.length - 1] // partes(3) 
                    axios.get('http://localhost:3000/periodos/' + idPeriodo)
                        .then(resposta => {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            res.end(templates.periodoFormEditPage(resposta.data, d))
                        })
                        .catch(erro => {
                            res.writeHead(520, { 'Content-Type': 'text/html' })
                            res.end(templates.errorPage(erro, d))
                        })
                }

                // GET /composer/delete/:id --------------------------------------------------------------------
                else if (del_comp_regex.test(req.url)) {
                    var partes = req.url.split('/')
                    idComp = partes[partes.length - 1] // partes(3) 
                    axios.delete('http://localhost:3000/compositores/' + idComp)
                        .then(resposta => {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            res.end(templates.composerPage(resposta.data, d))
                        })
                        .catch(erro => {
                            res.writeHead(521, { 'Content-Type': 'text/html' })
                            res.end(templates.errorPage(erro, d))
                        })
                }

                // GET /periodos/delete/:id --------------------------------------------------------------------
                else if (del_per_regex.test(req.url)) {
                    console.log("44444")
                    var partes = req.url.split('/')
                    idPeriodo = partes[partes.length - 1] // partes(3) 
                    axios.delete('http://localhost:3000/periodos/' + idPeriodo)
                        .then(resposta => {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            res.end(templates.periodoPage(resposta.data, d))
                        })
                        .catch(erro => {
                            res.writeHead(521, { 'Content-Type': 'text/html' })
                            res.end(templates.errorPage(erro, d))
                        })
                }

                // GET /periodos/id --------------------------------------------------------------------
                else if (per_regex.test(req.url)) {
                    console.log("22222")
                    axios.get('http://localhost:3000' + req.url)
                        .then(resposta => {
                            res.writeHead(200, { 'Content-Type': 'text/html' })
                            res.end(templates.periodoPage(resposta.data, d))
                        })
                        .catch(erro => {
                            res.writeHead(520, { 'Content-Type': 'text/html' })
                            res.end(templates.errorPage(erro, d))
                        })
                }

                // GET ? -> Lancar um erro
                else {
                    res.writeHead(404, { 'Content-Type': 'text/html' })
                    res.end(templates.errorPage(req.url, d))
                }
                break

            case "POST":
                // POST /compositores/registo --------------------------------------------------------------------
                if (req.url == '/compositores/registo') {
                    collectRequestBodyData(req, result => {
                        if (result) {
                            axios.post('http://localhost:3000/compositores', result)
                                .then(resposta => {
                                    res.writeHead(200, { 'Content-Type': 'text/html' })
                                    res.end(templates.composerPage(resposta.data, d))
                                })
                                .catch(erro => {
                                    res.writeHead(520, { 'Content-Type': 'text/html' })
                                    res.end(templates.errorPage(erro, d))
                                })
                        }
                        else {
                            res.writeHead(500, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>Unable to colect data from body...</p>")
                            res.end()
                        }
                    })
                    return
                }

                // POST /periodos/registo --------------------------------------------------------------------
                if (req.url == '/periodos/registo') {
                    console.log("55555")
                    collectRequestBodyData(req, result => {
                        if (result) {
                            axios.post('http://localhost:3000/periodos', result)
                                .then(resposta => {
                                    res.writeHead(200, { 'Content-Type': 'text/html' })
                                    res.end(templates.periodoPage(resposta.data, d))
                                })
                                .catch(erro => {
                                    res.writeHead(520, { 'Content-Type': 'text/html' })
                                    res.end(templates.errorPage(erro, d))
                                })
                        }
                        else {
                            res.writeHead(500, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>Unable to colect data from body...</p>")
                            res.end()
                        }
                    })
                }


                // POST /compositores/edit/:id --------------------------------------------------------------------
                else if (edit_comp_regex.test(req.url)) {
                    var partes = req.url.split('/')
                    idCompositor = partes[partes.length - 1] // partes(3) 
                    collectRequestBodyData(req, result => {
                        if (result) {
                            axios.put('http://localhost:3000/compositores/' + idCompositor, result)
                                .then(resposta => {
                                    res.writeHead(200, { 'Content-Type': 'text/html' })
                                    res.end(templates.composerPage(resposta.data, d))
                                })
                                .catch(erro => {
                                    res.writeHead(520, { 'Content-Type': 'text/html' })
                                    res.end(templates.errorPage(erro, d))
                                })
                        }
                        else {
                            res.writeHead(500, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>Unable to colect data from body...</p>")
                            res.end()
                        }
                    })
                }

                // POST /periodos/edit/:id --------------------------------------------------------------------
                else if (edit_per_regex.test(req.url)) {
                    console.log("666666")
                    var partes = req.url.split('/')
                    idPeriodo = partes[partes.length - 1] // partes(3) 
                    collectRequestBodyData(req, result => {
                        if (result) {
                            axios.put('http://localhost:3000/periodos/' + idPeriodo, result)
                                .then(resposta => {
                                    res.writeHead(200, { 'Content-Type': 'text/html' })
                                    res.end(templates.periodoPage(resposta.data, d))
                                })
                                .catch(erro => {
                                    res.writeHead(520, { 'Content-Type': 'text/html' })
                                    res.end(templates.errorPage(erro, d))
                                })
                        }
                        else {
                            res.writeHead(500, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>Unable to colect data from body...</p>")
                            res.end()
                        }
                    })
                }

                // POST ? -> Lancar um erro
                else {
                    res.writeHead(404, { 'Content-Type': 'text/html' })
                    res.end(templates.errorPage(`Pedido POST não suportado: ${req.url}`, d))
                }
                break

            default:
            // Outros metodos nao sao suportados
        }
    }
})

compositoresServer.listen(7777, () => {
    console.log("Servidor à escuta na porta 7777...")
})