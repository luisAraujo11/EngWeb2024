# TPC3: Filmes
## 2024-02-26
	
## Autor:
- A96351
- Luís Alberto Barreiro Araújo
	
## Resumo
	
1. Análise de dataset e criação de DB em json-server
(o stôr deu a entender q vale a pena mudar o dataset (aplicar normalização, pôr na 1ª forma)

2. Serviço que responde às seguintes rotas:
-> GET /filmes (listagem dos filmes, cada entrada é link para a pag do filme)
-> GET /filmes/id_filme (pag com toda a inf do filme: título, ano,  atores e generos (as 2 ultimas páginas levam p  pag do ator/genero)
-> GET /generos
-> GET /generos/id_gen
-> GET /ator
-> GET /ator/id_ator
