// Obtém o botão do menu e a barra de navegação
const menuBtn = document.getElementById('menu-btn');
const navbar = document.querySelector('.navbar');

// Adiciona um evento de clique ao botão do menu
menuBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Fecha o menu quando um link é clicado
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

// === NOVA FUNCIONALIDADE: ADICIONAR AO CARRINHO ===

// Obtém todos os botões "Adicione ao Carrinho"
const addToCartBtns = document.querySelectorAll('.menu .box-container .btn');

// Obtém o elemento que exibirá a contagem do carrinho
const cartCount = document.getElementById('cart-count');

// Obtém o contêiner do carrinho no cabeçalho
const cartBtn = document.getElementById('cart-btn');

// Array para armazenar os itens do carrinho. Inicializa com um array vazio se não houver dados no localStorage.
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Função para atualizar o contador de itens no cabeçalho
function updateCartCount() {
    cartCount.textContent = cartItems.length;
}

// Chama a função ao carregar a página para exibir a contagem correta
updateCartCount();

// Adiciona um evento de clique a cada botão
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        
        // Obtém as informações do produto a partir do HTML
        const productBox = btn.closest('.box');
        const productName = productBox.querySelector('h3').textContent;
        // Pega apenas o primeiro nó de texto para obter o preço atual
        const productPrice = productBox.querySelector('.price').firstChild.textContent.trim();
        const productImage = productBox.querySelector('img').src;

        // Cria um objeto com as informações do produto
        const product = {
            name: productName,
            price: productPrice,
            image: productImage
        };

        // Adiciona o produto ao array de itens do carrinho
        cartItems.push(product);
        
        // Salva o array de itens no localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        // Atualiza o contador de itens
        updateCartCount();

        // Animação do contador
        cartCount.classList.add('animated');
        setTimeout(() => {
            cartCount.classList.remove('animated');
        }, 500);
    });
});

// Adiciona um evento de clique para redirecionar para a página do carrinho
cartBtn.addEventListener('click', () => {
    window.location.href = 'carrinho.html';
});