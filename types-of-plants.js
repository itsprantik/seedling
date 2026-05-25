(function(){
  document.documentElement.classList.add('plants-ready');

  document.querySelectorAll('.indian-plant-card').forEach((card, index) => {
    card.style.setProperty('--plant-index', index);
  });
})();
