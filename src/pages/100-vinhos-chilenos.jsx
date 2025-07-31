import React, { useMemo, useState } from "react";
import { Chart, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const wineData = [
  { nome: "Viña Don Melchor Cabernet Sauvignon Puente Alto", bodega: "Viña Don Melchor (Concha y Toro)", cepa: "Cabernet Sauvignon", vale: "Maipo Valley", ano: "2021", pontuacao: "96-99", premios: "Vinho do Ano 2024 (Wine Spectator)", popularidade: 169, notas: "Um referente do Cabernet Sauvignon chileno, consistentemente elogiado por sua elegância e complexidade.", link: "https://top100.winespectator.com/2024/wine/wine-no-1-2/" },
  { nome: "Seña Valle de Aconcágua", bodega: "Seña", cepa: "Bordeaux Blend", vale: "Aconcagua Valley", ano: "2021", pontuacao: "100", premios: "Vinho do Ano 2023 (James Suckling)", popularidade: 147, notas: "Celebrado por sua pureza, frescor e fineza, encarnando a excepcional safra 2021.", link: "https://www.jamessuckling.com/wine-tasting-reports/top-100-wines-chile-2023/" },
  { nome: "VIK Valle de Cachapoal VIK", bodega: "VIK", cepa: "Cabernet Franc", vale: "Cachapoal Valley", ano: "2021", pontuacao: "93+", premios: "Vinho do Ano 2024 (James Suckling), Ouro (DWWA 2024)", popularidade: 897, notas: "Um assemblage pioneiro que mostra uma audaciosa mudança para o Cabernet Franc.", link: "https://www.jamessuckling.com/wine-tasting-reports/top-100-wines-of-chile-2024/" },
  { nome: "Viu 1", bodega: "Viu Manent Winery", cepa: "Carmenere", vale: "Colchagua Valley", ano: "2020", pontuacao: "97", premios: "Platina (DWWA 2024)", popularidade: null, notas: "Carmenère flagship, estandarte da variedade em Colchagua.", link: "https://disfrutacolchagua.com/en/wine-and-vineyard/decanter-world-wine-awards/" },
  { nome: "Talinay Caliza", bodega: "Viña Tabalí", cepa: "Chardonnay", vale: "Limarí Valley", ano: "2022", pontuacao: "98", premios: "Melhor Branco (Descorchados)", popularidade: 6208, notas: "Chardonnay de solos ricos em calcário, conhecido por sua mineralidade.", link: "https://www.jamessuckling.com/wine-tasting-reports/top-100-wines-of-chile-2024/" },
  { nome: "Casillero del Diablo Reserva Carmenere", bodega: "Concha y Toro", cepa: "Carmenere", vale: "Central Valley", ano: "2019", pontuacao: "88", premios: "Best Buy (Wine Enthusiast)", popularidade: 5964, notas: "Grande volume e apelo comercial com ótima relação qualidade-preço.", link: "https://www.casillerodeldiablo.com/articles/2208/" },
  { nome: "Montes Alpha M", bodega: "Montes Winery", cepa: "Bordeaux Blend", vale: "Colchagua Valley", ano: "2020", pontuacao: "93", premios: "Ouro (DWWA 2024)", popularidade: 1599, notas: "Assemblage estilo Bordeaux elogiado por sua profundidade e potencial de envelhecimento.", link: "https://disfrutacolchagua.com/en/wine-and-vineyard/decanter-world-wine-awards/" },
  { nome: "Errázuriz Chardonnay Las Pizarras", bodega: "Errázuriz Winery", cepa: "Chardonnay", vale: "Aconcagua Valley", ano: "2021", pontuacao: "97+", premios: "Top 100 Chile (JS)", popularidade: 2911, notas: "Chardonnay de classe mundial, elogiado por sua precisão, acidez e mineralidade costeira.", link: "https://vintmarketplace.com/product/2021-errazuriz-las-pizarras-chardonnay-aconcagua-1x750ml/" },
  { nome: "Clos du Lican Apalta", bodega: "Clos Apalta", cepa: "Syrah", vale: "Colchagua Valley", ano: "2021", pontuacao: "100", premios: "No. 4 Top 100 Chile 2024 (JS)", popularidade: 7545, notas: "Syrah puro de um vinhedo protegido, elogiado por seu frescor e notas florais.", link: "https://vinumfinewines.com/the-100-point-scoring-js-clos-du-lican-2021-ethereal-and-endless/" },
  { nome: "Montes Purple Angel", bodega: "Montes", cepa: "Carmenere", vale: "Colchagua Valley", ano: "2020", pontuacao: "93", premios: "No. 9 Top 100 Chile 2023 (JS)", popularidade: 472, notas: "Assemblage opulento e concentrado, um estilo indulgente e luxuoso.", link: "https://www.jamessuckling.com/wine-tasting-reports/top-100-wines-chile-2023/" },
  { nome: "De Martino Cuvee", bodega: "Viña De Martino", cepa: "Cabernet Sauvignon", vale: "Maipo Valley", ano: "2021", pontuacao: "99", premios: "Melhor Tinto (Descorchados 2024)", popularidade: null, notas: "Pontuação histórica na Guia Descorchados, um marco para o Cabernet chileno.", link: "https://broadbent.com/stories/de-martino-named-chilean-winery-of-the-year-by-descorchados-2024/" },
  { nome: "Almaviva", bodega: "Viña Almaviva", cepa: "Bordeaux Blend", vale: "Maipo Valley", ano: "2022", pontuacao: "94+", premios: "No. 9 Top 100 Chile 2024 (JS)", popularidade: 124, notas: "Um vinho ícone chileno, consistentemente entre os mais buscados e aclamados.", link: "https://www.saratogawine.com/product/almaviva-puente-alto-2022-750ml/" },
  { nome: "Clos Apalta", bodega: "Clos Apalta", cepa: "Bordeaux Blend", vale: "Colchagua Valley", ano: "2021", pontuacao: "94+", premios: "No. 12 Top 100 Chile 2024 (JS)", popularidade: 304, notas: "Vinho icônico de Colchagua, reconhecido por sua sofisticação e equilíbrio.", link: "https://www.wineaccess.com/catalog/2021-lapostolle-red-blend-colchagua-chile_d3ace7a7-0e20-4e88-9cd6-4e984240bea3/" },
  { nome: "Cono Sur 20 Barrels Limited Edition Pinot Noir", bodega: "Cono Sur", cepa: "Pinot Noir", vale: "Casablanca Valley", ano: "2021", pontuacao: "95", premios: "Ouro (DWWA 2024)", popularidade: 4718, notas: "Um Pinot Noir de alta gama de Casablanca, elogiado por sua complexidade e textura.", link: "https://www.decanter.com/wine-reviews/chile/san-antonio/cono-sur-20-barrels-pinot-noir-san-antonio-chile-2021-95180" },
  { nome: "Gato Negro Cabernet Sauvignon", bodega: "Gato Negro", cepa: "Cabernet Sauvignon", vale: "Central Valley", ano: "N/A", pontuacao: "83", premios: "N/A", popularidade: 5905, notas: "Um vinho de entrada de gama, muito popular por sua acessibilidade.", link: "https://www.wine-searcher.com/find/gato+negro+cab+sauv+merlot+central+valley+chile/2021" },
  { nome: "Viña Koyle Garnatxa Cerro Basalto", bodega: "Viña Koyle", cepa: "Garnacha", vale: "Colchagua Valley", ano: "2022", pontuacao: "95+", premios: "No. 3 Top 100 Chile 2024 (JS)", popularidade: null, notas: "Primeira Garnacha no Top 10 de James Suckling, destacando a adaptação da uva.", link: "https://www.jamessuckling.com/wine-tasting-reports/top-100-wines-of-chile-2024/" }
];

const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]).filter(Boolean))].sort();

