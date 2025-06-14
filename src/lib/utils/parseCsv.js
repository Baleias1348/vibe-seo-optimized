import Papa from 'papaparse';

export const parseVinicolaCsv = async () => {
  try {
    const response = await fetch('/data/vinicolas.csv');
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Filtrar filas vacías y limpiar los datos
          const cleanedData = results.data
            .filter(row => row['Vinícola'] && row['Vinícola'].trim() !== '')
            .map(row => {
              // Limpiar los valores de cada fila
              const cleanedRow = {};
              Object.entries(row).forEach(([key, value]) => {
                cleanedRow[key] = value ? value.trim() : '';
              });
              return cleanedRow;
            });
          
          resolve(cleanedData);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV file:', error);
    return [];
  }
};

export const getVinicolaBySlug = async (slug) => {
  const vinerias = await parseVinicolaCsv();
  return vinerias.find(v => 
    v['Vinícola'].toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );
};
