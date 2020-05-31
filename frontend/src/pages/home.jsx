import React, {Component} from 'react';
import {Map, Polygon, GoogleApiWrapper, Marker} from 'google-maps-react';
import '../assets/form.css';
import './mapa.css';
import * as _ from 'lodash';
import polygonsJson from '../assets/polygons.json';
import pSBC from '../utils/pscb';
import {fetchCoutryResources} from '../services/api';
import LatLonJson from '../assets/latlon.json';

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      loadingMap: true,
      loadingChart: true,
      chart: '',
    };
  }

  componentDidMount() {
    let polygonsNomalized = Object.keys(polygonsJson).map(key => {
      return {
        id: key,
        sigla: key,
        coordinates: _.get(polygonsJson, key)
          .filter(i => i.length > 0)
          .map(geo => ({
            lat: geo[1],
            lng: geo[0],
          })),
      };
    });
    fetchCoutryResources('brazil')
      .then(data => {
        this.setState({
          loadingMap: false,
          states: polygonsNomalized.map(state => {
            const resources = _.find(data, {state: state.sigla});
            const geo = _.get(LatLonJson, state.sigla);
            return {
              ...state,
              geo: {
                lat: _.get(geo, 'lat'),
                lng: _.get(geo, 'lon'),
              },
              data: {
                cases: _.get(resources, 'data.cases', 0),
                slope: _.get(resources, 'data.slope', 0),
              },
            };
          }),
        });
      })
      .catch(err => {
        this.setState({
          loadingMap: false,
        });
        console.log(err);
      });
    fetch(`http://localhost:8000/api/brazil/demographic_density`)
      .then(response => response.text())
      .then(data => {
        this.setState({
          ...this.state,
          loadingChart: false,
          chart: data,
        });
      })
      .catch(err => {
        this.setState({...this.state, loadingChart: false});
        console.log(err);
      });
  }
  showDetails = state => {};
  renderPolygons = () => {
    return this.state.states.map(state => {
      return (
        <Polygon
          key={'Polygon' + state.sigla}
          path={state.coordinates}
          strokeColor={'#ccc'}
          fillColor={pSBC(
            0.01 * (_.get(state, 'data.slope', 0) / 100),
            'rgb(255,255,255)',
            'rgb(225, 44, 61)'
          )}
          strokeWeight={1}
          fillOpacity={0.7}
          onClick={() => this.showDetails(state)}
        />
      );
    });
  };
  rendermarker = () => {
    return this.state.states.map(state => {
      console.log(state.geo);
      return (
        <Marker
          key={'Marker' + state.sigla}
          position={state.geo}
          name={state.sigla}
        />
      );
    });
  };
  render() {
    const containerStyle = {
      position: 'relative',
      width: '100%',
      height: '100%',
    };

    // handlerChangeState = (event) => {};
    return (
      <>
        <div className="container-fluid content content" id="maps">
          <div className="row">
            <div className="col-md-3 col-sm-12 col-sm-12 mapa-info">
              <h2>Mapa de propagação</h2>
              <p>
                O mapa ao lado traz, em um primeiro momento, um panorama dos
                casos de covid-19 no Brasil. Por se tratar de um mapa de calor,
                a intensidade de suas cores é determinada com base no alto
                índice de propagação do coronavírus em cada região. Além disso,
                o mapa permite analisar a situação em cada estado do país, de
                forma mais detalhada. Ao selecionar o estado que se “deseja”, o
                crescimento da doença no local será representado por meio de um
                gráfico. Este, por sua vez, corresponde à curva da doença para
                aquele estado.
              </p>
            </div>
            <div className="col-md-9 col-sm-12">
              <div className="mapa">
                <Map
                  google={this.props.google}
                  containerStyle={containerStyle}
                  initialCenter={{
                    lat: -17.17999531784841,
                    lng: -57.23911032110355,
                  }}
                  onCenterChanged={(m, p, e) => {
                    console.log(p.center.lat(),p.center.lng())
                  }}
                  zoom={4}
                >
                  {this.renderPolygons()}
                  {/* {this.rendermarker()} */}
                </Map>
                {this.state.loadingMap && (
                  <div className="loading">
                    <i className="fas fa-circle-notch fa-spin"></i>
                    Carregando dados...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid content charts" id="chart">
          <div className="row">
            <div className="col-md-9 col-sm-12">
              <iframe className="chartFrame" srcDoc={this.state.chart}></iframe>
              {this.state.loadingChart && (
                <div className="loading">
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Carregando dados...
                </div>
              )}
            </div>
            <div className="col-md-3 col-sm-12 mapa-info">
              <h2>Densidade demográfica</h2>
              <p>
                O gráfico ao lado traz uma correlação de densidade demográfica
                com casos confirmados de covid-19.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyA4FiGeCZpUpO663wOfg-23qpr1-bLPZU4',
})(MapContainer);
