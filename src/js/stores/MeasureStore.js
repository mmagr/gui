var alt = require('../alt');
// var MeasureActions = require('../actions/MeasureActions');

import util from '../comms/util';

class MeasureStore {
  constructor() {
    this.devices = {};
    this.error = null;

    // this.bindListeners({
    //   // handleUpdateMeasures: MeasureActions.UPDATE_MEASURES,
    //   // handleFetchMeasures: MeasureActions.FETCH_MEASURES,
    //   // handleFailure: MeasureActions.MEASURES_FAILED,
    // });
  }

  handleUpdateMeasures(measureData) {
    if (! ('device' in measureData)) { console.error("Missing device id"); }
    if (! ('attr' in measureData)) { console.error("Missing attr id"); }
    if (! ('data' in measureData)) { console.error("Missing device data"); }

    if (measureData.device in this.devices) {
      this.devices[measureData.device][measureData.attr.name].loading = false;
      this.devices[measureData.device][measureData.attr.name].data = measureData.data;
    } else {
      this.error = "Device not found"
      console.error('failed to find device in current measures');
    }
  }

  handleFetchMeasures(measureData) {
    if (! ('device' in measureData)) { console.error("Missing device id"); }
    if (! ('attr' in measureData)) { console.error("Missing attr id"); }

    if (! (measureData.device in this.devices)) {
      this.devices[measureData.device] = {}
    }

    this.devices[measureData.device][measureData.attr.name] = JSON.parse(JSON.stringify(measureData.attr));
    this.devices[measureData.device][measureData.attr.name].loading = true;
  }

  handleFailure(error) {
    this.error = error;
  }
}

var _store =  alt.createStore(MeasureStore, 'MeasureStore');
export default _store;
