(function(){
  document.documentElement.classList.add('materials-ready');

  document.querySelectorAll('.material-card').forEach((card, index) => {
    card.style.setProperty('--material-index', index);
  });
})();
