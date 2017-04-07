import React, { Component } from 'react';

import templateManager from '../../comms/templates/TemplateManager';
import TemplateStore from '../../stores/TemplateStore';
import TemplateActions from '../../actions/TemplateActions';

import AltContainer from 'alt-container';

import { PageHeader } from "../../containers/full/PageHeader";
import Filter from "../utils/Filter";
import Dropzone from 'react-dropzone'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class DeviceAttributes extends Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(e) {
    this.props.removeAttribute(this.props.attribute);
  }

  render () {
    return (
      <div>
        {this.props.attribute.name} [{this.props.attribute.type}] &nbsp;
        <a title="Remove Attribute" className="btn-item" onClick={this.handleRemove}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </a>
      </div>
    )
  }
}

class DeviceImageUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: ""
    }

    this.onDrop = this.onDrop.bind(this);
    this.upload = this.upload.bind(this);
  }

  // this allows us to remove the global script required by materialize as in docs
  componentDidMount() {
    let mElement = ReactDOM.findDOMNode(this.refs.modal);
    $(mElement).ready(function() {
      $('.modal').modal();
    })
  }

  onDrop(acceptedFiles) {
    console.log("got files", acceptedFiles);
    this.setState({selection: acceptedFiles[0]});
  }

  upload(e) {
    console.log("about to upload", this.state.selection.name);
    TemplateActions.triggerIconUpdate(this.props.targetDevice, this.state.selection);
  }

  render() {
    return (
      <div className="modal" id="imageUpload" ref="modal">
        <div className="modal-content">
          <div className="row">
            <Dropzone onDrop={this.onDrop} className="dropbox">
              <div className="dropbox-help">Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          </div>
          { this.state.selection ? (
            <div className="row fileSelection">
              <span className="label">Selected file</span>
              <span className="data">{this.state.selection.name}</span>
            </div>
          ) : (
            <div className="row fileSelection">
              <span className="data">No file selected</span>
            </div>
          )}
          <div className="pull-right padding-bottom">
            <a onClick={this.upload}
               className=" modal-action modal-close waves-effect waves-green btn-flat">Update</a>
            <a className=" modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
          </div>
        </div>
      </div>
    )
  }
}

