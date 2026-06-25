import React, { useState, useEffect } from 'react';

export default function FormularioAbono() {
  // Estados del Formulario
  const [viajeId, setViajeId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [montoOriginal, setMontoOriginal] = useState('');
  const [monedaOriginal, setMonedaOriginal] = useState('COP');
  const [trmDigitada, setTrmDigitada] = useState('1');
  const [medio, setMedio] = useState('Transferencia');
  const [cuentaDestino, setCuentaDestino] = useState('Cuenta de Ahorros Principal');
  const [descripcion, setDescripcion] = useState('');

  // Estados simulados para los selectores dinámicos (En producción vendrían de una API)
  const [viajesActivos] = useState([
    { id: 1, destino: 'Coiba, Panamá - Julio 2026', cupos: 12 },
    { id: 2, destino: 'Mar Rojo - Octubre 2027', cupos: 16 },
    { id: 3, destino: 'Baja California - Noviembre 2026', cupos: 8 },
  ]);

  const [clientes] = useState([
    { id: 4, nombre: 'Carlos Mendoza', identificacion: '10203040' },
    { id: 5, nombre: 'Ana María Restrepo', identificacion: '98765432' },
    { id: 6, nombre: 'Juan Fernando Gómez', identificacion: '45678912' },
  ]);

  // Efecto reactivo para controlar la TRM según la moneda seleccionada
  useEffect(() => {
    if (monedaOriginal === 'COP') {
      setTrmDigitada('1');
    } else {
      setTrmDigitada(''); // Limpiar para obligar al usuario a digitarla manualmente
    }
  }, [monedaOriginal]);

  // Cálculo en tiempo real del Monto Consolidado en COP
  const montoCalculadoCop = parseFloat(montoOriginal || 0) * parseFloat(trmDigitada || 0);

  // Manejo del envío al Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      viaje_id: parseInt(viajeId),
      tipo: 'Ingreso', // Fijo ya que es un abono de cliente
      cliente_id: parseInt(clienteId),
      proveedor_id: null,
      monto_original: parseFloat(montoOriginal),
      moneda_original: monedaOriginal,
      trm_digitada: parseFloat(trmDigitada),
      medio,
      cuenta_origen_destino: cuentaDestino,
      descripcion,
    };

    console.log('Enviando Payload al Backend:', payload);
    
    // Aquí realizarías tu llamada fetch:
    // const response = await fetch('/api/transacciones', { method: 'POST', body: JSON.stringify(payload), ... })
  };

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
      {/* Encabezado del Módulo */}
      <div className="bg-gradient-to-r border-b border-blue-100 bg-blue-50 px-6 py-5">
        <h2 className="text-xl font-bold text-blue-950">Registrar Abono de Cliente</h2>
        <p className="text-sm text-slate-500 mt-1">Módulo de recaudo y control financiero para expediciones</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* SECCIÓN 1: SELECTORES DINÁMICOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Seleccionar Viaje / Destino</label>
            <select
              value={viajeId}
              onChange={(e) => setViajeId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="">-- Seleccione un viaje --</option>
              {viajesActivos.map((v) => (
                <option key={v.id} value={v.id}>{v.destino}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Buceador / Cliente</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
              required
            >
              <option value="">-- Seleccione el cliente --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre} ({c.identificacion})</option>
              ))}
            </select>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* SECCIÓN 2: SELECTOR DE MONEDA (RADIO BUTTONS) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Divisa del Pago</label>
          <div className="grid grid-cols-3 gap-3">
            {['COP', 'USD', 'EUR'].map((moneda) => (
              <label
                key={moneda}
                className={`flex items-center justify-center py-3 px-4 border rounded-xl cursor-pointer font-bold text-sm transition-all shadow-sm
                  ${monedaOriginal === moneda 
                    ? 'bg-blue-600 border-blue-600 text-white ring-2 ring-blue-200' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <input
                  type="radio"
                  name="monedaOriginal"
                  value={moneda}
                  checked={monedaOriginal === moneda}
                  onChange={(e) => setMonedaOriginal(e.target.value)}
                  className="sr-only" // Esconde el radio nativo, mantenemos el contenedor estilizado
                />
                {moneda}
              </label>
            ))}
          </div>
        </div>

        {/* SECCIÓN 3: INPUTS NUMÉRICOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Monto Original</label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400 text-sm font-medium">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={montoOriginal}
                onChange={(e) => setMontoOriginal(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">TRM del Día</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={trmDigitada}
              onChange={(e) => setTrmDigitada(e.target.value)}
              disabled={monedaOriginal === 'COP'}
              placeholder="Ej: 4050.00"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-sm transition-all
                ${monedaOriginal === 'COP' 
                  ? 'bg-slate-100 border-slate-200 text-slate-400 font-medium cursor-not-allowed' 
                  : 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-800'
                }`}
              required
            />
          </div>
        </div>

        {/* SECCIÓN 4: INFORMACIÓN DE PAGO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Medio de Pago</label>
            <select
              value={medio}
              onChange={(e) => setMedio(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Cuenta Destino</label>
            <select
              value={cuentaDestino}
              onChange={(e) => setCuentaDestino(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cuenta de Ahorros Principal">Cuenta de Ahorros Principal</option>
              <option value="ARD Dollar App">ARD Dollar App</option>
              <option value="Caja Menor">Caja Menor</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Observaciones / Descripción (Opcional)</label>
          <textarea
            rows="2"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Detalles específicos del abono..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SECCIÓN 5: DISPLAY EN TIEMPO REAL (MONTO CALCULADO EN COP) */}
        <div className="p-4 bg-slate-900 rounded-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-2 shadow-inner">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Total Consolidado</span>
            <h3 className="text-sm font-medium text-slate-200">Monto Calculado en COP</h3>
          </div>
          <div className="text-right w-full md:w-auto">
            <span className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
              $ {montoCalculadoCop.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Guardar Registro Financiero
        </button>

      </form>
    </div>
  );
}
