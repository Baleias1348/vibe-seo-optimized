import React from 'react';
import { Link } from 'react-router-dom';
import { Wine, MapPin, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VinicolaListPage from '../vinicolas/VinicolaListPage';

const VinhosEVinhedosPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Wine className="h-6 w-6 mr-2" />
            <span className="font-medium">Descubra o melhor do vinho chileno</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Vinhos e Vinhedos do Chile</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Explore as melhores vinícolas do Chile, conheça seus processos de produção e desfrute de degustações inesquecíveis nas paisagens mais impressionantes do país.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/vinicolas">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-gray-100">
                Explorar Vinícolas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#regioes" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-white/10 hover:bg-white/20 transition-colors">
              <MapPin className="h-5 w-5 mr-2" />
              Ver Regiões
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Descubra as melhores vinícolas</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            O Chile é conhecido por seus vinhos de classe mundial. Explore nossas seleções especiais e encontre a experiência perfeita para você.
          </p>
        </div>

        {/* Vinícolas em Destaque */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 id="destaques" className="text-2xl font-bold text-gray-900">Destaques</h3>
            <Link to="/vinicolas" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
              Ver todas <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <VinicolaListPage />
        </div>

        {/* Regiões Vinícolas */}
        <div id="regioes" className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Principais Regiões Vinícolas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Vale do Maipo',
                description: 'Conhecido como o berço do Cabernet Sauvignon chileno, com vinhedos aos pés da Cordilheira dos Andes.',
                image: 'https://images.unsplash.com/photo-1506372023823-6c903e9a6c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              },
              {
                name: 'Vale de Colchagua',
                description: 'Famosa por seus vinhos tintos encorpados, especialmente Carménère, em meio a belas paisagens rurais.',
                image: 'https://images.unsplash.com/photo-1591552166362-7e6e9b4b3b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              },
              {
                name: 'Vale de Casablanca',
                description: 'Reconhecida por seus vinhos brancos frescos, especialmente Sauvignon Blanc e Chardonnay.',
                image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              },
              {
                name: 'Vale do Aconcágua',
                description: 'Com um clima mediterrâneo, produz vinhos elegantes e complexos, especialmente tintos.',
                image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              },
              {
                name: 'Vale de Maule',
                description: 'Uma das regiões mais antigas, conhecida por suas vinhas antigas e vinhos orgânicos.',
                image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              },
              {
                name: 'Vale de San Antonio',
                description: 'Região costeira que produz vinhos brancos frescos e elegantes, especialmente Pinot Noir.',
                image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
              }
            ].map((region, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={region.image} 
                    alt={`Vale de ${region.name}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{region.name}</h4>
                  <p className="text-gray-600 mb-4">{region.description}</p>
                  <Link 
                    to={`/vinicolas?region=${encodeURIComponent(region.name)}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
                  >
                    Ver vinícolas <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VinhosEVinhedosPage;
