import { action, observable } from 'mobx';
import LoginStore from './loginStore';

class FileDataStore {

  @observable fileData = {};

  @action fetchFileData(urlName) {
    fetch('/api/filedata' + (urlName ? '/' + urlName : ''), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + LoginStore.token
      }
    }).then((response) => {
      response.json().then((json) => {
        let fileData = this.fileData;
        if (!urlName) fileData = {};
        for (const file of json) {
          if (file.urlName && file.displayName && file.timestamp) {
            fileData[file.urlName] = {
              displayName: file.displayName,
              timestamp: file.timestamp,
              urlName: file.urlName
            };
          }
        }
        this.fileData = fileData;
      });
    }).catch((error) => {
      throw error;
    });
  }

  @action patchFileDisplayName(urlName, displayName) {
    if (!urlName || !displayName) return;
    fetch('/api/filedata/' + urlName, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + LoginStore.token
      }, body: JSON.stringify({ displayName })
    }).then((response) => {
      response.json().then((json) => {
        if (json.status === 'successful' && json.urlName) {
          this.fetchFileData(json.urlName);
        }
      });
    }).catch((error) => {
      throw error;
    });
  }

  @action patchFileUrlName(urlName, newUrlName) {
    if (!urlName || !newUrlName) return;
    fetch('/api/filedata/' + urlName, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + LoginStore.token
      }, body: JSON.stringify({ urlName: newUrlName })
    }).then((response) => {
      response.json().then((json) => {
        if (json.status && json.status === 'successful' && json.urlName) {
          this.fetchFileData(json.urlName);
        }
      });
    }).catch((error) => {
      throw error;
    });
  }
}

export default new FileDataStore();
