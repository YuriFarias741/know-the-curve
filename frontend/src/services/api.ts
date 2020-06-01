import axios from 'axios';
import * as _ from 'lodash';
import {CountryResources} from '../interfaces/map-interface';

export const fetchCoutryResources = (
  country: string
): Promise<CountryResources[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`http://ec2-34-229-66-142.compute-1.amazonaws.com/api/${country}/`);
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
