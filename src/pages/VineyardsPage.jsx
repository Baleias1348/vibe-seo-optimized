import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import VineyardCard from '@/components/vineyard/VineyardCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Función para normalizar texto para búsqueda sin acentos en español y portugués
const normalizeText = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    // Eliminar acentos y diacríticos
    .replace(/[\u0300-\u036f]/g, '')
    // Reemplazar caracteres especiales del portugués
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    // Eliminar cualquier otro carácter especial
    .replace(/[^a-z0-9\s]/g, '')
    // Reemplazar múltiples espacios por uno solo
    .replace(/\s+/g, ' ')
    .trim();
};

// Función para normalizar texto para mostrar (mantiene acentos pero limpia el texto)
const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .trim();
};

const VineyardsPage = () => {
    const [vineyards, setVineyards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    const [regions, setRegions] = useState([]);

    useEffect(() => {
        const fetchVineyards = async () => {
            try {
                setLoading(true);
                
                console.log('🔍 Iniciando consulta a Supabase...');
                
                // Intentar con diferentes nombres de tabla posibles
                const possibleTableNames = ['vinhedos', 'vinedos', 'vineyards', 'viñas', 'vinas', 'wineries'];
                let data = null;
                let error = null;
                let foundTable = null;

                // Probar cada nombre de tabla posible
                for (const tableName of possibleTableNames) {
                    console.log(`🔍 Intentando con la tabla: ${tableName}`);
                    try {
                        const result = await supabase
                            .from(tableName)
                            .select('*')
                            .limit(1);
                        
                        if (!result.error) {
                            console.log(`✅ Tabla encontrada: ${tableName}`);
                            data = result.data;
                            foundTable = tableName;
                            break;
                        } else {
                            console.log(`❌ La tabla ${tableName} no está accesible:`, result.error);
                        }
                    } catch (tableError) {
                        console.log(`❌ Error al acceder a la tabla ${tableName}:`, tableError);
                    }
                }

                if (!foundTable) {
                    throw new Error('No se pudo encontrar o acceder a la tabla de viñedos en la base de datos.');
                }
                
                console.log(`ℹ️ Usando la tabla: ${foundTable}`);

                // Configurar la sesión anónima si es necesario
                try {
                    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                    
                    if (sessionError) {
                        console.warn('⚠️ Error al obtener la sesión:', sessionError);
                        // Intentar iniciar sesión como anónimo
                        const { error: signInError } = await supabase.auth.signInAnonymously();
                        if (signInError) {
                            console.error('❌ Error al iniciar sesión anónima:', signInError);
                        }
                    }
                } catch (authError) {
                    console.warn('⚠️ No se pudo configurar la autenticación:', authError);
                    // Continuar de todos modos, puede que no sea necesario autenticarse
                }
                
                // Usar la tabla encontrada en el paso anterior
                const tableName = foundTable;
                
                try {
                    // Primero intentar con consulta básica
                    const result = await supabase
                        .from(tableName)
                        .select('*')
                        .limit(1);
                    
                    if (result.error) throw result.error;
                    
                    data = result.data;
                    error = null;
                    
                } catch (queryError) {
                    console.error('❌ Error en la consulta principal:', queryError);
                    
                    // Si falla, intentar con consulta SQL directa
                    try {
                        console.log('⚠️ Intentando con consulta SQL directa...');
                        const { data: sqlData, error: sqlError } = await supabase
                            .rpc('execute_sql', {
                                query: `SELECT * FROM public.${tableName} LIMIT 1`
                            });
                        
                        if (sqlError) throw sqlError;
                        
                        data = sqlData;
                        error = null;
                        
                    } catch (sqlError) {
                        console.error('❌ Error en consulta SQL directa:', sqlError);
                        throw new Error(`No se pudo acceder a los datos de la tabla ${tableName}. Error: ${sqlError.message}`);
                    }
                }

                console.log('✅ Datos obtenidos de Supabase:', data);

                if (error) {
                    console.error('❌ Error de Supabase:', {
                        message: error.message,
                        code: error.code,
                        details: error.details,
                        hint: error.hint
                    });
                    throw error;
                }

                // Verificar si hay datos y extraer regiones únicas
                if (data && data.length > 0) {
                    // Filtrar y limpiar las regiones
                    const uniqueRegions = [...new Set(
                        data
                            .map(vineyard => {
                                // Normalizar nombres de región
                                const region = vineyard.regiao || vineyard.region || vineyard.región || '';
                                return region ? region.toString().trim() : '';
                            })
                            .filter(region => region) // Filtrar valores vacíos
                            .sort() // Ordenar alfabéticamente
                    )];
                    
                    console.log('Regiones únicas encontradas:', uniqueRegions);
                    setRegions(uniqueRegions);
                    setVineyards(data);
                } else {
                    console.log('No se encontraron viñas');
                    setVineyards([]);
                    setRegions([]);
                }
            } catch (error) {
                console.error('Error al cargar los vinhedos:', error);
                setError('No se pudieron cargar los vinhedos. Por favor, intente nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchVineyards();
    }, []);

    const filteredVineyards = vineyards.filter(vineyard => {
        const searchTermNormalized = normalizeText(searchTerm);
        // Normalizar nombres de campos para manejar inconsistencias
        const vineyardName = vineyard.name || vineyard.nome || vineyard.nombre || 'Sin nombre';
        const vineyardRegion = vineyard.regiao || vineyard.region || 'Sin región especificada';
        
        const vineyardNameNormalized = normalizeText(vineyardName);
        const vineyardRegionNormalized = normalizeText(vineyardRegion);
        const vineyardVariedades = Array.isArray(vineyard.variedades) 
            ? vineyard.variedades.join(' ') 
            : String(vineyard.variedades || '');
        const vineyardVariedadesNormalized = normalizeText(vineyardVariedades);
        
        const matchesSearch = searchTermNormalized === '' || 
            vineyardNameNormalized.includes(searchTermNormalized) ||
            vineyardRegionNormalized.includes(searchTermNormalized) ||
            vineyardVariedadesNormalized.includes(searchTermNormalized);
            
        const matchesRegion = !regionFilter || 
            regionFilter === 'all' ||
            normalizeText(vineyardRegion) === normalizeText(regionFilter);
            
        return matchesSearch && matchesRegion;
    });

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Nuestras Viñas</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-lg" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Nossos Vinhedos</h1>
            <p className="text-muted-foreground mb-8">
                Descubra os melhores vinhedos do Chile e seus vinhos requintados
            </p>
            
            {error && (
                <Alert variant="destructive" className="mb-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <Input
                        placeholder="Buscar vinhedos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="w-full md:w-64">
                    <Select 
                        onValueChange={setRegionFilter} 
                        value={regionFilter}
                        disabled={regions.length === 0}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={
                                regions.length > 0 
                                    ? "Todas as regiões" 
                                    : regions.length === 0 && !loading 
                                        ? "Nenhuma região disponível"
                                        : "Carregando..."
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as regiões</SelectItem>
                            {regions.length > 0 ? (
                                regions.map(region => {
                                    if (!region) return null; // Saltar regiones vacías
                                    return (
                                        <SelectItem key={region} value={region}>
                                            {region}
                                        </SelectItem>
                                    );
                                })
                            ) : (
                                <SelectItem value="none" disabled>
                                    No hay regiones disponibles
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredVineyards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVineyards.map((vineyard) => {
                        // Normalizar datos antes de pasarlos al componente
                        const normalizedVineyard = {
                            ...vineyard,
                            name: vineyard.name || vineyard.nome || vineyard.nombre || 'Sin nombre',
                            region: vineyard.regiao || vineyard.region || vineyard.región || 'Sin región',
                            // Asegurar que los campos requeridos tengan valores por defecto
                            id: vineyard.id || Math.random().toString(36).substr(2, 9),
                            rating: vineyard.rating || 0,
                            reviewCount: vineyard.reviewCount || 0,
                            image: vineyard.image || '/placeholder-vineyard.jpg'
                        };
                        return <VineyardCard key={normalizedVineyard.id} vineyard={normalizedVineyard} />;
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium">Nenhum vinhedo encontrado</h3>
                    <p className="text-muted-foreground mt-2">
                        Tente outros termos de busca ou filtros
                    </p>
                </div>
            )}
        </div>
    );
};

export default VineyardsPage;
