import React from 'react';
import Sidebar from './components/sidebar';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Mapa from './pages/home';
import Header from './components/header';
import {ScrollArea} from 'react-scroll-to';

import './App.css';
import './assets/grid.css';

const App = () => {
  return (
    <div className="App">
      <Sidebar />
      <Header />
      <BrowserRouter>
        <Switch>
          <ScrollArea id="map">
            <Route path="/" exact={true} component={Mapa} />
          </ScrollArea>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
