# TechStore - Front-End

## Descrição

O TechStore é uma aplicação web de uma loja online desenvolvida como projeto académico.

O Front-End permite visualizar produtos obtidos através de uma API externa, pesquisar produtos, adicionar produtos ao carrinho, alterar quantidades e finalizar compras.

Também permite consultar os pedidos realizados, marcar pedidos como pagos e cancelar pedidos.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Docker
- Nginx
- FakeStore API
- TechStore API (Back-End)

## Arquitetura

O projeto utiliza três componentes principais:

1. Front-End TechStore
2. API Back-End TechStore
3. FakeStore API (serviço externo)

Fluxo da aplicação:

Front-End → FakeStore API → Produtos

Front-End → TechStore API → Base de dados SQLite

A FakeStore API fornece os produtos apresentados na loja.

A TechStore API é responsável pela criação, consulta, atualização e eliminação dos pedidos.

## API externa

O projeto utiliza a FakeStore API para obter os produtos da loja.

Endpoint utilizado:

https://fakestoreapi.com/products

Não é necessário realizar registo ou autenticação para utilizar esta API.

Os principais dados utilizados são:

- ID do produto
- Nome
- Preço
- Imagem

## Métodos HTTP utilizados

O Front-End comunica com as APIs utilizando os seguintes métodos HTTP:

- GET - obter produtos e pedidos
- POST - criar um novo pedido
- PATCH - alterar o estado de um pedido
- DELETE - eliminar/cancelar um pedido

## Funcionalidades

- Listagem de produtos
- Pesquisa de produtos
- Carrinho de compras
- Adição e remoção de produtos do carrinho
- Alteração da quantidade dos produtos
- Cálculo automático do total
- Finalização da compra
- Consulta de pedidos
- Alteração do estado do pedido
- Cancelamento de pedidos

## Estrutura do projeto

loja-tech-frontend/

- index.html
- css/
  - style.css
- js/
  - script.js
- Dockerfile
- README.md

## Executar o projeto com Docker

Primeiro é necessário ter o Docker instalado e em execução.

Criar a imagem Docker:

```bash
docker build -t loja-tech-frontend .

#Executar o container

docker run --name techstore-frontend -p 8080:80 loja-tech-frontend

##depois abrir no navegador 

http://127.0.0.1:8080

