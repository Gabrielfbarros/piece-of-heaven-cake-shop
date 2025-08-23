// Obtém o botão do menu e a barra de navegação
const menuBtn = document.getElementById('menu-btn');
const navbar = document.querySelector('.navbar');

// Adiciona um evento de clique ao botão do menu
menuBtn.addEventListener('click', () => {
    // Alterna a classe 'active' na barra de navegação
    // Isso fará com que o menu seja exibido ou escondido
    navbar.classList.toggle('active');
});

// Fecha o menu quando um link é clicado
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});