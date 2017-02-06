import React from 'react';
import { Router, Route, IndexRoute, Redirect, hashHistory } from 'react-router';

import Full from './containers/full/'
import Devices from './views/devices/'
import Templates from './views/deviceTemplates/'
import Dashboard from './views/dashboard/'

export default (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={Full}>
      <IndexRoute component={Dashboard}/>
      <Route path="dashboard" name="Home" component={Dashboard} />
      <Route path="devices" name="Devices" component={Devices} />
      <Route path="templates" name="Device Templates" component={Templates} />
      <Route path="config" name="Settings" component={Dashboard} />
      <Route path="flows" name="Information Flows" component={Dashboard} />
    </Route>
  </Router>
);
