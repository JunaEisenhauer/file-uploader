import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Card, CardGroup, Dimmer, Header, Image, Label, Loader, Segment } from 'semantic-ui-react';
import FileUploadStore from '../stores/fileUploadStore';
import '../styles/dropzone.css';

class Upload extends Component {

  constructor(props) {
    super(props);

    this.state = { files: [] };

    this.fileInputRef = React.createRef();
  }

  addFiles = (newFiles) => {
    let { files } = this.state;
    for (const file of newFiles) {
      if (files.filter((f) => f.name === file.name && f.lastModified === file.lastModified && f.size === file.size).length === 0) {
        files.push(file);
      }
    }
    this.setState({ files: files });
  };

  handleDragOver = (event) => {
    event.preventDefault();
    if (!this.state.highlighted) this.setState({ highlighted: true });
  };
  handleDragLeave = (event) => {
    this.setState({ highlighted: false });
  };
  handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    this.addFiles(files);
    this.setState({ highlighted: false });
  };

  handleChange = (event) => {
    let files = event.target.files;
    this.addFiles(files);
  };

  handleUpload = () => {
    if (!this.state.files) return;
    for (const file of this.state.files) {
      if (!file.uploaded && !file.uploading) {
        file.uploading = true;
        file.error = false;
        FileUploadStore.fetchFile(file, (response) => {
          if (response.status === 'successful' && response.urlName) {
            file.uploaded = true;
            file.urlName = response.urlName;
          } else {
            file.error = true;
          }
          file.uploading = false;
          this.forceUpdate();
        });
      }
    }

    this.forceUpdate();
  };

  handleRemove = (file) => {
    const { files } = this.state;
    let index = files.indexOf(file);
    files.splice(index, 1);
    this.setState({ files: files });
  };

  handleUploaded = (file) => {
    this.props.history.push(file.urlName);
  };

  handleSelectFile = () => {
    this.fileInputRef.current.click();
  };

  createFileCards = () => {
    if (!this.state.files) return null;
    return Array.prototype.map.call(this.state.files, (file, index) => {
      const fileSrc = URL.createObjectURL(file);
      return (
        <Card key={index}>
          {file.uploading && <Dimmer active><Loader/></Dimmer>}
          <Card.Content>
            <Card.Header>{file.name}
              {!file.uploading && !file.uploaded && !file.error &&
              <Button compact floated='right' icon='remove' onClick={() => this.handleRemove(file)}/>}
              {file.uploaded &&
              <Label color='green' className='right floated cursor-hover'
                     onClick={() => this.handleUploaded(file)}>Uploaded</Label>}
              {file.error && <Label color='red' className='right floated'>Error</Label>}
            </Card.Header>
            <Card.Description>
              <Image src={fileSrc} className='top-space'/>
            </Card.Description>
          </Card.Content>
        </Card>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Upload - FileUploader</title>
        </Helmet>
        <Segment className='border' onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave}
                 onDrop={this.handleDrop}>
          <input type='file' multiple ref={this.fileInputRef} onChange={this.handleChange}
                 style={{ display: 'none' }}/>
          <Segment className={'cursor-hover dropzone' + (this.state.highlighted ? ' highlighted' : '')}
                   onClick={this.handleSelectFile}>
            <Header textAlign='center'>Select File</Header>
          </Segment>
          <CardGroup className='upload'>
            {this.createFileCards()}
          </CardGroup>
          <Button color="teal" onClick={this.handleUpload}>Upload</Button>
        </Segment>
      </React.Fragment>
    );
  }
}

export default Upload;
