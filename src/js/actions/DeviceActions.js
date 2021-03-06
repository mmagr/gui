import deviceManager from '../comms/devices/DeviceManager';

var alt = require('../alt');

class DeviceActions {

  fetchDevices() {
    return (dispatch) => {
      dispatch();

      deviceManager.getDevices().then((devicesList) => {
        this.updateDevices(devicesList.devices);
      })
      .catch((error) => {
        this.devicesFailed(error);
      });
    }
  }

  fetchSingle(deviceid, cb) {
    return (dispatch) => {
      dispatch();

      deviceManager.getDevice(deviceid)
        .then((device) => {
          this.updateSingle(device);
          if (cb) {
            cb(device);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch single device", error);
          this.devicesFailed(error);
        })
    }
  }

  updateDevices(list) {
    return list;
  }

  addDevice(device, cb) {
    const newDevice = device;
    return (dispatch) => {
      dispatch();
      deviceManager.addDevice(newDevice)
        .then((response) => {
          this.insertDevice(response.device);
          if (cb) {
            cb(response.device);
          }
        })
        .catch((error) => {
          this.devicesFailed("Failed to add device to list");
        })
    }
  }

  insertDevice(devices) {
    return devices;
  }

  triggerUpdate(device, cb) {
    return (dispatch) => {
      dispatch();
      deviceManager.setDevice(device)
        .then((response) => {
          this.updateSingle(device);
          if (cb) {
            cb(device);
          }
        })
        .catch((error) => {
          this.devicesFailed("Failed to update given device");
        })
    }
  }

  updateSingle(device) {
    return device;
  }

  triggerRemoval(device, cb) {
    return (dispatch) => {
      dispatch();
      deviceManager.deleteDevice(device.id)
        .then((response) => {
          this.removeSingle(device.id);
          if (cb) {
            cb(response);
          }
        })
        .catch((error) => {
          this.devicesFailed("Failed to remove given device");
        })
    }
  }

  removeSingle(devices) {
    return devices;
  }

  devicesFailed(error) {
    return error;
  }
}

alt.createActions(DeviceActions, exports);
