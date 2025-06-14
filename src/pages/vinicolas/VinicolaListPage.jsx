import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import VinicolaCard from '@/components/shared/VinicolaCard';
import { parseVinicolaCsv } from '@/lib/utils/parseCsv';

const VinicolaListPage = () => {
  const [vinicolas, setVinicolas] = useState([]);
  const [filteredVinicolas, setFilteredVinicolas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar dados do CSV ao montar o componente
  useEffect(() => {
    const loadVinicolas = async () => {
      try {
        setIsLoading(true);
        const data = await parseVinicolaCsv();
        setVinicolas(data);
        setFilteredVinicolas(data);
      } catch (err) {
        console.error('Error loading vinicolas:', err);
        setError('Não foi possível carregar as vinícolas. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    loadVinicolas();
  }, []);

  // Filtrar vinícolas por termo de busca e região selecionada
  useEffect(() => {
    let result = [...vinicolas];
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(vinicola => 
        vinicola['Vinícola'].toLowerCase().includes(term) ||
        vinicola['Cidade / Vale'].toLowerCase().includes(term) ||
        vinicola['Resumo das Opiniões e Pontos Chave'].toLowerCase().includes(term)
      );
    }
    
    // Filtrar por região
    if (selectedRegion !== 'Todas') {
      result = result.filter(vinicola => 
        vinicola['Cidade / Vale'] === selectedRegion
      );
    }
    
    setFilteredVinicolas(result);
  }, [searchTerm, selectedRegion, vinicolas]);

  // Obter regiões únicas para o filtro
  const regions = ['Todas as regiões', ...new Set(vinicolas.map(v => v['Cidade / Vale']).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando vinícolas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Erro</p>
          <p>Não foi possível carregar as vinícolas. Por favor, tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Vinhos e Vinícolas do Chile</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descubra as melhores vinícolas chilenas, com avaliações reais e experiências únicas
          </p>
          
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-2 flex items-center">
            <Search className="text-gray-400 ml-2 mr-2" />
            <Input
              type="text"
              placeholder="Buscar vinícolas..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="relative ml-2">
              <select
                className="appearance-none bg-gray-100 border-0 rounded-md py-2 pl-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{filteredVinicolas.length}</span> de{' '}
            <span className="font-semibold">{vinicolas.length}</span> vinícolas
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Ordenar por:</span>
            <select 
              className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
              onChange={(e) => {
                const sorted = [...filteredVinicolas];
                if (e.target.value === 'rating') {
                  sorted.sort((a, b) => 
                    parseFloat(b['Avaliação (Estrelas ★)']) - parseFloat(a['Avaliação (Estrelas ★)'])
                  );
                } else if (e.target.value === 'reviews') {
                  sorted.sort((a, b) => {
                    const aReviews = parseInt(a['Nº de Avaliações (Aprox.)']?.replace(/[^0-9]/g, '') || '0');
                    const bReviews = parseInt(b['Nº de Avaliações (Aprox.)']?.replace(/[^0-9]/g, '') || '0');
                    return bReviews - aReviews;
                  });
                } else {
                  // Ordenar por nombre por defecto
                  sorted.sort((a, b) => a['Vinícola'].localeCompare(b['Vinícola']));
                }
                setFilteredVinicolas(sorted);
              }}
            >
              <option value="name">Nome (A-Z)</option>
              <option value="rating">Melhor avaliadas</option>
              <option value="reviews">Mais avaliadas</option>
            </select>
          </div>
        </div>

        {/* Vinicolas Grid */}
        {filteredVinicolas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVinicolas.map((vinicola, index) => (
              <VinicolaCard key={`${vinicola['Vinícola']}-${index}`} vinicola={vinicola} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nenhuma vinícola encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente outros termos de busca ou ajuste os filtros.
            </p>
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('Todas');
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Limpar filtros
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VinicolaListPage;
