(function() {
  var rootDiv = document.getElementById("react-centros-esqui-root");
  if (!rootDiv || !window.React || !window.ReactDOM) {
    rootDiv && (rootDiv.innerHTML = '<b style="color:red">[Erro] React não carregado!</b>');
    return;
  }
  var skiCenters = [
    {
      name: 'Valle Nevado',
      region: 'Cordillera de los Andes',
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Valle_Nevado_Chile.jpg',
      description: 'El centro de esquí más grande de Sudamérica, ideal para familias y expertos.',
      website: 'https://vallenevado.com/'
    },
    {
      name: 'La Parva',
      region: 'Cordillera de los Andes',
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/La_Parva_Ski_Center.jpg',
      description: 'Ambiente exclusivo y vistas panorámicas, ideal para esquiadores intermedios y avanzados.',
      website: 'https://www.laparva.cl/'
    },
    {
      name: 'El Colorado',
      region: 'Cordillera de los Andes',
      image: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/El_Colorado_Chile.jpg',
      description: 'Famoso por su ambiente joven y acceso fácil desde Santiago.',
      website: 'https://elcolorado.cl/'
    },
    {
      name: 'Portillo',
      region: 'Región de Valparaíso',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Hotel_Portillo_Chile.jpg',
      description: 'El centro de esquí más antiguo de Sudamérica, con paisajes icónicos junto a la Laguna del Inca.',
      website: 'https://www.skiportillo.com/'
    }
  ];

  function Card(center) {
    return React.createElement('div', {
      style: {
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 12px #0002',
        margin: '1em',
        maxWidth: '340px',
        minWidth: '260px',
        flex: '1 1 260px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }
    },
      React.createElement('img', {
        src: center.image,
        alt: center.name,
        style: { width: '100%', height: '180px', objectFit: 'cover', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }
      }),
      React.createElement('div', { style: { padding: '1em', flex: '1 1 auto' } },
        React.createElement('h3', { style: { fontWeight: 'bold', fontSize: '1.2em', margin: '0 0 0.4em 0', color: '#1238f5' } }, center.name),
        React.createElement('div', { style: { fontSize: '0.95em', color: '#555', marginBottom: '0.5em' } }, center.region),
        React.createElement('p', { style: { fontSize: '0.98em', color: '#333', marginBottom: '0.7em' } }, center.description),
        React.createElement('a', {
          href: center.website,
          target: '_blank',
          style: { display: 'inline-block', marginTop: '0.5em', color: '#fff', background: '#1238f5', borderRadius: '6px', padding: '0.5em 1em', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.96em', boxShadow: '0 2px 8px #1238f522' }
        }, 'Ver sitio oficial')
      )
    );
  }

  function CentrosDeEsquiWidget() {
    return React.createElement('div', {
      style: {
        width: '100%',
        minHeight: '60vh',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'stretch',
        gap: '1em',
        background: 'linear-gradient(120deg,#e0ecff 0%,#f5f8ff 100%)',
        padding: '2em 0',
      }
    },
      skiCenters.map(function(center, i) {
        return React.createElement(Card, Object.assign({ key: center.name }, center));
      })
    );
  }

  ReactDOM.render(
    React.createElement(CentrosDeEsquiWidget),
    rootDiv
  );
})();
