import React, { Component } from 'react';
import {
  Button,
  Checkbox,
  Confirm,
  Dropdown,
  Header,
  Image,
  Input,
  Pagination,
  Popup,
  Segment,
  Table
} from 'semantic-ui-react';
import { observer } from 'mobx-react';
import FileDataStore from '../stores/fileDataStore';
import FileStore from '../stores/fileStore';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { formatDateTime } from '../helper/util';

@observer
class Files extends Component {

  constructor(props) {
    super(props);

    this.filesPerPageOptions = [
      { key: 1, text: '10', value: 10 },
      { key: 2, text: '20', value: 20 },
      { key: 3, text: '50', value: 50 },
      { key: 4, text: 'All', value: -1 }];
    this.state = {
      origin: window.location.origin,
      deleteOpen: false,
      checked: [],
      activePage: 1,
      filesPerPage: this.filesPerPageOptions[0].value
    };
    this.handleRefresh();
  }

  handleRefresh = () => {
    FileDataStore.fetchFileData();
  };

  handlePageChange = (event, { activePage }) => {
    this.setState({ activePage });
  };

  handleFilesPerPageChange = (event, { value }) => {
    let { activePage } = this.state;
    if (value === -1) {
      activePage = 1;
    } else {
      const { fileData } = FileDataStore;
      const fileCount = Object.keys(fileData).length;
      let newTotalPages = Math.ceil(fileCount / value);
      if (activePage > newTotalPages) {
        activePage = newTotalPages;
      }
    }

    this.setState({ filesPerPage: value, activePage: activePage });
  };

  handleDisplayNameEdit = (file) => {
    this.setState({ editFile: file, editDisplayName: file.displayName });
  };

  handleDisplayNameChange = (event) => {
    const displayName = event.target.value;
    this.setState({ editDisplayName: displayName });
    FileDataStore.patchFileDisplayName(this.state.editFile.urlName, displayName);
  };

