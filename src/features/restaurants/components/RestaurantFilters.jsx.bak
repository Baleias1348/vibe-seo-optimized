import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

// These could be dynamically generated from your data or remain predefined
export const predefinedSpecialties = [
  { value: "all", label: "Todas las Especialidades" },
  { value: "pizza", label: "Pizza" },
  { value: "sushi", label: "Sushi" },
  { value: "carnes", label: "Carnes" },
  { value: "chilena", label: "Chilena" },
  { value: "italiana", label: "Italiana" },
  { value: "peruana", label: "Peruana" },
  { value: "hamburguesa", label: "Hamburguesa" },
  { value: "cafeteria", label: "Cafetería" },
  { value: "bar", label: "Bar" },
  { value: "mariscos", label: "Mariscos" },
  { value: "vegetariana", label: "Vegetariana/Vegana" },
  { value: "asiatica", label: "Asiática" },
  // Add more based on your 'types' data
];

// Similarly, predefinedNeighborhoods might be replaced by unique 'city' values from your DB
export const predefinedNeighborhoods = [
  { value: "all", label: "Todos los Barrios/Ciudades" },
  { value: "santiago", label: "Santiago" }, // Example, adapt to your data
  { value: "providencia", label: "Providencia" },
  { value: "las condes", label: "Las Condes" },
  { value: "vitacura", label: "Vitacura" },
  { value: "ñuñoa", label: "Ñuñoa" },
  // Add more based on your 'city' data
];


const RestaurantFilters = ({
  searchTerm,
  setSearchTerm,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedNeighborhood, // This might be city based on new structure
  setSelectedNeighborhood,
}) => {
  return (
    <div className="mb-8 md:mb-10 p-5 md:p-6 bg-card rounded-xl shadow-xl border border-border/60">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-end">
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="searchTerm" className="block text-sm font-medium text-muted-foreground mb-1.5">Buscar Restaurante</label>
          <div className="relative">
            <Input
              id="searchTerm"
              type="text"
              placeholder="Nombre, tipo, dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-base rounded-lg shadow-sm border-input focus:border-primary focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div>
          <label htmlFor="specialtyFilter" className="block text-sm font-medium text-muted-foreground mb-1.5">Especialidad (Tipo)</label>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger id="specialtyFilter" className="w-full rounded-lg shadow-sm border-input focus:border-primary focus:ring-primary py-2.5 text-base">
              <SelectValue placeholder="Seleccionar especialidad" />
            </SelectTrigger>
            <SelectContent>
              {predefinedSpecialties.map(spec => (
                <SelectItem key={spec.value} value={spec.value} className="text-base">{spec.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          {/* This filter might need to be renamed to "Ciudad" or similar based on your 'city' column */}
          <label htmlFor="neighborhoodFilter" className="block text-sm font-medium text-muted-foreground mb-1.5">Barrio / Ciudad</label>
          <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
            <SelectTrigger id="neighborhoodFilter" className="w-full rounded-lg shadow-sm border-input focus:border-primary focus:ring-primary py-2.5 text-base">
              <SelectValue placeholder="Seleccionar barrio/ciudad" />
            </SelectTrigger>
            <SelectContent>
              {predefinedNeighborhoods.map(hood => (
                <SelectItem key={hood.value} value={hood.value} className="text-base">{hood.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFilters;