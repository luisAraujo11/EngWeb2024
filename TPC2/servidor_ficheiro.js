var http = require('http')
var fs = require('fs')
var url = require('url')

http.createServer(function(req, res){
    var regex = /^\/c\d+.html$/
    var q = url.parse(req.url, true)
    
    if(q.pathname == '/'){
        fs.readFile('cidadesSite/index.html', function(erro, dados){
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(dados)
            res.end()
        })
    }

    else if(q.pathname == '/w3.css'){
        fs.readFile('cidadesSite/w3.css', function(erro, dados){
            res.writeHead(200, {'Content-Type': 'text/css'})
            res.write(dados)
            res.end()
        })
    }

    else if(regex.test(q.pathname)){
        console.log("entrei aqui")
        fs.readFile('cidadesSite' + q.pathname, function(erro, dados){
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(dados)
            res.end()
        })
    }
    
    else{
        res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'})
        res.write('<p>Erro: Pedido não suportado.</p>')
        res.write('<pre>' + q.pathname + '</pre>')
        res.end()
    }
    console.log(q.pathname)
}).listen(7777)