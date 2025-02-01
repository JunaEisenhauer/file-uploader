import { action, observable } from 'mobx';
import LoginStore from './loginStore';

class SecretStore {

  @observable secret;
  @observable errorMessage;

  @action fetchSecret() {
    if (!LoginStore.loggedIn || !LoginStore.token) return;
    fetch('/api/secret', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + LoginStore.token
      }
    }).then((response) => {
      response.json().then((json) => {
        if (json.status === 'successful' && json.secret) {
          this.errorMessage = null;
          this.secret = json.secret;
        } else if (json.status === 'error' && json.message) {
          this.errorMessage = json.message;
        }
      });
    }).catch((error) => {
      throw error;
    });
  }
}

export default new SecretStore();
