import React from "react";
export default function TestPhotoProxy() {
  return (
    <div style={{padding:40}}>
      <h1>Prueba de Foto Proxy Google Places</h1>
      <img
        src="/api/photo-proxy?place_id=ChIJw3uG4U7QYpYR9jvV1GJgI6A"
        alt="Test Place"
        style={{width:400, height:'auto', borderRadius:12, boxShadow:'0 2px 12px #0002'}}
      />
      <p>Si ves una foto de una viña real aquí, el proxy funciona correctamente.</p>
    </div>
  );
}
