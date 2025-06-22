import React, { useEffect, useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCuisines } from '../services/restaurantService';

const POPULAR_CUISINES = [
  'Chilena',
  'Frutos do mar',
  'Churrascaria',
  'Peruana',
  'Italiana',
  'Japonesa',
  'Pizzaria',
  'Chinesa',
  'Internacional'
];

const RestaurantFilters = ({
  selectedSpecialty,
  setSelectedSpecialty,
}) => {
  const [allCuisines, setAllCuisines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCuisines = async () => {
      try {
        const data = await getCuisines();
        if (data) {
          setAllCuisines(data);
        }
      } catch (error) {
        console.error('Error cargando especialidades:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCuisines();
  }, []);

  const cuisineOptions = useMemo(() => {
    if (isLoading) return [];
    
    // Obtener las opciones populares en el orden especificado
    const popularOptions = POPULAR_CUISINES.map(cuisine => ({
      value: cuisine.toLowerCase(),
      label: cuisine
    }));
    
    // Obtener las demás opciones, excluyendo las populares
    const otherOptions = allCuisines
      .filter(cuisine => !POPULAR_CUISINES.includes(cuisine))
      .map(cuisine => ({
        value: cuisine.toLowerCase(),
        label: cuisine
      }));
    
    return [
      { value: 'all', label: 'Todas las especialidades' },
      { type: 'divider', label: 'o mais procurado' },
      ...popularOptions,
      { type: 'divider' },
      ...otherOptions
    ];
  }, [allCuisines, isLoading]);

  if (isLoading) {
    return (
      <div className="mb-8 md:mb-10 p-5 md:p-6">
        <div className="flex justify-center">
          <div className="w-64 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 md:mb-10 p-4">
      <div className="flex justify-center">
        <div className="w-auto min-w-[280px] max-w-full">
          <label htmlFor="specialtyFilter" className="block text-sm font-medium text-muted-foreground mb-1.5 text-center">
            Filtrar por especialidad
          </label>
          <Select 
            value={selectedSpecialty} 
            onValueChange={setSelectedSpecialty}
            disabled={isLoading}
          >
            <SelectTrigger 
              id="specialtyFilter" 
              className="w-full rounded-lg shadow-sm border-input focus:border-primary focus:ring-primary py-2 text-base"
            >
              <SelectValue placeholder="Todas las especialidades" />
            </SelectTrigger>
            <SelectContent className="max-h-[60vh] overflow-y-auto">
              {cuisineOptions.map((item, index) => {
                if (item.type === 'divider') {
                  return (
                    <div key={`divider-${index}`} className="relative py-1">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      {item.label && (
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            {item.label}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <SelectItem key={item.value} value={item.value} className="text-base">
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFilters;
