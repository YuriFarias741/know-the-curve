import axios from 'axios';
import * as _ from 'lodash';
import {CountryResources} from '../interfaces/map-interface';

export const fetchCoutryResources = (
  country: string
): Promise<CountryResources[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`http://localhost:8000/api/${country}/`);
      const responseJson = await response.json();
      const data = Object.keys(responseJson).map(key => {
        return {
          state: key,
          data: _.get(responseJson, key),
        };
      });
      resolve(data);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
