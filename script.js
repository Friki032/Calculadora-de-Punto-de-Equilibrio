// Obtener elementos de entrada
const incomeInput = document.getElementById('incomePerUnit');
const variableCostsInput = document.getElementById('variableCosts');
const fixedCostsInput = document.getElementById('fixedCosts');
const resultDiv = document.getElementById('result'); // Asegúrate de tener un div con este id para mostrar resultados
const chartCanvas = document.getElementById('breakEvenChart'); // Canvas para el gráfico

let breakEvenChart; // Variable para almacenar el gráfico

// Listener para validar caracteres mientras el usuario escribe
[incomeInput, variableCostsInput, fixedCostsInput].forEach(input => {
    input.addEventListener('input', function() {
        // Reemplaza cualquier carácter que no sea un número o punto decimal
        this.value = this.value.replace(/[^0-9.]/g, '');
        calculateBreakEvenPoint(); // Llamar a la función de cálculo en cada entrada

    });
});

// Evento al enviar el formulario
document.getElementById('breakEvenForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    calculateBreakEvenPoint(); // También calcular al enviar el formulario
});

// Función para calcular el punto de equilibrio
function calculateBreakEvenPoint() {
    const incomePerUnit = parseFloat(incomeInput.value);
    const variableCosts = parseFloat(variableCostsInput.value);
    const fixedCosts = parseFloat(fixedCostsInput.value);

    // Verificar que los valores sean válidos
    if (isNaN(incomePerUnit) || isNaN(variableCosts) || isNaN(fixedCosts)) {
        resultDiv.innerHTML = ''; // Limpiar resultados si los valores son inválidos
        return;
    }

    if (incomePerUnit <= variableCosts) {
        resultDiv.innerHTML = 'Los ingresos por unidad deben ser mayores que los costos variables por unidad.';
        return;
    }

    // Cálculo del punto de equilibrio
    const breakEvenUnits = fixedCosts / (incomePerUnit - variableCosts);
    const breakEvenValue = breakEvenUnits * incomePerUnit;

    // Mostrar resultados en texto
    resultDiv.innerHTML = `
        <p>Punto de Equilibrio: ${breakEvenUnits.toFixed(2)} unidades</p>
        <p>Valor Monetario del Punto de Equilibrio: $${breakEvenValue.toFixed(2)}</p>
    `;

    // Mostrar gráfico
    renderChart(incomePerUnit, variableCosts, fixedCosts, breakEvenUnits);
}

// Función para renderizar el gráfico
function renderChart(incomePerUnit, variableCosts, fixedCosts, breakEvenUnits) {
    const units = [];
    const totalCosts = [];
    const totalRevenue = [];

    // Generar datos de hasta el doble del punto de equilibrio
    for (let i = 0; i <= breakEvenUnits * 2; i++) {
        units.push(i);
        totalCosts.push(fixedCosts + (i * variableCosts)); // Costos totales (fijos + variables)
        totalRevenue.push(i * incomePerUnit); // Ingresos totales
    }

    // Destruir el gráfico anterior si existe
    if (breakEvenChart) {
        breakEvenChart.destroy();
    }

    // Crear el nuevo gráfico
    breakEvenChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: units,
            datasets: [
                {
                    label: 'Costos Totales',
                    data: totalCosts,
                    borderColor: 'red',
                    fill: false,
                },
                {
                    label: 'Ingresos Totales',
                    data: totalRevenue,
                    borderColor: 'green',
                    fill: false,
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Unidades Vendidas'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Ingresos/Costos'
                    }
                }
            }
        }
    });
}
