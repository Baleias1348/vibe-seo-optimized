import React from "react";

const emergencyNumbers = [
  { label: "Polícia (Carabineros)", number: "133", icon: "🚓" },
  { label: "Ambulância (SAMU)", number: "131", icon: "🚑" },
  { label: "Consulado do Brasil (Só para Emergências graves)", number: "+56 9 9334-5103", icon: "📞" },
  { label: "Bombeiros", number: "132", icon: "🚒" },
  { label: "Resgate em Montanha", number: "136", icon: "🏔️" },
  { label: "Resgate Marítimo", number: "137", icon: "🛟" },
];

const clinicas = [
  {
    cidade: "Santiago",
    nome: "Clínica Las Condes",
    tel: "+56 2 2610 4000",
    href: "tel:+56226104000",
  },
  {
    cidade: "Santiago",
    nome: "Clínica Alemana",
    tel: "+56 2 2210 1111",
    href: "tel:+56222101111",
  },
  {
    cidade: "Valparaíso/Viña del Mar",
    nome: "Clínica Reñaca",
    tel: "+56 32 265 8000",
    href: "tel:+56322658000",
  },
];

const seguros = [
  {
    nome: "Assist Card",
    tel: "+56 2 2959 4550",
    href: "tel:+56229594550",
  },
  {
    nome: "Universal Assistance",
    tel: "188 800 200 668",
    href: "tel:188800200668",
    obs: "ligação gratuita local",
  },
];

import { Helmet } from 'react-helmet-async';

