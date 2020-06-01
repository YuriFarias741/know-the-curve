import React, {Component} from 'react';
import {Map, Polygon, GoogleApiWrapper, Marker} from 'google-maps-react';
import '../assets/form.css';
import './mapa.css';
import * as _ from 'lodash';
import polygonsJson from '../assets/polygons.json';
import pSBC from '../utils/pscb';
import {fetchCoutryResources} from '../services/api';
import LatLonJson from '../assets/latlon.json';
import LabelJson from '../assets/labels.json';

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      loadingMap: true,
      loadingChart: true,
      loadingDetails: false,
      chart: '',
      stateChart: '',
      selected: null,
      chart2: '',
      loadingChart2: true,
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
              name: _.get(LabelJson, state.sigla, state.sigla),
              geo: {
                lat: _.get(geo, 'lat'),
                lng: _.get(geo, 'lon'),
              },
              data: {
                cases: _.get(resources, 'data.cases', 0),
                slope: _.get(resources, 'data.slope', 0),
                deaths: _.get(resources, 'data.deaths', 0),
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
    fetch(
      `http://ec2-34-229-66-142.compute-1.amazonaws.com/api/brazil/demographic_density`
    )
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
    fetch(
      `http://ec2-34-229-66-142.compute-1.amazonaws.com/api/brazil/urbanization_land`
    )
      .then(response => response.text())
      .then(data => {
        this.setState({
          ...this.state,
          loadingChart2: false,
          chart2: data,
        });
      })
      .catch(err => {
        this.setState({...this.state, loadingChart2: false});
        console.log(err);
      });
  }
  showDetails = state => {
    this.loadingDetails = true;
    fetch(
      `http://ec2-34-229-66-142.compute-1.amazonaws.com/api/brazil/${state.sigla}`
    )
      .then(response => response.text())
      .then(data => {
        this.setState({
          ...this.state,
          loadingDetails: false,
          stateChart: data,
          selected: state,
        });
      })
      .catch(err => {
        this.setState({...this.state, selected: state, loadingDetails: false});
        console.log(err);
      });
  };
  hiddeDetails = () => {
    this.setState({
      ...this.state,
      loadingDetails: false,
      stateChart: '',
      selected: null,
    });
  };
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
              <h2>Heat map</h2>
              <p>
                The map reveals, in the first moment, a pictorial view of the
                Brazilian COVID-19 cases. Granting it is a heat map, the
                intensity of the color is correlated to the spread of the
                disease in each state. Therefore, the map allows us to analyze
                the situation in a more detailed way. By selecting the state you
                want to analyze, the spread of the disease will be represented
                by a graphic showing how the COVID-19 curve is behaving in that
                specific region.
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
                  zoom={4}
                >
                  {this.renderPolygons()}
                  {/* {this.rendermarker()} */}
                </Map>
                {this.state.selected && !this.state.loadingChart && (
                  <div className="map-info">
                    <div className="infoheader">
                      <h3>{this.state.selected.name}</h3>
                      <a onClick={this.hiddeDetails}>
                        <i className="fas fa-times"></i>
                      </a>
                    </div>
                    <p>
                      <b>Cases: </b>
                      {_.get(this.state, 'selected.data.cases', 0)}
                    </p>
                    <p>
                      <b>Deaths: </b>
                      {_.get(this.state, 'selected.data.deaths', 0)}
                    </p>
                    <iframe
                      className="chartFrame"
                      srcDoc={this.state.stateChart}
                    ></iframe>
                  </div>
                )}
                {(this.state.loadingMap ||
                  (this.state.selected && this.state.loadingChart)) && (
                  <div className="loading">
                    <i className="fas fa-circle-notch fa-spin"></i>
                    Loading...
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
                  Loading...
                </div>
              )}
            </div>
            <div className="col-md-3 col-sm-12 mapa-info">
              <h2>Population x cases</h2>
              <p>
                The graphic illustrates the connection between population
                increasing and the confirmed cases of COVID-19 utilizing
                information collected in public API's. To comprehend the graphic
                you need to assess that the X-axis is associated to the cases
                and the Y-axis is associated to the population, grouped by
                state.
              </p>
            </div>
          </div>
        </div>
        <div className="container-fluid content charts2">
          <div className="row">
            <div className="col-md-3 col-sm-12 mapa-info">
              <h2>Urban center land x Cases</h2>
              <p>
                The graphic illustrates the connection between the area of the
                urban center (in kilometers) by area and the confirmed cases of
                COVID-19 utilizing information made available by NASA - which
                relies on dynamic data. Utilizing the graphic it is possible to
                do observations and analysis about the correlation between the
                process of urbanization and the spread of the disease in
                society. To comprehend the graphic you need to assess that the
                X-axis is associated to the cases and the Y is associated to the
                urban center land in square kilometers.
              </p>
            </div>
            <div className="col-md-9 col-sm-12">
              <iframe
                className="chartFrame"
                srcDoc={this.state.chart2}
              ></iframe>
              {this.state.loadingChart2 && (
                <div className="loading">
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Loading...
                </div>
              )}
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
