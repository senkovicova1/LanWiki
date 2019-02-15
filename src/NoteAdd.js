import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, ListGroup, ListGroupItem, ButtonDropdown, ButtonGroup, ButtonToolbar, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rebase } from './index';

import CKEditor from 'ckeditor4-react';

import PictureUpload from './PictureUpload';

/*import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {stateToHTML} from 'draft-js-export-html';*/
//import MyEditor from './Editor';

export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      saving: false,
      dropdownOpen: false,
      modalOpen: false,
      name: "",
      body: "",
      tags: [],
      chosenTags: [],

      inDatabase: false,

      id: null,
  //    uploadedImages: [],
  //    editorState: EditorState.createEmpty(),
        timeout: null,
    }

    this.onEditorChange.bind( this );
    this.appendImage.bind(this);
  /*  this.uploadCallback.bind(this);
    this.onEditorStateChange.bind(this)*/
    this.startTimeout.bind(this);

    this.findName.bind(this);
    this.addTag.bind(this);
    this.removeTag.bind(this);
    this.toggleDropDown.bind(this);
    this.toggleModal.bind(this);
    this.submit.bind(this);
    this.fetchData.bind(this);
    this.fetchData();
  }

  fetchData(){
    rebase.get('/tags', {
      context: this,
      withIds: true,
    }).then((tags) =>
        this.setState({
          tags,
          id: Date.now(),
        }));
  }

  submit(){
    console.log(this.state.id);
    this.setState({saving:true});
    if (!this.state.inDatabase){
      rebase.addToCollection('notes', {name:this.state.name, tags: this.state.chosenTags, body:this.state.body}, `${this.state.id}`)
      .then(() => {
        this.setState({
          saving:false,
          timeout: null,
        });
      });
    } else {
      rebase.updateDoc(`/notes/${this.state.id}`, {name:this.state.name, tags: this.state.chosenTags, body:this.state.body})
      .then(() => {
        this.setState({
          saving:false,
          timeout: null,
        });
      });
    }
  }

  remove(){
    if (window.confirm("Chcete zmazať túto poznámku?")) {
      rebase.removeDoc('/notes/'+this.state.id)
      .then(() => {
        this.setState({
          name: "",
          body: "",
          chosenTags: [],

          inDatabase: false,

          id: null,
          timeout: null,
        });
      });
    }
  }

  changeName(e){
     this.setState({
       name: e.target.value,
     });

     this.startTimeout();
  }

  addTag(id){
    this.setState({
      chosenTags: [...this.state.chosenTags, id],
    })
    this.startTimeout();
  }

  removeTag(id){
    this.setState({
      chosenTags: this.state.chosenTags.filter(tagId => tagId !== id),
    })
    this.startTimeout();
  }

  toggleDropDown() {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen
      });
  }

  toggleModal() {
      this.setState({
        modalOpen: !this.state.modalOpen
      });
  }

  findName(id){
    return this.state.tags.filter(tag => tag.id === id)[0].name;
  }

  onEditorChange( evt ) {
    this.setState( {
      body: evt.editor.getData()
    } );
    this.startTimeout();
  }

  appendImage(image){
    this.setState({
      body : this.state.body.concat(image),
      modalOpen : false
    });
    this.startTimeout();
  }

  startTimeout(){
    if (this.state.timeout === null){
      this.setState({
        timeout: setTimeout(this.submit.bind(this), 250),
      })
    }
  }

  render(){
/*    const config={
          image: { uploadCallback: this.uploadCallback.bind(this) }
        }*/

    return (
      <div>
        <FormGroup>
          <InputGroup>
            <Input
              id="name"
              placeholder="Názov"
              value={this.state.name}
              onChange={(e) => this.changeName(e)}
            />

            <InputGroupAddon addonType="append" onClick={this.remove.bind(this)}>
                  <InputGroupText>
                    <FontAwesomeIcon icon="trash" />
                  </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>

          <ButtonGroup>
            {
              this.state.chosenTags
              .map(id => {
                return(
                  <Button key={id}>
                    {this.findName(id)} <FontAwesomeIcon icon="minus-square" onClick={() => this.removeTag(id)}/>
                  </Button>
                );
              })
            }

            {  (this.state.tags.length !== this.state.chosenTags.length)
              &&
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown.bind(this)}>
                    <DropdownToggle caret color="success">
                      Add tag
                    </DropdownToggle>
                    <DropdownMenu>
                      {
                        this.state.tags.map(
                          tag => {
                            if (!this.state.chosenTags.includes(tag.id)){
                                return (
                                <DropdownItem
                                  key={tag.id}
                                  onClick={() => {this.addTag(tag.id)}}>
                                   {tag.name}
                                </DropdownItem>
                              );
                            }
                          }
                        )
                      }
                    </DropdownMenu>
              </ButtonDropdown>
            }
            </ButtonGroup>

          <FormGroup>
              <Button outline color="secondary" size="sm" onClick={this.toggleModal.bind(this)}>Pridať obrázok z uložiska</Button>
              <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal.bind(this)} >
                <ModalHeader toggle={this.toggleModal.bind(this)}>Nahrať obrázok</ModalHeader>
                <ModalBody>
                  <PictureUpload appendImage={this.appendImage.bind(this)}/>
                </ModalBody>
                <ModalFooter>
                  <Button outline color="secondary" size="sm" onClick={this.toggleModal.bind(this)}>Close</Button>{' '}
                </ModalFooter>
              </Modal>
              <CKEditor
                data={this.state.body}
                onChange={this.onEditorChange.bind(this)}
                config={ {
                    height: [ '75vh' ]
                } }
                />
            </FormGroup>

    {/*        <div className="container-fluid">
              <Editor
                toolbar={ config }
                editorState={this.state.editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(e) => this.onEditorStateChange(e)}

                   />
            </div>

          <Button disabled={this.state.saving} color="success" onClick={this.submit.bind(this)} >{!this.state.saving ? "Add":"Adding..."}</Button>

          */}
      </div>
    );
  }



//for drag and drop draft js

/*onEditorStateChange(value){
  this.setState({editorState: value});
//  console.log(stateToHTML(this.state.editorState.getCurrentContent()));
}

uploadCallback(file) {
  let uploadedImages = this.state.uploadedImages;

  const imageObject = {
       file: file,
       localSrc: URL.createObjectURL(file),
     }

 uploadedImages.push(imageObject);

 this.setState({uploadedImages: uploadedImages});

 return new Promise(
   (resolve, reject) => {
     resolve({ data: { link: imageObject.localSrc } });
   }
 );
}*/

}
