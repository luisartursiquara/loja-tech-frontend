const API_PRODUTOS = "https://fakestoreapi.com/products";
const listaProdutos = document.getElementById("lista-produtos")
const API_PEDIDOS = "http://127.0.0.1:8000/pedidos";

const botaoFinalizar = document.getElementById("finalizar-compra");
const listaPedidos = document.getElementById("lista-pedidos");

let produtos = []
let carrinho = []
const listaCarrinho = document.getElementById("lista-carrinho")
const totalCarrinho = document.getElementById("total-carrinho")
const pesquisa = document.getElementById("pesquisa")

async function carregarProdutos() {
    try{
        listaProdutos.innerHTML = "<p> A carregar produtos...</p>"
        const resposta = await fetch(API_PRODUTOS)
        if (!resposta.ok) {
            throw new Error("erro ao carregar produtos");
        }
        produtos = await resposta.json()
        mostrarProdutos(produtos)
    } catch(erro){
        console.error(erro)
        listaProdutos.innerHTML = "<p> nao foi possivel caregar os produtos</p>"
    }
}

function mostrarProdutos(lista){
    listaProdutos.innerHTML = ""
    lista.forEach(produto => {
        const card = document.createElement("div")
        card.classList.add("produto")
        card.innerHTML = `
            <img src="${produto.image}" alt="${produto.title}">

            <h3>${produto.title}</h3>

            <p>
                <strong>Preço: </strong>
                ${produto.price.toFixed(2)} €
            </p>

            <button onclick="adicionarCarrinho(${produto.id})">
                Adicionar ao carrinho
            </button>
        `
        listaProdutos.appendChild(card)    
    });
}
 

function adicionarCarrinho(id){
    const produto = produtos.find(produto => produto.id === id)

    const produtoNoCarrinho = carrinho.find(item => item.id === id)

    if(produtoNoCarrinho){
        produtoNoCarrinho.quantidade++
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        })
    }
    mostrarCarrinho()
}

function mostrarCarrinho(){
    listaCarrinho.innerHTML = ""
    if (carrinho.length === 0){
        listaCarrinho.innerHTML = "<p>O carrinho esta vazio</p>"
        totalCarrinho.textContent = "0.00"
        return 
    }
    let total = 0
    carrinho.forEach(item =>{
        const subtotal = item.price * item.quantidade
        total += subtotal
        const elemento = document.createElement("div")
        elemento.classList.add("item-carrinho")
        elemento.innerHTML = `
        <div class="info-carrinho">

        <p>
            <strong>${item.title}</strong>
        </p>

        <p>
            Preço: ${item.price.toFixed(2)} €
        </p>

        <div class="quantidade">
            <button onclick="diminuirQuantidade(${item.id})">
                -
            </button>

            <span>${item.quantidade}</span>

            <button onclick="aumentarQuantidade(${item.id})">
                +
            </button>
        </div>

        <p>
            Subtotal: ${subtotal.toFixed(2)} €
        </p>

        <button
            class="botao-remover"
            onclick="removerDoCarrinho(${item.id})"
        >
            Remover
        </button>

    </div>
    `;
        
        listaCarrinho.appendChild(elemento)
        })
    totalCarrinho.textContent = total.toFixed(2)
}

function removerDoCarrinho(id){
    carrinho = carrinho.filter(item => item.id !== id)
    mostrarCarrinho()
}

pesquisa.addEventListener("input", function() {
    const textoPesquisa = pesquisa.value.toLowerCase()
    const produtosFiltrados = produtos.filter(produto => produto.title.toLowerCase().includes(textoPesquisa))
    mostrarProdutos(produtosFiltrados)
})
function aumentarQuantidade(id) {
    const item = carrinho.find(item => item.id === id);
    if (item) {
        item.quantidade++;
    }
    mostrarCarrinho();
}


function diminuirQuantidade(id) {
    const item = carrinho.find(item => item.id === id);
    if (!item) {
        return;
    }
    if (item.quantidade > 1) {
        item.quantidade--;
    } else {
        carrinho = carrinho.filter(item => item.id !== id);
    }
    mostrarCarrinho();
}

botaoFinalizar.addEventListener("click", async function () {

    if (carrinho.length === 0) {
        alert("O carrinho está vazio.");
        return;
    }

    let total = 0;

    carrinho.forEach(item => {
        total += item.price * item.quantidade;
    });

    try {
        const resposta = await fetch(API_PEDIDOS, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                total: total
            })
        });

        if (!resposta.ok) {
            throw new Error("Erro ao finalizar a compra.");
        }

        const pedido = await resposta.json();

        alert(
            `Compra realizada com sucesso! Pedido nº ${pedido.id}`
        );

        carrinho = [];
        mostrarCarrinho();
        carregarPedidos();

    } catch (erro) {
        console.error(erro);

        alert(
            "Não foi possível finalizar a compra."
        );
    }
});

async function carregarPedidos() {
    try {
        const resposta = await fetch(API_PEDIDOS);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar pedidos.");
        }

        const pedidos = await resposta.json();

        listaPedidos.innerHTML = "";

        if (pedidos.length === 0) {
            listaPedidos.innerHTML =
                "<p>Ainda não existem pedidos.</p>";
            return;
        }

        pedidos.forEach(pedido => {
            const elemento = document.createElement("div");

            elemento.classList.add("pedido");

            elemento.innerHTML = `
                <h3> Pedido:${pedido.id}</h3>

                <p>
                    <strong>Total: </strong>
                    ${pedido.total.toFixed(2)}€
                </p>

                <p>
                    <strong>Estado: </strong>
                    ${pedido.status}
                </p>

                <button
                    class="botao-pago"
                    onclick="marcarComoPago(${pedido.id})"
                >
                    Marcar como pago
                </button>

                <button
                    class="botao-cancelar"
                    onclick="cancelarPedido(${pedido.id})"
                >
                    Cancelar pedido
                </button>



            `;

            listaPedidos.appendChild(elemento);
        });

    } catch (erro) {
        console.error(erro);

        listaPedidos.innerHTML =
            "<p>Não foi possível carregar os pedidos.</p>";
    }
}

async function marcarComoPago(id) {
    
    try{
        const resposta = await fetch(`${API_PEDIDOS}/${id}`, {
            method: "PATCH",

            headers: {
                "Content-Type":"application/json"
            },

            body: JSON.stringify({
                status: "pago"
            })
        })
        if (!resposta.ok) {
            throw new Error("Erro ao atualizar pedido.");
        }

        alert("Pedido marcado como pago")

        carregarPedidos()
    } catch(erro){
        console.error(erro)
        alert("Nao foi possivel alterar o pedido")
    }
}

async function cancelarPedido(id) {

    const confirmar = confirm(
        "tem a certeza de que quer cancelar o pedido?"
    )

    if(!confirmar){
        return
    }

    try{
        const resposta = await fetch(`${API_PEDIDOS}/${id}`, {
            method: "DELETE"
        })

        if (!resposta.ok) {
            throw new Error("Erro ao cancelar pedido.");
        }

        alert("pedido cancelado com sucesso")

        carregarPedidos()
    } catch(erro){
        console.error(erro)
        alert("nao foi possivel cancelar o pedido")
    }
    
}
carregarProdutos()
carregarPedidos()