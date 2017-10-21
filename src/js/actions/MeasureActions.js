import measureManager from '../comms/measures/MeasureManager';
import LoginStore from '../stores/LoginStore';

var alt = require('../alt');
import util from '../comms/util';

class MeasureActions {

  updateMeasures(data) { return data; }
  fetchMeasure(device_id, attrs, history_length, callback) {
    console.log('will fetch data for', device_id, attrs);
    function getUrl() {
      if (history_length === undefined) { history_length = 1; }
      let url = '/history/device/' + device_id + '/history' + '?lastN=' + history_length;
      attrs.map((attr) => {url += '&attr=' + attr});
      return url;
    }

    return (dispatch) => {
      dispatch();
      util._runFetch(getUrl(), {method: 'get'})
        .then((reply) => {
          const data = {device: device_id, data: reply};
          this.updateMeasures(data);
          if (callback) {callback(reply)}
        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }

  updatePosition(data) {return data;}
  fetchPosition(device_id, history_length) {
    const attrs = ['lat', 'lng', 'sinr', 'rssi'];
    function getUrl() {
      if (history_length === undefined) { history_length = 1; }
      let url = '/history/device/' + device_id + '/history' + '?lastN=' + history_length;
      attrs.map((attr) => {url += '&attr=' + attr});
      return url;
    }

    return (dispatch) => {
      dispatch();
      // console.log("should fetch " + getUrl());
      util._runFetch(getUrl(), {method: 'get'})
        .then((reply) => {
          let data = {device_id: device_id};
          if ((reply.lat.length > 0) && (reply.lng.length > 0)) {
            if (reply.lat[0].value !== "nan" && reply.lng[0].value !== "nan") {
              data.position = [parseFloat(reply.lat[0].value), parseFloat(reply.lng[0].value)];
            }
          }

          if (reply.sinr.length > 0) {
            data.sinr = parseFloat(reply.sinr[0].value)
          }
          if (reply.rssi.length > 0) {
            data.rssi = parseFloat(reply.rssi[0].value)
          }

          this.updatePosition(data);
        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }

  measuresFailed(error) {
    return error;
  }
}

alt.createActions(MeasureActions, exports);
