import React, { Component } from 'react';
import MaterialSelect from "../components/MaterialSelect";

class ListItem extends Component {
  constructor(props){
    super(props);
    this.state = { click: true }
    this.hideDevice = this.hideDevice.bind(this);
    this.parseState = this.parseState.bind(this);
  }

  hideDevice(event){
    this.props.toggleDisplay(this.props.device.id);
  }

  parseState() {
    if (this.props.device.hasOwnProperty('hasPosition')){
      if (this.props.device.hasPosition == false) {
        return "fa fa-eye-slash";
      }
    }

    if (this.props.device.hide){
      return "fa fa-eye-slash";
    } else {
      return "fa fa-eye"
    }
  }

  render() {
    const name = this.props.device.label;
    const attrValue = this.props.device.rssi ? this.props.device.rssi : "unknown"

    return (
      <div className="lst-entry-title col s12" id={this.props.device.id} title="See details">
        <div className="img col s3" id="img-chip">
          <img src="images/chip.png" />
        </div>
        <div className="user-label truncate col s6">{name}</div>
        <div className="label col s6">RSSI {attrValue}</div>
        <div className="col s3 img" id="device-view">
          <a className="" onClick={this.hideDevice}>
            <i className={this.parseState()} aria-hidden="true" />
          </a>
        </div>
      </div>
    )
  }
}

class ListRender extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.loading) {
      return (
        <div className="background-info valign-wrapper full-height">
          <i className="fa fa-circle-o-notch fa-spin fa-fw horizontal-center"/>
        </div>
      )
    }

    const devices = this.props.devices;
    if ((devices.length > 0) && (devices.constructor == Array)){
      return (
        <div className="row">
          { devices.map((device, idx) =>
            <ListItem device={device} key={device.id} toggleDisplay={this.props.toggleDisplay}/>
          )}
        </div>
      )
    } else if ((Object.keys(devices).length > 0) && (devices.constructor == Object)) {
      return (
        <div className="row">
          { Object.keys(devices).map((device_id) =>
            <ListItem device={devices[device_id]} key={device_id} toggleDisplay={this.props.toggleDisplay}/>
          )}
        </div>
      )
    } else {
      return  (
        <div className="background-info valign-wrapper full-height">
          <span className="horizontal-center">No configured devices</span>
        </div>
      )
    }
  }
}

