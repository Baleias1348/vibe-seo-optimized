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
