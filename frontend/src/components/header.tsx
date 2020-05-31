import React from 'react';
import './header.css';
import image from '../assets/img/background.jpg';

const Header: React.FC = () => {
  return (
    <div className="container-fluid content header-fluid" id="about">
      <div className="header row">
        <div className="col-md-6 col-sm-12">
          <h1> know the curve_ </h1>
          <h3>Por grupo aipim</h3>
          <br></br>
          <p>
            O know the curve_ é um sistema de suporte à tomada de decisão, com a
            finalidade de expor, de forma didática, informações de macro e
            microescala simultaneamente. Tendo como proposta a identificação de
            padrões entre a atividade humana e os casos de COVID-19, o
            aplicativo(?) se propõe a encontrar fatores que possam prever pontos
            críticos da propagação da doença. O know the curve_ atua
            correlacionando dados de densidade demográfica, determinantes
            sociais de saúde e dados existentes sobre o coronavírus, com o
            objetivo de criar um mapa de calor com a previsão do avanço do
            Covid-19 por região, para que, assim, seja possível identificar os
            lugares em que a propagação da doença é maior.
          </p>
        </div>
        <div className="col-md-6 col-sm-12">
          <img src={image} alt="Grupo aipim" className="image" />
        </div>
      </div>
    </div>
  );
};

export default Header;