class FieldSearchValues extends Component {
  render() {
    return(
      <div className="search-value col s12 offset-s1">
        <div className="truncate">
          <div className="attribute">{this.props.attribute}</div> : <div className="value">{this.props.value}</div>
        </div>
      </div>
    )
  }
}

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayList: true,
      filter: '',
      hide: false,
      changeSidebar: false

    };

    this.hideDevices = this.hideDevices.bind(this);
    this.showDevices = this.showDevices.bind(this);
  }

  hideDevices(event) {
    // TODO this is wrong - do over
    if (this.state.hide === false) {
      this.setState({hide: !this.state.hide});
    }
  }

  showDevices(event) {
    // TODO this is wrong - do over
    if (this.state.hide === true) {
      this.setState({hide: !this.state.hide});
    }
  }

  render(){
    return (
      <div className="list-of-devices">
        <div className="row device-list">
          <div className="col s12 main-title center-align">Devices</div>
          <div className="col s12 info-header">
            <div className= "col s1 subtitle">{this.props.devices.length}</div>
            <div className= "col s5 title">Devices</div>
            <div className="col s6 device-list-actions">
              <div className="col s6 action-hide">
                <a className="waves-effect waves-light" onClick={this.hideDevices}>HIDE ALL</a>
              </div>
              <div className="col s6 action-show">
                <a className="waves-effect waves-light" onClick={this.showDevices}>SHOW ALL</a>
              </div>
            </div>
          </div>
          <div className="deviceCanvas col s12">
            <ListRender devices={this.props.devices}
                        loading={this.props.loading}
                        deviceid={this.props.deviceid}
                        toggleDisplay={this.props.toggleDisplay} />
          </div>
        </div>
      </div>
    )
  }
}

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attribute: "Name",
      value: "",

      click: false,
      changeSidebar: true,
      isActiveMqtt: false,
      isActiveVirtual: false,
      isActiveCol: false,
      isActiveTrat: false,
      isActiveCam: false,

    };

    this.addFilter = this.addFilter.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.handleChangeAttribute = this.handleChangeAttribute.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);

    this.selectItemMqtt = this.selectItemMqtt.bind(this);
    this.selectItemVirtual = this.selectItemVirtual.bind(this);
    this.selectItemCol = this.selectItemCol.bind(this);
    this.selectItemTrat = this.selectItemTrat.bind(this);
    this.selectItemCam = this.selectItemCam.bind(this);

    this.devicesSidebar = this.devicesSidebar.bind(this);

  }

  selectItemMqtt(event){
    this.setState({isActiveMqtt: !this.state.isActiveMqtt});
  }

  selectItemVirtual(event){
    this.setState({isActiveVirtual: !this.state.isActiveVirtual});
  }

  selectItemCol(event){
    this.setState({isActiveCol: !this.state.isActiveCol});
  }

  selectItemTrat(event){
    this.setState({isActiveTrat: !this.state.isActiveTrat});
  }

  selectItemCam(event){
    this.setState({isActiveCam: !this.state.isActiveCam});
  }

  handleChangeAttribute(event){
    this.setState({attribute: event.target.value});
  }

  handleChangeValue(event){
    this.setState({value: event.target.value});
  }

  addFilter(event){
    if(this.state.click == false){
      event.preventDefault();
      this.setState({click: !this.state.click});
    }
  }

  clearSearch(event){
    if(this.state.click == true){
      event.preventDefault();
      this.setState({click: !this.state.click});
      this.setState({attribute: "Name"});
      this.setState({value: ""});
    }

    if(this.state.isActiveMqtt){
      this.setState({isActiveMqtt: !this.state.isActiveMqtt});
    }

    if(this.state.isActiveVirtual){
      this.setState({isActiveVirtual: !this.state.isActiveVirtual});
    }

    if(this.state.isActiveCol){
      this.setState({isActiveCol: !this.state.isActiveCol});
    }

    if(this.state.isActiveTrat){
      this.setState({isActiveTrat: !this.state.isActiveTrat});
    }

    if(this.state.isActiveCam){
      this.setState({isActiveCam: !this.state.isActiveCam});
    }
  }

  devicesSidebar(event){
    this.props.callback(this.state.changeSidebar);
  }

  render(){
    let click = this.state.click ? true : false;

    let searchAttribute = this.state.attribute;
    let searchValue = this.state.value;

    let isActiveMqtt = this.state.isActiveMqtt ? "active" : "";
    let isActiveVirtual = this.state.isActiveVirtual ? "active" : "";
    let isActiveCol = this.state.isActiveCol ? "active" : "";
    let isActiveTrat = this.state.isActiveTrat ? "active" : "";
    let isActiveCam = this.state.isActiveCam ? "active" : "";

    return (
      <div className="device-filtering">
             <div className="filter-header">
               <div className="label center-align">FILTERING</div>
             </div>
             <div className="filter-devices-info col s12">
               <div className="protocol col s12">
                 <div className="label">PROTOCOL</div>

                 <div className={"filter-btn col s6 " + isActiveMqtt} onClick={this.selectItemMqtt}>
                   <div className="filter-label">MQTT</div>
                 </div>
                 <div className={"filter-btn col s6 " + isActiveVirtual} onClick={this.selectItemVirtual}>
                   <div className="filter-label">Virtual</div>
                 </div>
               </div>

               <div className="protocol col s12">
                 <div className="label col s12">TYPE</div>
                 <div className={"filter-btn col s4 " + isActiveCol} onClick={this.selectItemCol}>
                   <div className="filter-label">Col</div>
                 </div>
                 <div className={"filter-btn col s4 " + isActiveTrat} onClick={this.selectItemTrat}>
                   <div className="filter-label">Trat</div>
                 </div>
                 <div className={"filter-btn col s4 " + isActiveCam} onClick={this.selectItemCam}>
                   <div className="filter-label">Cam</div>
                 </div>
               </div>
             </div>

             <div className="filter-devices-search">
               <div className="label center-align">SEARCH BY</div>
               <form className="col s12 row" onSubmit={this.addFilter}>
                 <div className="col s12">
                   <div className="input-field col s5">
                     <MaterialSelect id="attributes-select" name="attribute" value={this.state.attribute}
                                     onChange={this.handleChangeAttribute}>
                       <option value="Name">Name</option>
                       <option value="ID">ID</option>
                       <option value="Protocol">Protocol</option>
                       <option value="Tags">Tags</option>
                       <option value="Status">Status</option>
                     </MaterialSelect>
                     <label>Attribute</label>
                   </div>
                   <div className="input-field col s5">
                     <input id="value" type="text" className="validate" name="value"
                            value={this.state.value} onChange={this.handleChangeValue}/>
                     <br/>
                     <label>Value</label>
                   </div>
                   <div className="btn-plus col s2" onClick={this.addFilter}>
                     <i className="fa fa-plus"></i>
                   </div>
                 </div>
                   {click ? (
                       <FieldSearchValues attribute={this.state.attribute} value={this.state.value}/>
                   ) : (
                       <div className="search-value col s12 offset-s1">
                       </div>
                   )}
                 <div className="actions-buttons">
                   <div className="col s6 button">
                     <a className="waves-effect waves-light btn" id="btn-clear" tabIndex="-1"
                        title="Clear" onClick={this.clearSearch}>
                       Clear
                     </a>
                   </div>

                   <div className="col s6 button" type="submit">
                     <a className="waves-effect waves-light btn" id="btn-search" tabIndex="-1"
                        title="Search">
                       <i className="clickable fa fa-search"/>
                     </a>
                   </div>
                 </div>
               </form>
             </div>

             {/* <div className="col s12 background-info" onClick={this.devicesSidebar}>
               <a className="waves-effect waves-light">DEVICES</a>
             </div> */}

           </div>
      )
  }
}

class SideBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      click: false,
      nextKey: "filtering",
      sideBarOpened: false
    };

    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.changeSideBar = this.changeSideBar.bind(this);
  }

  toggleSideBar() {
    const last = this.state.sideBarOpened;
    console.log("toggleSideBar ",last);
    this.setState({sideBarOpened: !last});
  }

  changeSideBar(e) {
    e.preventDefault();
    this.setState({
      click: !this.state.click,
      nextKey: (this.state.click ? "filtering" : "devices")
    });
  }

  render(){
    function Footer(props) {
      return (
        <div className="device-footer col s12 background-info" onClick={props.callback}>
            <a className="waves-effect waves-light">{props.nextKey.toUpperCase()}</a>
          </div>
      )
    }

    const btnSideBarClass = "fa fa-chevron-" + (this.state.sideBarOpened ? "right" : "left");
    const divFilterList =  this.state.click ? (
      <Filter devices={this.props.devices} callback={this.changeSideBar}/>
    ) : (
      <List devices={this.props.devices}
            callback={this.changeSideBar}
            toggleDisplay={this.props.toggleDisplay}/>
    );

    return (
      <div className="col m12">
        <div className={"col m12 div-btn-side-painel " + (this.state.sideBarOpened ? 'push-left' : 'no-left')}>
          <button type="button" className='btn btn-circle sideBarToggle' onClick={this.toggleSideBar}>
            <i className={btnSideBarClass} aria-hidden="true"></i>
          </button>
        </div>
        { this.state.sideBarOpened ? (
          <div className="col device-painel full-height">
            <div className="col device-painel-body">
              {divFilterList}
            </div>
            <Footer callback={this.changeSideBar} nextKey={this.state.nextKey} />
          </div>
        ) : (
          null
        )}
      </div>
    )
  }
}

export default SideBar;
