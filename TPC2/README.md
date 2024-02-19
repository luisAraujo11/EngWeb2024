# TPC2: Mapa variavel
## 2024-02-19
	
## Autor:
- A96351
- Luís Alberto Barreiro Araújo
	
## Resumo
	
Processar o dataset do mapa virtual:
 -> Criar uma página(estática) para cada cidade c1.html, c2.html, ...
 -> Criar página inicial com lista de cidades por ordem alfabética em que cada cidade tem o link para o serviço que vai buscar a página.
 -> Serviço em node, geração das páginas em python
 -> Serviço em Node:
 	/ => pág. principal
 	/c1 => pág da cidade c1
 -> Página da Cidade:
 	- nome, id, distrito, população
 	- ligações
 EX: <a href="http://localhost:7778/c3">Braga</a>
