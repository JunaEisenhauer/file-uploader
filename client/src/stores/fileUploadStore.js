import { action } from 'mobx';
import LoginStore from './loginStore';
import { fetch } from 'whatwg-fetch';

class FileUploadStore {

  @action fetchFile(file, callback) {
    if (!file) return;
    const formData = new FormData();

    formData.append('file', file);
    fetch('/api/file', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + LoginStore.token
      },
      body: formData
    }).then((response) => {
      response.json().then((json) => {
        callback(json);
      });
    }).catch((error) => {
      throw error;
    });
  }
}

export default new FileUploadStore();