export default function CemVinhosChilenos() {
  const [search, setSearch] = useState("");
  const [cepa, setCepa] = useState("");
  const [vale, setVale] = useState("");

  const cepas = useMemo(() => getUnique(wineData, "cepa"), []);
  const vales = useMemo(() => getUnique(wineData, "vale"), []);

  const filteredWines = useMemo(() => wineData.filter(wine => {
    return (!cepa || wine.cepa === cepa) &&
      (!vale || wine.vale === vale) &&
      (wine.nome.toLowerCase().includes(search.toLowerCase()) || wine.bodega.toLowerCase().includes(search.toLowerCase()));
  }), [search, cepa, vale]);

  // Chart data
  const cepasCount = useMemo(() => {
    return wineData.reduce((acc, wine) => {
      acc[wine.cepa] = (acc[wine.cepa] || 0) + 1;
      return acc;
    }, {});
  }, []);
  const valesCount = useMemo(() => {
    return wineData.reduce((acc, wine) => {
      if (wine.vale) acc[wine.vale] = (acc[wine.vale] || 0) + 1;
      return acc;
    }, {});
  }, []);
  const scoreBrackets = useMemo(() => {
    const brackets = { '90-92': 0, '93-94': 0, '95-97': 0, '98-100': 0 };
    wineData.forEach(wine => {
      const score = parseInt(wine.pontuacao);
      if (score >= 98) brackets['98-100']++;
      else if (score >= 95) brackets['95-97']++;
      else if (score >= 93) brackets['93-94']++;
      else if (score >= 90) brackets['90-92']++;
    });
    return brackets;
  }, []);

  return (
    <div className="bg-[#FDFBF8] text-[#402A27] min-h-screen">
      <header id="header" className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🍷</span>
              <h1 className="text-xl font-bold text-red-900">Vinhos Chilenos</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#overview" className="nav-link font-semibold pb-1">Visão Geral</a>
              <a href="#explorer" className="nav-link font-semibold pb-1">Explorador</a>
              <a href="#analysis" className="nav-link font-semibold pb-1">Análise</a>
              <a href="#trends" className="nav-link font-semibold pb-1">Tendências</a>
              <a href="#wineries" className="nav-link font-semibold pb-1">Vinícolas</a>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* OVERVIEW */}
        <section id="overview" className="py-16 text-center">
          <h2 className="text-4xl font-bold mb-4 text-red-900">O Melhor do Vinho Chileno</h2>
          <p className="max-w-3xl mx-auto text-lg mb-12 text-stone-700">
            Esta aplicação interativa apresenta um panorama dos vinhos chilenos mais premiados e populares, com base em avaliações de críticos renomados e dados de mercado. Explore a excelência, descubra tendências e conheça as vinícolas que definem o Chile como uma potência vitivinícola global.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
              <h3 className="font-bold text-xl text-amber-600 mb-2">Vinho do Ano 2024</h3>
              <p className="font-semibold text-stone-800">Don Melchor Cabernet Sauvignon 2021</p>
              <p className="text-sm text-stone-600">Reconhecido pela Wine Spectator, um marco para a viticultura chilena.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
              <h3 className="font-bold text-xl text-amber-600 mb-2">Excelência no DWWA 2024</h3>
              <p className="font-semibold text-stone-800">23 Medalhas de Ouro</p>
              <p className="text-sm text-stone-600">O melhor resultado histórico do Chile, confirmando a alta qualidade consistente.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
              <h3 className="font-bold text-xl text-amber-600 mb-2">Destaque de 100 Pontos</h3>
              <p className="font-semibold text-stone-800">Seña 2021 & Clos du Lican 2021</p>
              <p className="text-sm text-stone-600">Vinhos que alcançaram a pontuação perfeita por James Suckling, mostrando pureza e fineza.</p>
            </div>
          </div>
        </section>
        {/* EXPLORER */}
        <section id="explorer" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-red-900">Explorador de Vinhos</h2>
            <p className="max-w-3xl mx-auto text-lg text-stone-700">
              Utilize os filtros para encontrar os vinhos que mais lhe interessam. Pesquise por nome, refine por cepa ou explore os vales produtores. Cada cartão revela um vinho notável, sua pontuação e prêmios.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md mb-8 sticky top-20 z-40">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder="Pesquisar por nome do vinho..." value={search} onChange={e => setSearch(e.target.value)} className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition" />
              <select value={cepa} onChange={e => setCepa(e.target.value)} className="w-full p-2 border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-red-800 focus:border-transparent transition">
                <option value="">Todas as Cepas</option>
                {cepas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={vale} onChange={e => setVale(e.target.value)} className="w-full p-2 border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-red-800 focus:border-transparent transition">
                <option value="">Todos os Vales</option>
                {vales.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <button onClick={() => { setSearch(""); setCepa(""); setVale(""); }} className="w-full bg-red-800 text-white font-bold p-2 rounded-lg hover:bg-red-900 transition">Limpar Filtros</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWines.length === 0 ? (
              <p className="text-center text-xl text-stone-500 py-12">Nenhum vinho encontrado com os critérios selecionados.</p>
            ) : (
              filteredWines.map((wine, idx) => (
                <div key={idx} className="wine-card bg-white rounded-xl shadow border border-stone-200 p-5 flex flex-col">
                  <h4 className="text-lg font-bold text-red-900 mb-2 flex-grow">{wine.nome}</h4>
                  <p className="text-sm text-stone-700 font-semibold">{wine.bodega}</p>
                  <div className="flex justify-between text-sm text-stone-600 mt-2 mb-4">
                    <span><span className="font-semibold">Cepa:</span> {wine.cepa}</span>
                    <span><span className="font-semibold">Vale:</span> {wine.vale}</span>
                  </div>
                  <div className="bg-stone-100 p-3 rounded-lg text-center mb-4">
                    <p className="text-xs text-stone-500">Pontuação</p>
                    <p className="text-2xl font-bold text-amber-600">{wine.pontuacao}</p>
                    <p className="text-xs text-stone-500 mt-1">{wine.premios}</p>
                  </div>
                  <p className="text-sm text-stone-600 mb-4 flex-grow">{wine.notas}</p>
                  <a href={wine.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-stone-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-stone-800 transition mt-auto">Ver Fonte</a>
                </div>
              ))
            )}
          </div>
        </section>
        {/* ANALYSIS */}
        <section id="analysis" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-red-900">Análise de Dados</h2>
            <p className="max-w-3xl mx-auto text-lg text-stone-700">
              Os gráficos abaixo oferecem uma visão quantitativa do panorama dos vinhos chilenos de elite. Analise a distribuição das pontuações, a proeminência das diferentes cepas e a contribuição de cada vale para a produção de vinhos premiados.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-center mb-4">Cepas Premiadas</h3>
              <div className="chart-container h-[400px] md:h-[500px]">
                <Bar
                  data={{
                    labels: Object.keys(cepasCount),
                    datasets: [{
                      label: "Nº de Vinhos Premiados",
                      data: Object.values(cepasCount),
                      backgroundColor: ["#7f1d1d", "#a16207", "#4d7c0f", "#1e40af", "#6b21a8", "#9d174d", "#b45309"],
                      borderColor: "#ffffff",
                      borderWidth: 1
                    }]
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { ticks: { color: '#44403c' } },
                      y: { ticks: { color: '#44403c' } }
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-center mb-4">Vales em Destaque</h3>
              <div className="chart-container">
                <Doughnut
                  data={{
                    labels: Object.keys(valesCount),
                    datasets: [{
                      data: Object.values(valesCount),
                      backgroundColor: ["#7f1d1d", "#a16207", "#4d7c0f", "#1e40af", "#6b21a8", "#9d174d", "#b45309"],
                      hoverOffset: 4
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { color: '#44403c'} } }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-4">Distribuição de Pontuações (90+)</h3>
            <div className="chart-container max-w-4xl h-[300px] md:h-[400px]">
              <Bar
                data={{
                  labels: Object.keys(scoreBrackets),
                  datasets: [{
                    label: "Quantidade de Vinhos",
                    data: Object.values(scoreBrackets),
                    backgroundColor: "#7f1d1d"
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { ticks: { color: '#44403c' } },
                    y: { ticks: { color: '#44403c' } }
                  }
                }}
              />
            </div>
          </div>
        </section>
        {/* TRENDS */}
        <section id="trends" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-red-900">Tendências da Indústria</h2>
            <p className="max-w-3xl mx-auto text-lg text-stone-700">
              A indústria do vinho chileno está em constante evolução. As tendências atuais apontam para a diversificação de uvas e terroirs, uma busca pela autenticidade e um forte compromisso com a sustentabilidade, moldando o futuro da viticultura no país.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200 text-center">
              <span className="text-4xl mb-4 block">🍇</span>
              <h3 className="font-bold text-xl text-red-800 mb-2">Diversificação</h3>
              <p className="text-stone-600">Além do Cabernet e Carmenère, há um crescimento de cepas como Pinot Noir, Syrah, Cinsault e Garnacha, explorando novos terroirs e climas mais frios.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200 text-center">
              <span className="text-4xl mb-4 block">📍</span>
              <h3 className="font-bold text-xl text-red-800 mb-2">Foco no Terroir</h3>
              <p className="text-stone-600">A valorização de parcelas únicas, vinhas velhas e solos específicos (como os calcários de Limarí) reflete uma busca por vinhos que expressem autenticamente sua origem.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200 text-center">
              <span className="text-4xl mb-4 block">🌿</span>
              <h3 className="font-bold text-xl text-red-800 mb-2">Sustentabilidade</h3>
              <p className="text-stone-600">Práticas orgânicas e biodinâmicas ganham força, com vinícolas como a Emiliana liderando o caminho e provando que sustentabilidade e alta qualidade podem andar juntas.</p>
            </div>
          </div>
        </section>
        {/* WINERIES */}
        <section id="wineries" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-red-900">Vinícolas Emblemáticas</h2>
            <p className="max-w-3xl mx-auto text-lg text-stone-700">
              Conheça algumas das vinícolas que são pilares da indústria chilena. De gigantes globais a produtores boutique inovadores, elas impulsionam a reputação do Chile com qualidade, consistência e um espírito pioneiro.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-red-900 mb-2">Concha y Toro</h3>
              <p className="text-stone-600">Gigante global que domina tanto no segmento de volume com Casillero del Diablo quanto no de ultra-premium com o icônico Don Melchor.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-red-900 mb-2">Montes</h3>
              <p className="text-stone-600">Pioneira em Apalta, conhecida por vinhos de alta gama como Montes Alpha M e o aclamado "Purple Angel", um ícone do Carmenère.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-red-900 mb-2">Errázuriz</h3>
              <p className="text-stone-600">Mestres do Vale do Aconcágua, produzem vinhos excepcionais como Don Maximiano e a série Las Pizarras, de terroir costeiro.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-red-900 mb-2">Clos Apalta</h3>
              <p className="text-stone-600">A joia de Colchagua, famosa por seu blend bordalês de classe mundial e o Syrah de 100 pontos, Clos du Lican.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-red-900 mb-2">VIK</h3>
              <p className="text-stone-600">Combina arte, luxo e enologia de vanguarda, com seu vinho homônimo, dominado por Cabernet Franc, sendo aclamado internacionalmente.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-red-900 mb-2">Tabalí</h3>
              <p className="text-stone-600">Especialista nos terroirs de Limarí, produzindo alguns dos melhores Malbecs, Chardonnays e Sauvignon Blancs do Chile.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-stone-200 text-stone-600 text-center p-4 mt-16">
        <p>Aplicação desenvolvida para visualização interativa de dados sobre vinhos chilenos.</p>
      </footer>
      <style>{`
        .nav-link {
          transition: color 0.3s, border-bottom-color 0.3s;
          border-bottom: 2px solid transparent;
        }
        .nav-link:hover, .nav-link.active {
          color: #581c1c;
          border-bottom-color: #581c1c;
        }
        .wine-card {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .wine-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        .chart-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 300px;
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 768px) {
          .chart-container {
            height: 400px;
          }
        }
        html {
          scroll-behavior: smooth;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #FDFBF8;
        }
        ::-webkit-scrollbar-thumb {
          background: #a1887f;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #8d6e63;
        }
      `}</style>
    </div>
  );
}
