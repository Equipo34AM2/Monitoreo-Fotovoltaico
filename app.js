// 1. CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
    // === PON TU ENLACE DE FIREBASE AQUÍ ===
    databaseURL: "https://panel-solar-webapp-default-rtdb.firebaseio.com/" 
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. CONFIGURACIÓN DE LA GRÁFICA (Estilo Dark Mode)
const ctx = document.getElementById('graficaPrincipal').getContext('2d');

const maxPuntos = 15;
let etiquetasTiempo = [];
let datosVoltaje = [];
let datosCorriente = [];

// Configuración de Chart.js para parecerse a la imagen
Chart.defaults.color = '#a0a5b8'; // Letras grises/blancas
Chart.defaults.font.family = 'Segoe UI';

const graficaPrincipal = new Chart(ctx, {
    type: 'line',
    data: {
        labels: etiquetasTiempo,
        datasets: [
            {
                label: 'Voltaje (V)',
                data: datosVoltaje,
                borderColor: '#5cd682', // Verde luminoso
                backgroundColor: 'rgba(92, 214, 130, 0.3)', // Verde transparente
                borderWidth: 2,
                fill: true,
                tension: 0.4, // Hace la curva suave
                yAxisID: 'y'
            },
            {
                label: 'Corriente (mA)',
                data: datosCorriente,
                borderColor: '#f5b041', // Naranja/Amarillo luminoso
                backgroundColor: 'rgba(245, 176, 65, 0.3)', // Naranja transparente
                borderWidth: 2,
                fill: true,
                tension: 0.4, // Hace la curva suave
                yAxisID: 'y1'
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: {
            x: { 
                grid: { color: 'rgba(255, 255, 255, 0.05)' } 
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Voltaje (V)' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Corriente (mA)' },
                grid: { drawOnChartArea: false } // Para no cruzar las líneas del fondo
            }
        }
    }
});

// 3. LEER DATOS DE FIREBASE EN TIEMPO REAL
const panelRef = database.ref('/LecturasPanel');

panelRef.on('value', (snapshot) => {
    const datos = snapshot.val();
    
    if (datos) {
        // Actualizar números gigantes
        document.getElementById('valor-voltaje').innerText = datos.Voltaje.toFixed(2) + ' V';
        document.getElementById('valor-corriente').innerText = datos.Corriente.toFixed(2) + ' mA';
        document.getElementById('valor-potencia').innerText = datos.Potencia.toFixed(2);
        
        const ahora = new Date();
        const horaTexto = ahora.toLocaleTimeString();
        document.getElementById('ultima-act').innerText = 'Actualizado hoy, ' + horaTexto;

        // Actualizar Gráfica
        etiquetasTiempo.push(horaTexto);
        datosVoltaje.push(datos.Voltaje);
        datosCorriente.push(datos.Corriente);

        if (etiquetasTiempo.length > maxPuntos) {
            etiquetasTiempo.shift();
            datosVoltaje.shift();
            datosCorriente.shift();
        }

        graficaPrincipal.update();
    }
});