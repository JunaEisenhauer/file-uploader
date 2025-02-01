import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Card, Image } from 'semantic-ui-react';
import FileDataStore from '../stores/fileDataStore';
import { Helmet } from 'react-helmet';
import { formatDateTime } from '../helper/util';

@observer
class DisplayFile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      url: props.location.pathname.substring(1)
    };

    FileDataStore.fetchFileData(this.state.url);
  }

  handleDownload = () => {
    window.open('/api/file/' + this.state.url, '_blank');
  };

  render() {
    const { url } = this.state;
    const fileData = FileDataStore.fileData[url];

    return (
      <main className='border'>
        <Card fluid centered>
          {fileData &&
          <Helmet>
            <title>{fileData.displayName} - FileUploader</title>
          </Helmet>
          }
          <Card.Content>
            <Card.Header>
              {fileData && fileData.displayName}
              <Button onClick={this.handleDownload} icon='download' className='download'/>
            </Card.Header>
            <Card.Meta>{fileData && formatDateTime(fileData.timestamp)}</Card.Meta>
            <Card.Description>
              <Image centered className='file-display' src={'api/file/' + url}/>
            </Card.Description>
          </Card.Content>
        </Card>
      </main>
    );
  }
}

export default DisplayFile;
