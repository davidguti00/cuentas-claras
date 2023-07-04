
//funciones para hacer el calculo del gasto total
export const totalGastado = (array) => {
    if(array){
        const sumaTotal = array.reduce((acumulador, obj) => {
            if (!isNaN(obj.gasto)) {
                return acumulador + parseFloat(obj.gasto);
            }else {
                return acumulador;
            }
        }, 0);
        return sumaTotal.toFixed(2);
    } else {
        return null;
    }
};

//funcion para obtener el promedio de gastos por usuario
export const gastoPromedioPorPersona = (array) => {
    if (array) {
        const usuariosConGastos = array.filter((user) => !isNaN(user.gasto));
        const total = totalGastado(usuariosConGastos);
        const promedio = total / usuariosConGastos.length;
        return promedio.toFixed(2);
    } else {
        return null;
    }
};

// funcion para calcular los gastos y deudores
export const dividirGastosEquitativamente = (array) => {
    const promedioGasto = gastoPromedioPorPersona(array)

    // Calculamos cuánto debe cada usuario en base al gasto promedio
    const deudasEquitativas = array.map((user) => ({
        nombre: user.nombre,
        monto: promedioGasto - parseFloat(user.gasto),
    }));

    // Ajustamos las deudas para que cada usuario pague la cantidad equitativa
    const deudasAjustadas = [];
    while (deudasEquitativas.length > 0) {
        const deudor = deudasEquitativas.shift();
        while (deudor && deudor.monto !== undefined  && deudor.monto < 0 && deudasEquitativas.length > 0)  {
            const acreedor = deudasEquitativas.pop();
            const montoPago = Math.min(
                deudor.monto !== undefined ? -deudor.monto.toFixed(2) : 0,
                acreedor.monto
            );
            deudasAjustadas.push({
                deudor: acreedor.nombre,
                acreedor: deudor.nombre,
                monto: montoPago.toFixed(2)
            });
            deudor.monto += montoPago;
                acreedor.monto -= montoPago;
                if (acreedor.monto > 0) {
                    deudasEquitativas.push(acreedor);
                }
        }
    }
    return deudasAjustadas;
}




