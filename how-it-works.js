(function(){
  document.documentElement.classList.add('how-ready');

  document.querySelectorAll('.how-step').forEach((step, index) => {
    step.style.setProperty('--step-index', index);
  });
})();
