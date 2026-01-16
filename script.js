document.addEventListener('DOMContentLoaded', () => {
    // 1. DATOS DE ENTRADA (Extraídos de las imágenes)
    const loanData = {
        totalInstallments: 9,
        installmentAmount: 634.76,
        installmentsPaidByBrand: 2,
        installmentsPaidByAbel: 1
    };

    // 2. CÁLCULOS MATEMÁTICOS
    const totalDebt = loanData.totalInstallments * loanData.installmentAmount;

    const paidByBrand = loanData.installmentsPaidByBrand * loanData.installmentAmount;
    const paidByAbel = loanData.installmentsPaidByAbel * loanData.installmentAmount;

    const totalPaid = paidByBrand + paidByAbel;
    const installmentsPaidTotal = loanData.installmentsPaidByBrand + loanData.installmentsPaidByAbel;

    const remainingInstallments = loanData.totalInstallments - installmentsPaidTotal;
    const remainingDebt = remainingInstallments * loanData.installmentAmount;

    // 3. ACTUALIZAR EL HTML (DOM)

    // Formateador de moneda (Soles Peruanos)
    const formatter = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    });

    document.getElementById('totalDebt').textContent = formatter.format(totalDebt);
    document.getElementById('totalPaid').textContent = formatter.format(totalPaid);
    document.getElementById('remainingDebt').textContent = formatter.format(remainingDebt);

    document.getElementById('brandAmount').textContent = formatter.format(paidByBrand);
    document.getElementById('abelAmount').textContent = formatter.format(paidByAbel);
    document.getElementById('pendingAmount').textContent = formatter.format(remainingDebt);

    // 4. GENERAR GRÁFICO (Chart.js)
    const ctx = document.getElementById('loanChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pagado por Marca', 'Pagado por Abel', 'Pendiente de Pago'],
            datasets: [{
                data: [paidByBrand, paidByAbel, remainingDebt],
                backgroundColor: [
                    '#3B82F6', // Azul Marca
                    '#F59E0B', // Naranja Abel
                    '#E5E7EB'  // Gris Pendiente
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribución del Préstamo'
                }
            }
        }
    });

    // 5. GENERAR TABLA DE PAGOS
    const tableBody = document.getElementById('scheduleBody');

    for (let i = 1; i <= loanData.totalInstallments; i++) {
        const row = document.createElement('tr');

        let status = '';
        let responsible = '';
        let statusClass = '';

        if (i <= loanData.installmentsPaidByBrand) {
            status = 'Pagado';
            responsible = 'Marca de Ropa';
            statusClass = 'status-paid';
        } else if (i <= installmentsPaidTotal) {
            status = 'Pagado';
            responsible = 'Abel';
            statusClass = 'status-paid';
        } else {
            status = 'Pendiente';
            responsible = '---';
            statusClass = 'status-pending';
        }

        row.innerHTML = `
            <td>Cuota ${i}</td>
            <td><span class="${statusClass}">${status}</span></td>
            <td>${responsible}</td>
            <td>${formatter.format(loanData.installmentAmount)}</td>
        `;

        tableBody.appendChild(row);
    }
});