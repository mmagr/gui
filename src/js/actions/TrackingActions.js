import alt from  "../alt";
import util from '../comms/util';

class TrackingActions {
  fetch(device_id, history_length) {
    const attrs = ['lat', 'lng'];
    function getUrl() {
      if (history_length === undefined) { history_length = 25; }
      let url = '/history/device/' + device_id + '/history' + '?lastN=' + history_length;
      attrs.map((attr) => {url += '&attr=' + attr});
      return url;
    }

    return (dispatch) => {
      dispatch();
      // console.log("should fetch " + getUrl());
      util._runFetch(getUrl(), {method: 'get'})
        .then((reply) => {
          let history = {device_id: device_id, data: []};
          for (let i = 0; i < reply.lat.length; i++) {
            let data = {device_id: device_id};
            if (reply.lat[i].value !== "nan" && reply.lng[i].value !== "nan") {
              data.position = [parseFloat(reply.lat[i].value), parseFloat(reply.lng[i].value)];
            }
            history.data.push(data);
          }

          this.set(history);
        })
        .catch((error) => {console.error("failed to fetch data", error);});
    }
  }

  set(history){ return history; }
  dismiss(device_id){ return device_id; }
}
alt.createActions(TrackingActions, exports);
