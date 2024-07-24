// src/components/TicketInput.jsx
import React, { useState } from 'react';

const TicketInput = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [linkHref, setLinkHref] = useState('');

  const handleInputChange = (event) => {
    const value = event.target.value;
    setTicketNumber(value);
    setLinkHref(`/report/${value}`);
  };

  return (
    <div className="bg-white  rounded-lg p-8 max-w-sm">
      <h3 className="text-xl font-semibold mb-4">Usar un ticket previo</h3>
      <p className="text-gray-600 mb-4">
        Si ya tienes un número de ticket y quieres complementar el problema anterior. Genera una orden con el mismo número.
      </p>
      <input
        type="text"
        value={ticketNumber}
        onChange={handleInputChange}
        className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        placeholder="Ingrese número de ticket"
      />
      <a href={linkHref} className={`text-blue-500 ${!linkHref ? 'cursor-not-allowed' : 'hover:underline'}`} 
         aria-disabled={!linkHref}>
        Generar reporte de ticket
      </a>
    </div>
  );
};

export default TicketInput;
