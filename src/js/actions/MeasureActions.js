import measureManager from '../comms/measures/MeasureManager';
import LoginStore from '../stores/LoginStore';

var alt = require('../alt');
import util from '../comms/util';




class MeasureActions {

  updateMeasures(device, attr, data) {
    return {device: device, attr: attr, data: data};
  }

  fetchMeasure(device_id, attrs, history_length, callback) {
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
          if (callback) {callback(reply)}
          // const data = reply.contextResponses[0].contextElement.attributes[0].values;
          // this.updateMeasures(device, attr, data);
        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }


  fetchPosition(device_id, history_length) {
    // function callback(data) {
    //   let position = [data.lat[0].value, data.lng[0].value];
    //   this.updatePosition(device_id, position);
    // }
    // return this.fetchMeasures(device_id, ['lat', 'lng'], history_length, callback);
    const attrs = ['lat', 'lng'];
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
          if ((reply.lat.length > 0) && (reply.lng.length > 0)) {
            if (reply.lat[0].value !== "nan" && reply.lng[0].value !== "nan") {
              let position = [parseFloat(reply.lat[0].value), parseFloat(reply.lng[0].value)];
              this.updatePosition(device_id, position);
            }
          }
        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }

  updatePosition(device_id, position) {
    console.log('got position', device_id, position);
    return {device_id: device_id, position: position};
  }

  fetchMeasures(device, type, attr) {

    let devType = 'device';
    if (type == "virtual") {
      devType = "virtual";
    }

    function getUrl() {
      return '/history/STH/v1/contextEntities/type/' + devType + '/id/' + device + '/attributes/' + attr.name + '?lastN=10'
    }

    return (dispatch) => {
      dispatch({device: device, attr: attr});

      const service = LoginStore.getState().user.service;
      const config = {
        method: 'get',
        headers: new Headers({
          'fiware-service': service,
          'fiware-servicepath': '/'
        })
      }
      util._runFetch(getUrl(), config)
        .then((reply) => {
          const data = reply.contextResponses[0].contextElement.attributes[0].values;
          this.updateMeasures(device, attr, data);
        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }

  measuresFailed(error) {
    return error;
  }
}

alt.createActions(MeasureActions, exports);
