import React, { useEffect, useState } from "react";
// Ajusta el import según dónde esté tu cliente de Supabase
import { supabase } from "../services/supabase";

const SupabaseDebugPage = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function testConsulta() {
      // Prueba simple: consulta la tabla restaurants
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .limit(1);
      setResult(data);
      setError(error);
      // También lo mostramos en consola para fácil inspección
      if (error) {
        console.error("Error al consultar restaurants:", error);
      } else {
        console.log("Respuesta simple de restaurants:", data);
      }
    }
    testConsulta();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2>Debug Supabase</h2>
      <div>
        <strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL || "No definida"}
      </div>
      <div>
        <strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? "[definida]" : "No definida"}
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h3>Variables de entorno</h3>
        <pre style={{ background: '#f6f6f6', padding: '1rem', borderRadius: 8 }}>
          {JSON.stringify(import.meta.env, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8 }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ad8b00' }}>Valor real de VITE_SUPABASE_ANON_KEY expuesto en frontend:</h3>
        <pre style={{ wordBreak: 'break-all', color: '#d48806', fontWeight: 'bold', fontSize: '1.1rem' }}>
          {import.meta.env.VITE_SUPABASE_ANON_KEY || 'NO DEFINIDA'}
        </pre>
        <small style={{ color: '#ad8b00' }}>Copia los primeros y últimos 5 caracteres y compáralos con la clave del dashboard de Supabase.</small>
      </div>
      <div style={{ margin: '16px 0' }}>
        <strong>Resultado consulta simple a restaurants:</strong>
        <pre>{result ? JSON.stringify(result, null, 2) : "Sin datos"}</pre>
        {error && (
          <div style={{ color: 'red' }}>
            <strong>Error:</strong> {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseDebugPage;