  handleDisplayNameBlur = (event) => {
    this.setState({ editFile: null });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.setState({ editFile: null });
    }
  };

  handleLink = (urlName) => {
    this.props.history.push(urlName);
  };

  handleDeleteRequest = (file) => {
    this.setState({ deleteOpen: true, deleteFile: file });
  };

  handleDeleteCancel = () => {
    this.setState({ deleteOpen: false, deleteFile: {} });
  };

  handleDeleteConfirm = () => {
    FileStore.deleteFile(this.state.deleteFile.urlName);
    this.setState({ deleteOpen: false, deleteFile: {} });
  };

  handleCheckboxAll = () => {
    const { fileData } = FileDataStore;
    let { checked } = this.state;
    if (this.isAllChecked()) {
      checked = [];
    } else {
      checked = Object.keys(fileData).map((key) => key);
    }
    this.setState({ checked: checked });
  };

  handleToggleCheckbox = (file) => {
    const { checked } = this.state;
    if (checked.includes(file.urlName)) {
      checked.splice(checked.indexOf(file.urlName), 1);
    } else {
      checked.push(file.urlName);
    }
    this.setState({ checked: checked });
  };

  handleDeleteCheckedRequest = () => {
    const { checked } = this.state;
    if (checked.length === 0) return;
    this.setState({ deleteCheckedOpen: true });
  };

  handleDeleteCheckedCancel = () => {
    this.setState({ deleteCheckedOpen: false });
  };

  handleDeleteCheckedConfirm = () => {
    const { checked } = this.state;
    checked.forEach((urlName) => FileStore.deleteFile(urlName));
    this.setState({ deleteCheckedOpen: false, checked: [] });
  };

  isAllChecked = () => {
    const { checked } = this.state;
    const { fileData } = FileDataStore;
    return checked.length > 0 && checked.length === Object.keys(fileData).length;
  };

  createFileRows = () => {
    const { fileData } = FileDataStore;
    const { editFile, editDisplayName, activePage, filesPerPage } = this.state;
    const pageIndex = activePage * filesPerPage;
    const displayAll = filesPerPage === -1;
    return (Object.keys(fileData).map((key) => fileData[key]).sort((f1, f2) => Date.parse(f2.timestamp) - Date.parse(f1.timestamp))
      .filter((file, index) => displayAll || index >= pageIndex - filesPerPage && index < pageIndex).map((file, index) =>
        <Table.Row key={index}>
          <Table.Cell><Checkbox fitted checked={this.state.checked.includes(file.urlName)}
                                onChange={() => this.handleToggleCheckbox(file)}/></Table.Cell>
          <Table.Cell singleLine>
            {editFile && editFile.urlName === file.urlName ?
              <Input fluid autoFocus value={editDisplayName} onChange={this.handleDisplayNameChange}
                     onKeyDown={this.handleKeyDown}/>
              :
              <React.Fragment>
                <Popup position='bottom left' trigger={
                  <Link to={file.urlName} className='wrap'>{file.displayName}</Link>}>
                  <Popup.Header>{file.displayName}</Popup.Header>
                  <Popup.Content><Image className='fixed-size'
                                        src={'api/file/' + file.urlName}/></Popup.Content>
                </Popup>
                <Button compact floated='right' circular icon='pencil alternate'
                        onClick={() => this.handleDisplayNameEdit(file)}/>
              </React.Fragment>
            }

          </Table.Cell>
          <Table.Cell singleLine>{formatDateTime(file.timestamp)}</Table.Cell>
          <Table.Cell singleLine>
            <Button primary compact onClick={() => this.handleLink(file.urlName)} icon='share square'/>
            <Button compact onClick={() => this.handleDeleteRequest(file)} icon='delete' color='red'/>
          </Table.Cell>
        </Table.Row>
      ));
  };

  render() {
    const { fileData } = FileDataStore;
    const fileCount = Object.keys(fileData).length;
    const { deleteOpen, deleteFile, deleteCheckedOpen, checked, activePage, filesPerPage } = this.state;
    const displayAll = filesPerPage === -1;

    return (
      <React.Fragment>
        <Helmet>
          <title>List Files - FileUploader</title>
        </Helmet>
        <Segment className='border'>
          {deleteCheckedOpen &&
          <Confirm open={deleteCheckedOpen} onCancel={this.handleDeleteCheckedCancel}
                   onConfirm={this.handleDeleteCheckedConfirm}
                   header={checked.length === 1 ? fileData[checked[0]].displayName : checked.length + ' Files'}
                   content={'Are you sure you want to delete ' + (checked.length === 1 ? 'the file?' : checked.length + ' files?')}
                   confirmButton='Delete'/>}
          {deleteOpen &&
          <Confirm open={deleteOpen} onCancel={this.handleDeleteCancel} onConfirm={this.handleDeleteConfirm}
                   header={deleteFile.displayName}
                   content='Are you sure you want to delete the file?'
                   confirmButton='Delete'/>}
          <Button onClick={this.handleRefresh} icon='refresh'/>
          <Button onClick={this.handleDeleteCheckedRequest} icon='delete' color='red'/>
          <Pagination activePage={activePage} totalPages={displayAll ? 1 : Math.ceil(fileCount / filesPerPage)}
                      onPageChange={this.handlePageChange} className='right floated'/>
          <Table compact striped selectable fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className='checkbox-width'>
                  <Checkbox fitted checked={this.isAllChecked()} onChange={this.handleCheckboxAll}/>
                </Table.HeaderCell>
                <Table.HeaderCell>File</Table.HeaderCell>
                <Table.HeaderCell className='date-width'>Date</Table.HeaderCell>
                <Table.HeaderCell className='button-width'/>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.createFileRows()}
            </Table.Body>
          </Table>
          <Header as='h4'>
            <Dropdown compact selection value={filesPerPage} options={this.filesPerPageOptions}
                      onChange={this.handleFilesPerPageChange} style={{ marginRight: '10px' }}/>
            Files per page
          </Header>
        </Segment>
      </React.Fragment>
    );
  }
}

export default Files;
