function simulateLoading() {
    const [navigation] = performance.getEntriesByType("navigation");
    const loadTime = (navigation.loadEventEnd - navigation.startTime) / 1000;
    const loadingBar = document.getElementById('loading-bar');
    const spinner = document.getElementById('spinner_js');
    
    // Creamos el texto animado
    const text = "Loading ...";
    spinner.innerHTML = text.split('').map(l => `<span>${l}</span>`).join('');
    const letters = spinner.querySelectorAll('span');
    let idx = 0;
    let width = 0;

    function animateJump() {
        letters.forEach(l => l.classList.remove('jump'));
        letters[idx].classList.add('jump');
        idx = (idx + 1) % letters.length;
    }

    // Intervalo principal, controla barra y saltito
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            document.getElementById('loader').style.display = 'none';
            document.body.style.overflow = 'auto';
        } else {
            width += 1;
            loadingBar.style.width = width + '%';
            animateJump();
            document.body.style.overflow = 'hidden';
        }
    },loadTime); // asegura refresco visual
    
    // Puedes ajustar: Math.max(loadTime,20) para una velocidad mínima garantizada
}

window.onload = simulateLoading;
