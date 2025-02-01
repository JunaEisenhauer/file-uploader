import React, { Component } from 'react';
import { Button, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import LoginStore from '../stores/loginStore';

class NavigationBar extends Component {

  constructor(props) {
    super(props);

    this.upload = '/upload';
    this.secret = '/secret';
    this.files = '/files';
  }

  handleLogout = () => {
    LoginStore.logOut();
  };

  render() {
    const { loggedIn } = LoginStore;
    const { pathname } = this.props.location;


    return (
      <Menu pointing secondary size='large'>
        {loggedIn && <React.Fragment>
          <Menu.Item
            as={Link} to={this.upload}
            name={this.upload}
            active={pathname === this.upload}
          >Upload a new file</Menu.Item>
          <Menu.Item
            as={Link} to={this.secret}
            name={this.secret}
            active={pathname === this.secret}
          >Generate Secret</Menu.Item>
          <Menu.Item
            as={Link} to={this.files}
            name={this.files}
            active={pathname === this.files}
          >List Files</Menu.Item>
        </React.Fragment>}

        <Menu.Menu position='right'>
          {loggedIn ?
            <Menu.Item as={Link} to='/login'>
              <Button primary onClick={this.handleLogout}>Log out</Button>
            </Menu.Item>
            :
            <Menu.Item as={Link} to='/login'>
              <Button primary>Log in</Button>
            </Menu.Item>
          }
        </Menu.Menu>
      </Menu>
    );
  }
}

export default NavigationBar;
