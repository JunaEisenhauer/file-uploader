import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import Login from './login';
import LoginStore from '../stores/loginStore';
import { observer } from 'mobx-react';
import NavigationBar from '../components/navigationBar';
import Upload from './upload';
import Files from './files';
import Secret from './secret';
import DisplayFile from './displayFile';
import { Switch } from 'react-router';
import { Helmet } from 'react-helmet';

@observer
class Layout extends Component {

  constructor(props) {
    super(props);

    LoginStore.fetchTokenLogin();
  }

  // logout & display username
  // create new secret
  // upload a file
  // file list (implementation of api needed) with date


  // image page (displayes single image)
  // display name
  // owner
  // upload time
  // url (share link)

  render() {
    const { loggedIn, tokenChecked } = LoginStore;
    if (!tokenChecked) return (<React.Fragment/>);

    return (
      <React.Fragment>
        <Helmet>
          <title>File Uploader</title>
        </Helmet>
        <BrowserRouter>
          <Route exact path='/(login|signup)' component={Login}/>
          <Route exact path='/'><Redirect to='/upload'/></Route>
          <Route path='/' component={NavigationBar}/>
          {!loggedIn && <Route exact path='/(upload|secret|files)'><Redirect to='/login'/></Route>}
          <Switch>
            <Route exact path='/upload' component={Upload}/>
            <Route exact path='/secret' component={Secret}/>
            <Route exact path='/files' component={Files}/>
            <Route component={DisplayFile}/>
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default Layout;
