var alt = require('../alt');
var MeasureActions = require('../actions/MeasureActions');

import util from '../comms/util';

class MeasureStore {
  constructor() {
    this.data = {};
    this.error = null;

    this.bindListeners({
      handleUpdateMeasures: MeasureActions.UPDATE_MEASURES,
      handleFetchMeasures: MeasureActions.FETCH_MEASURE,
      handleFailure: MeasureActions.MEASURES_FAILED
    });
  }

  handleFetchMeasures(measureData) {}
  handleUpdateMeasures(measureData) {
    console.log(this.data.device, measureData.device);
    if (this.data.device == measureData.device) {
      for (let k in measureData.data) {
        console.log('checking', k);
        if (measureData.data.hasOwnProperty(k)) {
          console.log('will update data for', k);
          this.data.data[k] = measureData.data[k];
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
