import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, ListGroup, ListGroupItem, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
      tags: [],
      chosenTags: [],
      body: "",
      uploadedImages: [],
  //    editorState: EditorState.createEmpty(),
      data: '<p>This is CKEditor 4 instance created by ️⚛️ React.</p>'
    }

    this.handleChange.bind( this );
    this.onEditorChange.bind( this );
    this.appendImage.bind(this);
  /*  this.uploadCallback.bind(this);
    this.onEditorStateChange.bind(this)*/

    this.findName.bind(this);
    this.addTag.bind(this);
    this.removeTag.bind(this);
    this.toggleDropDown.bind(this);
    this.toggleModal.bind(this);
    this.fetchData.bind(this);
    this.fetchData();
  }

  fetchData(){
    rebase.get('/tags', {
      context: this,
      withIds: true,
    }).then((tags) =>
        this.setState({tags}));
  }

  submit(){
    this.setState({saving:true});
    rebase.addToCollection('/notes', {name:this.state.name, tags: this.state.chosenTags, body:this.state.body})
    .then(() => {
      this.setState({
        saving:false,
        name: "",
        body: "",
        chosenTags: [],
      });
    });
  }

  addTag(id){
    this.setState({
      chosenTags: [...this.state.chosenTags, id],
    })
  }

  removeTag(id){
    this.setState({
      chosenTags: this.state.chosenTags.filter(tagId => tagId !== id),
    })
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
    console.log(evt);
    this.setState( {
      data: evt.editor.getData()
    } );
  }

  handleChange( changeEvent ) {
    this.setState( {
      data: changeEvent.target.value
    } );
  }

  appendImage(image){
    this.setState({
      data : this.state.data.concat(image),
      modalOpen : false
    });
  }

  render(){
/*    const config={
          image: { uploadCallback: this.uploadCallback.bind(this) }
        }*/

    return (
      <div>
          <FormGroup>
            <Label htmlFor="name">Názov</Label>
            <Input id="name" placeholder="Názov" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
          </FormGroup>

          <FormGroup>
              <Label htmlFor="tag">Tags</Label>
              <ListGroup id="tag">
            {
              this.state.chosenTags
              .map(id => {
                console.log(id);
                return(
                  <ListGroupItem key={id}>
                    {this.findName(id)} <FontAwesomeIcon icon="minus-square" onClick={() => this.removeTag(id)}/>
                  </ListGroupItem>
                );
              })

            }
            </ListGroup>
          </FormGroup>

          {(this.state.tags.length !== this.state.chosenTags.length)
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

          <FormGroup>
              <Button outline color="secondary" size="sm" onClick={this.toggleModal.bind(this)}>Pridať obrázok z uložiska</Button>
              <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal.bind(this)} >
                <ModalHeader toggle={this.toggleModal.bind(this)}>Nahrať obrázok</ModalHeader>
                <ModalBody>
                  <PictureUpload appendImage={this.appendImage.bind(this)}/>
                </ModalBody>
                <ModalFooter>
                  <Button outline color="secondary" size="sm" onClick={this.toggleModal.bind(this)}>Cancel</Button>{' '}
                </ModalFooter>
              </Modal>
              <CKEditor
                data={this.state.data}
                onChange={this.onEditorChange.bind(this)}
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

          <FormGroup>
            <Label htmlFor="body">Text</Label>
            <Input type="textarea" id="body" placeholder="Zadajte text" value={convertToRaw(this.state.editorState.getCurrentContent())} onChange={(e) => this.setState({body: e.target.value})}/>
          </FormGroup>
          */}

          <Button disabled={this.state.saving} color="success" onClick={this.submit.bind(this)} >{!this.state.saving ? "Add":"Adding..."}</Button>
      </div>
    );
  }



//for drag and drop draft js

onEditorStateChange(value){
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
  }

}
