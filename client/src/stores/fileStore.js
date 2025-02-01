import { action } from 'mobx';
import LoginStore from './loginStore';
import FileDataStore from './fileDataStore';

class FileStore {

  @action deleteFile(urlName) {
    if (!urlName) return;
    fetch('/api/file/' + urlName, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + LoginStore.token
      }
    }).then((response) => {
      response.json().then((json) => {
        if (json.status && json.status === 'successful' && json.urlName) {
          FileDataStore.fetchFileData();
        }
      });
    }).catch((error) => {
      throw error;
    });
  }
}

export default new FileStore();
