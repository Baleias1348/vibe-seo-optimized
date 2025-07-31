import React from "react";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

function CentrosDeEsquiWidget() {
  return (
    <div style={{background:'#fff',borderRadius:'8px',padding:'1.5em',boxShadow:'0 2px 8px #0001'}}>
      <h2 style={{fontWeight:'bold',fontSize:'1.5em',marginBottom:'0.5em'}}>Widget React: Centros de Esqui</h2>
      <ul>
        <li>Valle Nevado</li>
        <li>La Parva</li>
        <li>El Colorado</li>
        <li>Portillo</li>
      </ul>
      <p style={{marginTop:'1em',color:'#666'}}>Este conteúdo é gerado dinamicamente por React, sob demanda.</p>
    </div>
  );
}

const rootDiv = document.getElementById("react-centros-esqui-root");
if (rootDiv) {
  createRoot(rootDiv).render(<CentrosDeEsquiWidget />);
}
