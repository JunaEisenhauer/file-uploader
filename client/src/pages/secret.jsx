import React, { Component } from 'react';
import { Button, Divider, Image, Input, Label, Segment } from 'semantic-ui-react';
import SecretStore from '../stores/secretStore';
import { observer } from 'mobx-react';
import { Helmet } from 'react-helmet';
import shareXLogo from '../resources/ShareX_Logo.png';

@observer
class Secret extends Component {

  constructor(props) {
    super(props);

    this.state = { copied: false };

    this.secretInputRef = React.createRef();

    const { secret } = SecretStore;
    if (!secret) SecretStore.fetchSecret();
  }

  handleCopy = (event) => {
    const { secret } = SecretStore;
    if (!secret) return;

    this.secretInputRef.current.select();
    document.execCommand('copy');

    this.setState({ copied: true });
  };

  handleGenerateSecret = () => {
    SecretStore.fetchSecret();
  };

  handleDownloadShareX = () => {
    const element = document.createElement('a');

    const shareXJson = {
      'Name': 'FileUploader',
      'DestinationType': 'ImageUploader, FileUploader',
      'RequestMethod': 'POST',
      'RequestURL': 'http://localhost:8080/api/file',
      'Body': 'MultipartFormData',
      'Arguments': {
        'secret': SecretStore.secret
      },
      'FileFormName': 'file',
      'URL': 'http://localhost:8080/$json:urlName$',
      'ThumbnailURL': 'http://localhost:8080/$json:urlName$'
    };

    const file = new Blob([JSON.stringify(shareXJson)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'FileUploader.sxcu';
    document.body.appendChild(element);
    element.click();
  };

  render() {
    const { secret } = SecretStore;
    const { copied } = this.state;

    return (
      <React.Fragment>
        <Helmet>
          <title>Generate Secret - FileUploader</title>
        </Helmet>
        <Segment className='border'>
          <Input fluid ref={this.secretInputRef} action={{
            color: 'teal',
            labelPosition: 'right',
            icon: 'copy',
            content: 'Copy',
            onClick: this.handleCopy
          }} value={secret || ''}/>
          <Button color="teal" onClick={this.handleGenerateSecret} style={{ marginTop: '12px' }}>Generate new
            secret</Button>
          {copied && <Label pointing='above' size='large' style={{ float: 'right' }}>Copied!</Label>}
          <Divider/>
          <Button color="teal" onClick={this.handleDownloadShareX}>
            <Image className='icon-image' src={shareXLogo}/>
          </Button>
        </Segment>
      </React.Fragment>
    );
  }
}

export default Secret;
