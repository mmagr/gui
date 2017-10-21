var alt = require('../alt');
var DeviceActions = require('../actions/DeviceActions');
var MeasureActions = require('../actions/MeasureActions');
var TrackingActions = require('../actions/TrackingActions');

class DeviceStore {
  constructor() {
    this.devices = {};
    this.tracking = {};
    this.error = null;
    this.loading = false;

    this.bindListeners({
      handleUpdateDeviceList: DeviceActions.UPDATE_DEVICES,
      handleFetchDeviceList: DeviceActions.FETCH_DEVICES,

      handleInsertDevice: DeviceActions.INSERT_DEVICE,
      handleTriggerInsertion: DeviceActions.ADD_DEVICE,

      handleTriggerUpdate: DeviceActions.TRIGGER_UPDATE,

      handleTriggerRemoval: DeviceActions.TRIGGER_REMOVAL,
      handleRemoveSingle: DeviceActions.REMOVE_SINGLE,

      handleFailure: DeviceActions.DEVICES_FAILED,

      handleFetchPosition: MeasureActions.FETCH_POSITION,
      handleUpdatePosition: MeasureActions.UPDATE_POSITION,

      handleTrackingFetch: TrackingActions.FETCH,
      handleTrackingSet: TrackingActions.SET,
      handleTrackingDismiss: TrackingActions.DISMISS
    });
  }

  handleTrackingFetch(){}
  handleTrackingSet(history){
    this.tracking[history.device_id] = history.data;
  }

  handleTrackingDismiss(device_id){
    if (this.tracking.hasOwnProperty(device_id)){
      delete this.tracking[device_id];
    }
  }

  parseStatus(device) {
    if (device.protocol.toLowerCase() == 'virtual') {
      return device.protocol.toLowerCase();
    } else {
      if (device.status) {
        return device.status;
      }
    }

    return "disabled"
  }

  handleFetchPosition() {}
  handleUpdatePosition(data) {
    if (data.device_id in this.devices) {
      if (this.devices.hasOwnProperty(data.device_id)) {
        for (let k in data) {
          if ((k != "device_id") && (data.hasOwnProperty(k))) {
            this.devices[data.device_id][k] = data[k];
          }
        }
      }
    }
  }

  handleUpdateSingle(device) {
    let newDevice = JSON.parse(JSON.stringify(device))
    if (newDevice.attrs == undefined) {
      newDevice.attrs = [];
    }
    if (newDevice.static_attrs == undefined) {
      newDevice.static_attrs = [];
    }
    newDevice._status = this.parseStatus(device);
    newDevice.loading = false;

    this.devices[device.id] = newDevice;

    this.loading = false;
  }

  handleTriggerUpdate(device) {
    // trigger handler for updateSingle
    this.error = null;
    this.loading = true;
  }

  handleTriggerRemoval(device) {
    // trigger handler for removeSingle
    this.error = null;
    this.loading = true;
  }

  handleRemoveSingle(id) {
    if (this.devices.hasOwnProperty(id)) {
      delete this.devices[id];
    }

    this.loading = false;
  }

  handleInsertDevice(device) {
    device._status="disabled"
    this.devices[device.id] = JSON.parse(JSON.stringify(device));
    this.error = null;
    this.loading = false;
  }

  handleTriggerInsertion(newDevice) {
    // this is actually just a intermediary while addition happens asynchonously
    this.error = null;
    this.loading = true;
  }

  handleUpdateDeviceList(devices) {
    this.devices = {};
    for (let idx = 0; idx < devices.length; idx++) {
      devices[idx]._status = this.parseStatus(devices[idx]);
      if (devices[idx].attrs == undefined) {
        devices[idx].attrs = [];
      }
      if (devices[idx].static_attrs == undefined) {
        devices[idx].static_attrs = [];
      }
      if (devices[idx].tags == undefined) {
        devices[idx].tags = [];
      }
      this.devices[devices[idx].id] = JSON.parse(JSON.stringify(devices[idx]))
    }

    this.error = null;
    this.loading = false;
  }

  handleFetchDeviceList() {
    this.devices = {};
    this.loading = true;
  }

  fetchSingle(deviceid) {
    this.devices[deviceid] = {loading: true};
  }

  handleFailure(error) {
    this.error = error;
    this.loading = false;
  }
}

var _store =  alt.createStore(DeviceStore, 'DeviceStore');
export default _store;
