// Obtém o contêiner onde os itens do carrinho serão exibidos
const cartItemsContainer = document.getElementById('cart-items');

// Obtém o formulário de pagamento
const paymentForm = document.getElementById('payment-form');

// Obtém o botão "Limpar Carrinho"
const clearCartBtn = document.getElementById('clear-cart-btn');

// Obtém a div para o preço total
const totalPriceDiv = document.getElementById('total-price');

// Obtém o campo de telefone
const phoneInput = document.getElementById('phone');

// Obtém os botões de rádio de pagamento
const paymentOptions = document.getElementsByName('payment-method');

// Obtém o botão de copiar Pix
const copyPixBtn = document.querySelector('.btn-copy-pix');

// Obtém o campo de texto da chave Pix
const pixCodeInput = document.getElementById('pix-code');

// Obtém os novos elementos do parcelamento
const installmentsSelect = document.getElementById('installments');
const installmentPriceSpan = document.getElementById('installment-price');

// Carrega os itens do carrinho do localStorage
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Variável global para armazenar o preço total
let cartTotal = 0;

// Função para exibir os itens do carrinho na página
function displayCartItems() {
    cartItemsContainer.innerHTML = '';
    if (totalPriceDiv) {
        totalPriceDiv.innerHTML = '';
    }

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<span class="empty-cart-message">Seu carrinho está vazio.</span>';
        if (clearCartBtn) clearCartBtn.style.display = 'none';
        return;
    }

    const uniqueItems = {};
    cartTotal = 0; // Zera o total antes de calcular

    cartItems.forEach(item => {
        if (uniqueItems[item.name]) {
            uniqueItems[item.name].quantity++;
        } else {
            uniqueItems[item.name] = { ...item, quantity: 1 };
        }
    });

    Object.values(uniqueItems).forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        
        const price = parseFloat(item.price.replace('R$', '').replace(',', '.'));
        cartTotal += price * item.quantity;

        const itemHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="price">${item.price}</p>
                    <span class="quantity">Quantidade: ${item.quantity}</span>
                </div>
            </div>
        `;
        
        itemElement.innerHTML = itemHTML;
        cartItemsContainer.appendChild(itemElement);
    });

    if (totalPriceDiv) {
        totalPriceDiv.innerHTML = `<h3>TOTAL: R$ ${cartTotal.toFixed(2).replace('.', ',')}</h3>`;
    }
    
    // Atualiza o valor da parcela quando os itens são exibidos
    updateInstallmentPrice();
    if (clearCartBtn) clearCartBtn.style.display = 'block';
}

// === Nova função: Atualiza o preço da parcela ===
function updateInstallmentPrice() {
    if (installmentsSelect && installmentPriceSpan) {
        const installments = installmentsSelect.value;
        if (installments > 1) {
            const installmentValue = cartTotal / installments;
            installmentPriceSpan.textContent = `R$ ${installmentValue.toFixed(2).replace('.', ',')} por mês`;
        } else {
            installmentPriceSpan.textContent = ''; // Limpa o texto se for 1x
        }
    }
}

// Adiciona um ouvinte de evento para atualizar o preço quando a opção de parcelas mudar
if (installmentsSelect) {
    installmentsSelect.addEventListener('change', updateInstallmentPrice);
}

// Carrega a página e o carrinho quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();

    // Lógica para mostrar/esconder detalhes de pagamento
    const cardDetails = document.getElementById('card-form');
    const pixDetails = document.getElementById('pix-details');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', () => {
            if (option.value === 'card') {
                if (cardDetails) cardDetails.classList.add('active');
                if (pixDetails) pixDetails.classList.remove('active');
            } else if (option.value === 'pix') {
                if (pixDetails) pixDetails.classList.add('active');
                if (cardDetails) cardDetails.classList.remove('active');
            }
        });
    });
});

// Copiar o botão
if (copyPixBtn) {
    const pixKey = 'chave-pix-ficticia-exemplo';
    const btnOriginalText = copyPixBtn.textContent;

    copyPixBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(pixKey);

            copyPixBtn.textContent = 'Copiado!';
            
            setTimeout(() => {
                copyPixBtn.textContent = btnOriginalText;
            }, 2000); 
        } catch (err) {
            console.error('Falha ao copiar a chave Pix:', err);
            alert('Erro ao copiar. Por favor, tente novamente.');
        }
    });
}

// Formatação do telefone
if (phoneInput) {
    phoneInput.addEventListener('input', (event) => {
        let value = event.target.value.replace(/\D/g, '');
        value = value.substring(0, 11);
        let formattedValue = '';
        
        if (value.length > 0) {
            formattedValue += `(${value.substring(0, 2)}`;
        }
        if (value.length > 2) {
            formattedValue += `) ${value.substring(2, 7)}`;
        }
        if (value.length > 7) {
            formattedValue += `-${value.substring(7, 11)}`;
        }
        
        event.target.value = formattedValue;
    });
}

// Validação e finalização do pedido
if (paymentForm) {
    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let paymentSelected = false;
        let selectedPaymentMethod = null;
        for (const option of paymentOptions) {
            if (option.checked) {
                paymentSelected = true;
                selectedPaymentMethod = option.value;
                break;
            }
        }
        if (!paymentSelected) {
            alert('Por favor, selecione uma forma de pagamento (Cartão de Crédito ou Pix).');
            return;
        }

        if (selectedPaymentMethod === 'card') {
            const cardNumber = document.getElementById('card-number').value;
            const cardName = document.getElementById('card-name').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;

            if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                alert('Por favor, preencha todos os dados do cartão para finalizar o pedido.');
                return;
            }
        }

        const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

        if (!phoneRegex.test(phoneInput.value)) {
            alert('Por favor, insira um número de telefone no formato (XX) XXXXX-XXXX.');
            return;
        }

        alert('Pedido finalizado com sucesso! Entraremos em contato para a entrega.');

        localStorage.removeItem('cart');
        
        window.location.href = 'index.html';
    });
}

// Limpar o carrinho
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            localStorage.removeItem('cart');
            cartItems = [];
            displayCartItems();
        }
    });
}