import { action, observable } from 'mobx';
import Cookie from 'js-cookie';
import FileDataStore from './fileDataStore';

class LoginStore {

  @observable loggedIn;
  @observable loading;
  @observable errorMessage;
  @observable tokenChecked;
  @observable token;
  loadedState;
  loadedCallbacks = [];

  @action fetchLogin(username, password, callback) {
    if (!username || !password) return;
    this.enableLoading();
    this.loadedCallbacks.push(callback);
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    }).then((response) => {
      this.handleResponse(response);
    }).catch((error) => {
      this.disableLoading();
      throw error;
    });
  }

  @action fetchTokenLogin() {
    const token = Cookie.get('token');
    if (!token) {
      this.tokenChecked = true;
      return;
    }
    fetch('/api/login', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then((response => {
      response.json().then((json) => {
        if (json.status === 'successful') {
          this.token = token;
          this.loggedIn = true;
          this.errorMessage = null;
        } else {
          Cookie.remove('token');
        }
        this.tokenChecked = true;
      });
    }));
  }

  @action fetchSignUp(username, password, callback) {
    if (!username || !password) return;
    this.enableLoading();
    this.loadedCallbacks.push(callback);
    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    }).then((response) => {
      this.handleResponse(response);
    }).catch((error) => {
      this.disableLoading();
      throw error;
    });
  }

  @action logOut() {
    Cookie.remove('token');
    this.loggedIn = false;
  }

  handleResponse(response) {
    response.json().then((json) => {
      if (json.status) {
        if (json.status === 'successful' && json.token) {
          this.loggedIn = true;
          this.errorMessage = null;
          this.token = json.token;
          Cookie.set('token', this.token, { expires: 150 /*httpOnly: true, secure: true, sameSite: 'None' */ });
          FileDataStore.fetchFileData();
        } else if (json.status === 'error' && json.message) {
          this.loadedCallbacks.push(() => {
            this.errorMessage = json.message;
          });
        }
      }

      this.disableLoading();
    });
  }

  enableLoading() {
    this.loading = true;
    this.loadedState = false;
    setTimeout(() => {
      if (this.loadedState) {
        this.finishLoading();
      } else {
        this.loadedState = true;
      }
    }, 1000);
  }

  disableLoading() {
    if (this.loadedState) {
      this.finishLoading();
    } else {
      this.loadedState = true;
    }
  }

  finishLoading() {
    this.loading = false;
    this.loadedCallbacks.forEach((callback) => callback());
    this.loadedCallbacks = [];
  }
}

export default new LoginStore();
