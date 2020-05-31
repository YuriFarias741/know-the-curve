import React from 'react';
import './sidebar.css';

const Sidebar: React.FC = () => {
  const scrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({behavior: 'smooth'});
    }
  };
  return (
    <div className="sideBar">
      <div className="title">Grupo Aipim</div>
      <div className="menu">
        <a className="menu-item" onClick={() => scrollTo('about')}>
          <i className="fas fa-info-circle"></i>
          <div className="title">Sobre</div>
        </a>
        <a className="menu-item" onClick={() => scrollTo('maps')}>
          <i className="far fa-map"></i>
          <div className="title">Mapa</div>
        </a>
        <a className="menu-item" onClick={() => scrollTo('chart')}>
          <i className="fas fa-chart-line"></i>
          <div className="title">Gráfico</div>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
