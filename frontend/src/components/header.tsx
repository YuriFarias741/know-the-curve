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
            Know the curve_ is a support system that works by correlating data
            on demographic density, social health determinants, and existing
            data on COVID-19, exposing them in a simple and didactic way. The
            objective of know the curve_ is to generate a heat map with the
            trend of advancing COVID-19 by region and we contemplate that, in
            short,/medium term, it will be possible to use it to investigate the
            trends and use it to make predictions. Thus, it will be feasible to
            present the places where the disease has a bigger spread, but in a
            way that can reach many people, raising consciousness and helping
            the population. It is significant to note that, even though the
            initial application takes place in Brazil it will be possible to use
            know the curve_ on a worldwide scale.
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
