import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import LoginStore from '../stores/loginStore';
import logo from '../resources/logo.png';
import { observer } from 'mobx-react';
import { Helmet } from 'react-helmet';


@observer
class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isSignUpPage: this.props.match.path === '/signup',
      username: '',
      password: '',
      confirm: ''
    };

    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onUsernameChange = (event) => {
    const username = event.target.value;
    if (this.state.usernameNotSet === true && username) {
      this.setState({ usernameNotSet: false });
    }
    this.setState({ username: username });
  };

  onPasswordChange = (event) => {
    const password = event.target.value;
    if (this.state.passwordNotSet === true && password) {
      this.setState({ passwordNotSet: false });
    }
    this.setState({ password: password });
  };

  onConfirmChange = (event) => {
    const confirm = event.target.value;
    if (this.state.confirmWrong === true && confirm) {
      this.setState({ confirmWrong: false });
    }
    this.setState({ confirm: confirm });
  };

  handleLogin = () => {
    const { username, password } = this.state;
    let valid = true;
    if (!username) {
      this.setState({ usernameNotSet: true });
      valid = false;
    }
    if (!password) {
      this.setState({ passwordNotSet: true });
      valid = false;
    }
    if (!valid) return;
    this.resetErrors();
    LoginStore.fetchLogin(username, password, () => {
      if (this.mounted) this.setState({ password: '', confirm: '' });
    });
  };

  handleSignUp = () => {
    const { username, password, confirm } = this.state;
    let valid = true;
    if (!username) {
      this.setState({ usernameNotSet: true });
      valid = false;
    }
    if (!password) {
      this.setState({ passwordNotSet: true });
      valid = false;
    }
    if (password !== confirm) {
      this.setState({ confirmWrong: true, confirm: '' });
      valid = false;
    }
    if (!valid) return;
    this.resetErrors();
    LoginStore.fetchSignUp(username, password, () => {
      if (this.mounted) this.setState({ password: '', confirm: '' });
    });
  };

  handleLinkLogin = () => {
    this.resetErrors();
    this.setState({
      isSignUpPage: false,
      password: '',
      confirm: ''
    });
  };

  handleLinkSignUp = () => {
    this.resetErrors();
    this.setState({
      isSignUpPage: true,
      password: '',
      confirm: ''
    });
  };

  resetErrors = () => {
    LoginStore.errorMessage = null;
    this.setState({
      usernameNotSet: false,
      passwordNotSet: false,
      confirmWrong: false
    });
  };

  render() {
    const { loggedIn, errorMessage, loading } = LoginStore;
    if (loggedIn) {
      return (<Redirect to='/'/>);
    }
    const { isSignUpPage, username, password, confirm, usernameNotSet, passwordNotSet, confirmWrong } = this.state;

    return (
      <React.Fragment>
        <Helmet>
          <title>{isSignUpPage ? 'Sign up' : 'Log in'} - FileUploader</title>
        </Helmet>
        <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              <Image src={logo}/>
              {isSignUpPage ? 'Create a new account' : 'Log-in to your account'}
            </Header>
            <Form size="large" loading={loading}>
              <Segment stacked>
                {errorMessage && <Message negative>{errorMessage}</Message>}
                <Form.Input fluid icon="user" iconPosition="left" placeholder="Username"
                            value={username}
                            onChange={this.onUsernameChange}
                            error={usernameNotSet && {
                              content: 'Please enter an username',
                              pointing: 'below'
                            }}/>
                <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" type="password"
                            value={password}
                            onChange={this.onPasswordChange}
                            error={passwordNotSet && {
                              content: 'Please enter a password',
                              pointing: 'above'
                            }}/>
                {isSignUpPage &&
                <Form.Input fluid icon="lock" iconPosition="left" placeholder="Confirm Password" type="password"
                            value={confirm}
                            onChange={this.onConfirmChange}
                            error={confirmWrong && { content: 'Password does not match', pointing: 'above' }}/>

                }
                {isSignUpPage ?
                  <Button color="teal" fluid size="large" onClick={this.handleSignUp}>
                    Sign up
                  </Button>
                  :
                  <Button color="teal" fluid size="large" onClick={this.handleLogin}>
                    Log in
                  </Button>
                }
              </Segment>
            </Form>
            {isSignUpPage ?
              <Message>
                Already have an account? <Link to="/login" onClick={this.handleLinkLogin}>Log In</Link>
              </Message>
              :
              <Message>
                New to us? <Link to="/signup" onClick={this.handleLinkSignUp}>Sign Up</Link>
              </Message>
            }
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Login;