export default function EmergenciasPage() {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center py-6 px-2">
      <Helmet>
        <title>Emergências no Chile para Brasileiros</title>
        <meta name="description" content="Guia rápido de emergências, números úteis e assistência médica para turistas brasileiros no Chile." />
      </Helmet>
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-center mb-2 text-[#0032A0]">Emergências no Chile 🇨🇱</h1>
        <header className="rounded-lg bg-[#007A33] text-[#FFDE00] text-center py-7 px-2 mb-6 shadow">
          <h2 className="text-3xl font-bold mb-1">Emergências no Chile <span role="img" aria-label="Chile">🇨🇱</span></h2>
          <p className="text-lg">Guia para turistas do Brasil <span role="img" aria-label="Brasil">🇧🇷</span></p>
        </header>

        <section className="bg-white rounded-lg p-6 shadow mb-6">
          <h2 className="text-xl font-bold text-[#0032A0] border-b-2 border-[#D52B1E] pb-2 mb-2 flex items-center gap-2">🆘 Números de Emergência Nacional</h2>
          <p className="mb-4 text-sm text-gray-700">Pressione para ligar. Disque estes números diretamente de qualquer celular (com chip local ou estrangeiro). <strong>Você não precisa de prefixos.</strong></p>
          <p className="text-center text-sm text-[#007A33] font-semibold mb-2">Só precisa fazer click para ligar</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {emergencyNumbers.map(({ label, number, icon }, idx) => (
              <a
                key={number}
                href={`tel:${number}`}
                className="block no-underline"
                tabIndex={0}
              >
                <div className="emergency-item bg-gray-100 hover:bg-gray-200 transition rounded-lg p-4 flex flex-col items-center justify-center h-full shadow-sm text-center">
                  <span className="text-2xl mb-1 w-full text-center flex justify-center items-center">{icon}</span>
                  <span className="font-semibold text-base mb-1 w-full text-center flex justify-center items-center">{label}</span>
                  <span className={`number ${idx === 0 ? 'text-lg font-semibold' : 'text-2xl font-bold'} text-[#D52B1E] w-full text-center flex justify-center items-center`}>{number}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg p-6 shadow mb-6">
          <h2 className="text-xl font-bold text-[#0032A0] border-b-2 border-[#D52B1E] pb-2 mb-2 flex items-center gap-2">📞 Como Ligar para Outros Números?</h2>
          <div className="highlight bg-[#fffbdd] border-l-4 border-[#FFDE00] rounded px-4 py-3 mb-2">
            <p className="mb-1"><strong>Com chip do Brasil (Roaming):</strong> Use o formato internacional.<br />Ex: Para um celular chileno, disque <strong>+56 9 XXXX XXXX</strong>.</p>
            <p><strong>Com chip do Chile:</strong> Disque diretamente como um local.<br />Ex: Para um celular, disque <strong>9 XXXX XXXX</strong>.</p>
          </div>
        </section>

        <section className="bg-white rounded-lg p-6 shadow mb-6">
          <h2 className="text-xl font-bold text-[#0032A0] border-b-2 border-[#D52B1E] pb-2 mb-2 flex items-center gap-2">🇧🇷 Consulado do Brasil em Santiago</h2>
          <p className="mb-2">Para perda de documentos ou emergências consulares graves, entre em contato com o consulado.</p>
          <p className="mb-1"><strong>Endereço:</strong> Los Militares 6191, Térreo, Las Condes, Santiago.</p>
          <p className="mb-1"><strong>Link para Emergências:</strong> <a className="text-[#007A33] font-semibold underline" href="https://www.gov.br/mre/pt-br/consulado-santiago/emergencias-consulares" target="_blank" rel="noopener noreferrer">Página de Emergências Consulares</a></p>
          <p className="mb-1">Em caso de roubo ou perda do passaporte, primeiro faça um "boletim de ocorrência" (constancia) na delegacia dos Carabineros (pressionando <strong><a href="tel:133" className="underline text-[#0032A0]">133</a></strong>) mais próxima.</p>

          {/* Emergências consulares detalhadas */}
          <div className="bg-[#fffbdd] border-l-4 border-[#FFDE00] rounded px-4 py-3 mt-4 mb-2">
            <h3 className="text-lg font-bold text-[#007A33] mb-2">Emergências consulares</h3>
            <p className="mb-2 text-sm text-gray-700">Em casos de comprovada emergência, o cidadão brasileiro poderá ligar para o plantão do Consulado-Geral:</p>
            <p className="text-xl font-bold text-[#D52B1E] mb-2">
              <a href="tel:+56993345103" className="underline">+56 9 9334-5103</a>
            </p>
            <p className="mb-2 text-sm text-gray-700">Se não conseguir contato, pode acionar o plantão do Ministério das Relações Exteriores, em Brasília:</p>
            <p className="text-base font-semibold text-[#0032A0] mb-2">
              <a href="tel:+5561982600610" className="underline">+55 61 98260-0610</a>
            </p>
            <p className="mb-2 text-xs text-gray-600">O plantão consular deve ser acionado apenas para emergências reais que envolvam riscos à vida, liberdade ou integridade física. Exemplos:</p>
            <ul className="list-disc pl-6 text-xs text-gray-700 mb-2">
              <li>falecimentos;</li>
              <li>hospitalizações;</li>
              <li>desaparecimentos;</li>
              <li>violência doméstica;</li>
              <li>tráfico de pessoas;</li>
              <li>outros crimes graves;</li>
              <li>maus-tratos a menores;</li>
              <li>privação de liberdade;</li>
              <li>detenção por autoridades policiais.</li>
            </ul>
            <p className="text-xs text-gray-600 mb-1">
              Não serão prestadas informações sobre outros serviços do Consulado-Geral ou assuntos não emergenciais. Para consultas, use o e-mail <a href="mailto:cg.santiago@itamaraty.gov.br" className="underline text-[#007A33]">cg.santiago@itamaraty.gov.br</a>.
            </p>
            <p className="text-xs text-gray-600 mb-1">
              <strong>Atenção:</strong> O Consulado-Geral não pode investigar crimes, ser parte em processos judiciais, interferir em detenções ou regularização migratória. Em caso de falecimento, presta orientação, mas não se responsabiliza por custos de traslado ou outros.
            </p>
            <div className="mt-2 text-right">
              <a href="https://www.gov.br/mre/pt-br/consulado-santiago/emergencias-consulares" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline">Fonte oficial: https://www.gov.br/mre/pt-br/consulado-santiago/emergencias-consulares</a>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg p-6 shadow mb-6">
          <h2 className="text-xl font-bold text-[#0032A0] border-b-2 border-[#D52B1E] pb-2 mb-2 flex items-center gap-2">🏥 Assistência Médica</h2>
          <p className="mb-2">Recomenda-se ir a clínicas particulares para um atendimento mais rápido. Pressione o número para ligar.</p>
          <ul className="list-disc pl-6 space-y-1">
            {clinicas.map(({ cidade, nome, tel, href }) => (
              <li key={nome}>
                <strong>{cidade}:</strong> {nome} (<a className="text-[#007A33] font-semibold" href={href}>{tel}</a>)
              </li>
            ))}

          </ul>
        </section>

        <section className="bg-white rounded-lg p-6 shadow mb-6">
          <h2 className="text-xl font-bold text-[#0032A0] border-b-2 border-[#D52B1E] pb-2 mb-2 flex items-center gap-2">🛡️ Seguro de Viagem</h2>
          <p className="mb-2">Contate seu seguro imediatamente em caso de emergência. Tenha o número da sua apólice em mãos.</p>
          <ul className="list-disc pl-6 space-y-1">
            {seguros.map(({ nome, tel, href, obs }) => (
              <li key={nome}>
                <strong>{nome}:</strong> <a className="text-[#007A33] font-semibold" href={href}>{tel}</a>{obs && <span className="text-xs text-gray-500"> ({obs})</span>}
              </li>
            ))}
          </ul>
        </section>

        <footer className="text-center text-gray-500 py-6">
          <p>Desejamos a você uma viagem segura e tranquila pelo Chile!</p>
        </footer>
      </div>
    </div>
  );
}
