// ... (keep most of your original main.js)

// At the top with imports
import { stages, ns } from './stages.js';
import { initStars, drawStars } from './starfield.js';
import { PlasmaSimulation } from './plasma.js';

// ... rest of your code ...

// Update the switchMode function slightly for smoother transition
function switchMode(newMode) {
    if (currentActiveMode === newMode) return;
    currentActiveMode = newMode;

    btnScale.classList.toggle("active", newMode === 'scale');
    btnCosmo.classList.toggle("active", newMode === 'cosmo');

    vpScale.classList.toggle("active", newMode === 'scale');
    vpCosmo.classList.toggle("active", newMode === 'cosmo');

    if (newMode === 'cosmo') {
        cosmoSim.start();
    } else {
        cosmoSim.stop();
        initStars();
    }
}

// Rest of your file remains the same
