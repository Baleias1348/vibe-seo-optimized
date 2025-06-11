import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import useRestaurants from '@/hooks/useRestaurants';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import RestaurantList from '@/components/restaurants/RestaurantList';
import Pagination from '@/components/shared/Pagination'; // Assuming Pagination is in shared

const RestaurantsPage = () => {
  const {
    paginatedRestaurants,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    filters, // Contains searchTerm, selectedSpecialty, selectedNeighborhood
    setters  // Contains setSearchTerm, setSelectedSpecialty, setSelectedNeighborhood
  } = useRestaurants();

  return (
    <>
      <Helmet>
        <title>Guia de Restaurantes de Santiago | Vibe Chile</title>
        <meta name="description" content="Descubra os melhores restaurantes em Santiago, Chile, com nosso guia completo. Encontre por especialidade, bairro e mais!" />
        <meta property="og:title" content="Guia de Restaurantes de Santiago | Vibe Chile" />
        <meta property="og:description" content="Explore uma lista curada dos restaurantes de Santiago. Fotos, localizações e avaliações para sua aventura gastronômica." />
      </Helmet>
      <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-red-600">
            Guia Gastronômico de Santiago
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Nossa seleção dos melhores restaurantes da cidade. Filtre e encontre sua próxima experiência culinária!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <RestaurantFilters
            searchTerm={filters.searchTerm}
            setSearchTerm={setters.setSearchTerm}
            selectedSpecialty={filters.selectedSpecialty}
            setSelectedSpecialty={setters.setSelectedSpecialty}
            selectedNeighborhood={filters.selectedNeighborhood}
            setSelectedNeighborhood={setters.setSelectedNeighborhood}
          />
        </motion.div>

        <RestaurantList
          restaurants={paginatedRestaurants}
          isLoading={isLoading}
          error={error}
          searchTerm={filters.searchTerm}
          selectedSpecialty={filters.selectedSpecialty}
          selectedNeighborhood={filters.selectedNeighborhood}
        />
        
        {!isLoading && !error && paginatedRestaurants.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default RestaurantsPage;