function SummaryItem(props) {
  return (
    <div className="lst-entry-wrapper z-depth-2 col s12">
      <div className="lst-entry-title col s12">
        <div className="user-label">{props.template.label}</div>
        <div className="label">template name</div>
      </div>

      <div className="lst-entry-body col s12">
        {/* TODO fill those with actual metrics */}
        <div className="col s4 metric">
          <div className="metric-value">value</div>
          <div className="metric-label">Attributes</div>
        </div>
        <div className="col s4 metric">
          <div className="metric-value">VALUE</div>
          <div className="metric-label"># Devices</div>
        </div>
        <div className="col s4 metric last">
          <div className="metric-value">12345</div>
          <div className="metric-label">Last update</div>
        </div>
      </div>
    </div>
  )
}

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      device: {
        id: this.props.device.id,
        label: this.props.device.label,
        attributes: []
      },
      attribute: "",
      typeAttribute: ""
    }

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.addAttribute = this.addAttribute.bind(this);
    this.removeAttribute = this.removeAttribute.bind(this);
    this.handleAttribute = this.handleAttribute.bind(this);
    this.updateDevice = this.updateDevice.bind(this);
    this.deleteDevice = this.deleteDevice.bind(this);
  }

  handleDetail(e) {
    e.preventDefault();
    this.props.detailedTemplate(this.props.device.id);
  }

  handleEdit(e) {
    e.preventDefault();
    this.props.editTemplate(this.props.device.id);
  }

  handleDismiss(e) {
    e.preventDefault();
    this.props.detailedTemplate(undefined);
    console.log("will dismiss - " + this.state.device.id);
  }

  updateDevice(e) {
      e.preventDefault();
      let device = this.state.device;
      device.has_icon = this.props.device.has_icon;
      TemplateActions.triggerUpdate(this.state.device);
      console.log("will update - " + this.state.device.id);
  }

  deleteDevice(e) {
      e.preventDefault();
      TemplateActions.triggerRemoval(this.state.device);
  }

  addAttribute(t) {
    let state = this.state.device;
    state.attributes.push({name: this.state.attribute, type: this.state.typeAttribute});
    this.state.attribute = '';
    this.state.typeAttribute = '';
    this.setState({ device : state});
  }

  removeAttribute(attribute) {
    let state = this.state.device;

    for(var i = 0; i < state.attributes.length; i++) {
        if(state.attributes[i].name === attribute.name) {
           state.attributes.splice(i, 1);
        }
    }

    this.setState({device: state});
  }

  handleAttribute(event) {
    const target = event.target;
    let state = this.state;
    state[target.name] = target.value;
    this.setState(state);
  }

  handleChange(event) {
    const target = event.target;
    let state = this.state.device;
    state[target.name] = target.value;
    this.setState({
      device: state
    });
  }

  render() {
    let detail = this.props.detail === this.props.device.id;
    let edit = (this.props.edit === this.props.device.id) && detail;

    // console.log("about to check for icon: " + this.props.device.id + " " + this.props.device.has_icon);
    // let labelSize = this.props.device.has_icon ? "lst-title col s10" : "lst-title col s12";
    // let iconUrl = "http://localhost:5000/template/" + this.props.device.id + "/icon";

    return (
      <div className="lst-entry col s12 m4" id={this.props.device.id} onClick={detail ? null : this.handleDetail}>
        {/* { detail && edit && (
          <EditWrapper device={this.props.device} handleRemove={this.handleRemove} handleDismiss={this.handleDismiss}/>
        )}
        { detail && !edit && (
          <DetailItem device={this.props.device} handleEdit={this.handleEdit} handleDismiss={this.handleDismiss}/>
        )} */}
        { !detail && (
          <SummaryItem template={this.props.device} />
        )}
      </div>
    )


    return (
      <div className="lst-entry row"
           onClick={detail ? null : this.handleDetail }
           id={this.props.device.id}>
        <div className="col s1 icon">
          { this.props.device.has_icon ? (
            <img src={'http://localhost:5000/template/' + this.props.device.id + '/icon?extra=' + this.props.device.toggle }
                 alt="this should be an icon" />
          ) : (
            <i className="fa fa-microchip" />
          )}
        </div>
        <form role="form">
          {/* <!-- text status area --> */}
          {!detail && (
            <div className="lst-line col s11">
              <div className={labelSize}>
                <span>{this.props.device.label}</span>
              </div>
              <div className="col m12 hide-on-small-only">
                <div className="data no-padding-left">{this.props.device.id}</div>
              </div>
            </div>
          )}
          {detail && (
            <div className="lst-line col s11">
              { edit ? (
                <div className="col s12">
                  <div className="input-field col s8">
                    <label htmlFor="fld_name">Name</label>
                    <input id="fld_name" type="text"
                           name="label"
                           autoFocus
                           onChange={this.handleChange.bind(this)}
                           value={this.state.device.label} />
                  </div>
                  <div className="col s4">
                    <div className="edit right inline-actions">
                      <a className="btn-floating waves-green right" onClick={this.handleDismiss}>
                        <i className="fa fa-times"></i>
                      </a>
                      <a className="btn-floating waves-green right red" onClick={this.deleteDevice}>
                        <i className="fa fa-trash-o"></i>
                      </a>
                      <button data-target="imageUpload" className="btn-floating waves-effect waves-light right" >
                        <i className="fa fa-file-image-o"></i>
                      </button>
                      {/* <a className="btn-floating waves-green right" onClick={this.deleteDevice}>
                      </a> */}
                    </div>
                  </div>
                  <div className="col m12 hide-on-small-only">
                    <div className="data no-padding-left">{this.props.device.id}</div>
                  </div>

                  <DeviceImageUpload targetDevice={this.props.device.id}/>
                </div>
              ) : (
                <div className="lst-line col s12">
                  <div className="lst-title col s10">
                    <span>{this.props.device.label}</span>
                  </div>
                  <div className="col s2">
                    <div className="edit right inline-actions">
                      <a className="btn-floating waves-green right" onClick={this.handleDismiss}>
                        <i className="fa fa-times"></i>
                      </a>
                      <a className="btn-floating waves-green right" onClick={this.handleEdit}>
                        <i className="material-icons">mode_edit</i>
                      </a>
                    </div>
                  </div>
                  <div className="col m12 hide-on-small-only">
                    <div className="data no-padding-left">{this.props.device.id}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {detail && (
            <div className="detailArea col m12">
              { edit ? (
                <div className="row">
                  {/* <!-- attributes --> */}
                  <div className="row">
                    <div className="col s6">
                      <div className="input-field">
                        <label htmlFor="fld_Attributes" >Attributes</label>
                        <input id="fld_Attributes"
                               type="text"
                               name="attribute"
                               value={this.state.attribute}
                               key="attributeName"
                               onChange={this.handleAttribute}></input>
                      </div>
                    </div>
                    <div className="col s4">
                      <div className="input-field">
                        <label htmlFor="fld_Type_Attributes" >Type</label>
                        <input id="fld_Type_Attributes"
                               type="text"
                               name="typeAttribute"
                               value={this.state.typeAttribute}
                               key="attributeName"
                               onChange={this.handleAttribute}></input>
                      </div>
                    </div>
                    <div className="col s2" >
                      <div title="Add Attribute"
                           className="btn btn-item btn-floating waves-effect waves-light cyan darken-2"
                           onClick={this.addAttribute}>
                        <i className="fa fa-plus"></i>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12" >
                      <div className="align-list">
                        {this.state.device.attributes.map((attribute) =>(
                          <DeviceAttributes attribute={attribute} removeAttribute={this.removeAttribute} key={attribute.name} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col s12">
                    <div className="pull-right">
                      <a onClick={this.updateDevice}
                         className=" modal-action modal-close waves-effect waves-green btn-flat">Send
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="lst-title col s12">
                    <span>Attributes</span>
                  </div>
                  <div className="col s12">
                    <div className="col s2">
                      <span>Name</span>
                    </div>
                    <div className="col s2">
                      <span>Type</span>
                    </div>
                    <div className="col s8">
                    </div>
                  </div>
                  <div className="col s12">
                    {this.state.device.attributes.map((attribute) =>(
                      <div key={attribute.name}>
                          <div className="col s2">
                            <i className="fa fa-caret-right" aria-hidden="true"></i> {attribute.name} &nbsp;
                          </div>
                          <div className="col s2">
                            <i className="fa fa-caret-right" aria-hidden="true"></i> {attribute.type} &nbsp;
                          </div>
                          <div className="col s8">
                            &nbsp;
                          </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    )
  }
}

class TemplateList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: ''
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.applyFiltering = this.applyFiltering.bind(this);
    this.detailedTemplate = this.detailedTemplate.bind(this);
    this.editTemplate = this.editTemplate.bind(this);
    this.updateDevice = this.updateDevice.bind(this);
    this.deleteDevice = this.deleteDevice.bind(this);
  }

  detailedTemplate(id) {
    console.log("about to set detail: " + id);
    if (this.state.detail && this.state.edit) {
      console.log("are you sure???");
    }

    let temp = this.state;
    temp.detail = id;
    this.setState(temp);
    return true;
  }

  editTemplate(id) {
    if (this.state.detail === id) {
      let temp = this.state;
      temp.edit = id;
      this.setState(temp);
      return true;
    }

    return false;
  }

  handleSearchChange(event) {
    const filter = event.target.value;
    let state = this.state;
    state.filter = filter;
    state.detail = undefined;
    this.setState(state);
  }

  applyFiltering(list) {
    return list;

    const filter = this.state.filter;
    const idFilter = filter.match(/id:\W*([-a-fA-F0-9]+)\W?/);
    return this.props.devices.filter(function(e) {
      let result = false;
      if (idFilter && idFilter[1]) {
        result = result || e.id.toUpperCase().includes(idFilter[1].toUpperCase());
      }

      return result || e.label.toUpperCase().includes(filter.toUpperCase());
    });
  }

  updateDevice(device) {
      this.props.updateDevice(device);

      let state = this.state;
      state.edit = undefined;
      this.setState(state);
  }

  deleteDevice(id) {
      this.props.deleteDevice(id);

      let state = this.state;
      state.edit = undefined;
      this.setState(state);
  }

  render() {

    const filteredList = this.applyFiltering(this.props.templates);

    if (this.props.loading) {
      return (
        <div className="full-height relative">
          <div className="background-info valign-wrapper">
            <i className="fa fa-circle-o-notch fa-spin fa-fw"/>
          </div>
        </div>
      )
    }
    return (
      <div className="row full-height relative">
        { filteredList.length > 0 ? (
          <div className="col s12 m10 offset-m1 lst-wrapper">
            { filteredList.map((device) =>
                <ListItem device={device}
                          key={device.id}
                          detail={this.state.detail}
                          detailedTemplate={this.detailedTemplate}
                          edit={this.state.edit}
                          editTemplate={this.editTemplate}
                          updateDevice={this.updateDevice}
                          deleteDevice={this.deleteDevice}/>
            )}
          </div>
        ) : (
          <div className="background-info valign-wrapper">No configured templates</div>
        )}

        {/* <!-- footer --> */}
        <div className="col s12"></div>
        <div className="col s12">&nbsp;</div>
      </div>
    )
  }
}

class Templates extends Component {

  constructor(props) {
    console.log('templates init');
    super(props);
  }

  componentDidMount() {
    TemplateActions.fetchTemplates.defer();
  }

  filterChange(newFilter) {
    // TODO make this work properly
    console.log("about to change filter: " + newFilter);
  }

  render() {
    console.log('templates render');
    return (
      <ReactCSSTransitionGroup
          transitionName="first"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500} >
        <PageHeader title="device manager" subtitle="Templates">
          <Filter onChange={this.filterChange} />
          {/* TODO new template should be here */}
        </PageHeader>
        <AltContainer store={TemplateStore}>
          <TemplateList />
        </AltContainer>
      </ReactCSSTransitionGroup>
    );
  }
}

export { Templates as TemplateList };
