var alt = require('../alt');
var MeasureActions = require('../actions/MeasureActions');

import util from '../comms/util';

class MeasureStore {
  constructor() {
    this.data = {};
    this.error = null;

    this.bindListeners({
      handleAppendMeasures: MeasureActions.APPEND_MEASURES,
      handleUpdateMeasures: MeasureActions.UPDATE_MEASURES,
      handleFetchMeasures: MeasureActions.FETCH_MEASURE,
      handleFailure: MeasureActions.MEASURES_FAILED
    });
  }

  handleFetchMeasures(measureData) {}
  handleUpdateMeasures(measureData) {
    if (this.data.device == measureData.device) {
      for (let k in measureData.data) {
        if (measureData.data.hasOwnProperty(k)) {
          this.data.data[k] = measureData.data[k];
        }
      }
    } else {
      this.data = measureData;
    }
  }

  handleAppendMeasures(measureData) {
    if (this.data.device == measureData.device_id) {
      for (let k in measureData) {
        if (measureData.hasOwnProperty(k)) {
          if (this.data.data.hasOwnProperty(k) == false) {
            this.data.data[k] = [NaN]; // dummy entry - will always be removed
          }
          this.data.data[k].unshift(measureData[k]);
          this.data.data[k].splice(this.data.data[k].length - 1, 1)
        }
      }
    } else {
      this.data = measureData;
    }
  }


  handleFailure(error) {
    this.error = error;
  }
}

var _store =  alt.createStore(MeasureStore, 'MeasureStore');
export default _store;
