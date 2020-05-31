import React, {Component} from 'react';
import {Map, Polygon, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component<any, any> {
  state = {};
  render() {
    const containerStyle = {
      position: 'relative',
      width: '100%',
      height: '100%',
    };

    // handlerChangeState = (event: any) => {};
    return (
      <Map
        google={this.props.google}
        containerStyle={containerStyle}
        initialCenter={{
          lat: -8.56884745885707,
          lng: -55.369535218924284,
        }}
      >
        {/* {this.props.states.map((state: any) => (
          <Polygon
            key={state.id}
            path={state.coordinates}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
          />
        ))} */}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyA4FiGeCZpUpO663wOfg-23qpr1-bLPZU4',
})(MapContainer);
