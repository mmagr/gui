import measureManager from '../comms/measures/MeasureManager';
import LoginStore from '../stores/LoginStore';

var alt = require('../alt');
import util from '../comms/util';

class MeasureActions {

  updateMeasures(data) { return data; }
  fetchMeasure(device_id, attrs, history_length, callback) {
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
          let data = {device: device_id, data: reply};
          if (attrs.length == 1) {
            data.data = {};
            data.data[attrs[0]] = reply;
          }
          this.updateMeasures(data);
          if (callback) {callback(reply)}
        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }

  updatePosition(data) {return data;}
  fetchPosition(device_id, history_length) {
    const attrs = ['lat', 'lng', 'sinr', 'rssi', 'ts', 'device-status'];
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
          if (reply.ts.length > 0) {
            data.ts = reply.ts[0].ts
          }
          if (reply['device-status'].length > 0) {
            data.status = reply['device-status'][0].value
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
