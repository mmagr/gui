import React, { Component } from 'react';

function SubHeaderItem(props) {
  return (
    <div className={"box-sh-item" + (props.active === 'true' ? " active" : " inactive") }>
      <div className="icon">{props.icon}</div>
      <div className="text">{props.text}</div>
    </div>
  )
}

function SubHeader(props) {
  return (
    <div className="row z-depth-2 devicesSubHeader" id="inner-header">
      {props.children}
    </div>
  )
}

export {SubHeader, SubHeaderItem};
