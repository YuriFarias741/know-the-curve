import {ILatLong} from './shared-interfaces';

export interface IState {
  id: string;
  sigla: string;
}

export interface IStatesPolygon extends IState {
  coordinates: ILatLong[];
  geo?: ILatLong;
  data?: {
    cases: number;
    slope: number;
  };
}

export interface CountryResources {
  state: string;
  data: {
    cases: number;
    slope: number;
  };
}
