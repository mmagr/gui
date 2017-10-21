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
    console.log('will update store', measureData);
    this.data = measureData;
  }


  handleFailure(error) {
    this.error = error;
  }
}

var _store =  alt.createStore(MeasureStore, 'MeasureStore');
export default _store;
