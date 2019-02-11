import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, ListGroup, ListGroupItem, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rebase } from './index';

import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      saving: false,
      dropdownOpen: false,
      name: "",
      tags: [],
      chosenTags: [],
      body: "",
      uploadedImages: [],
      editorState: EditorState.createEmpty(),
    }

    this.uploadCallback.bind(this);
    this.onEditorStateChange.bind(this)
    this.findName.bind(this);
    this.addTag.bind(this);
    this.removeTag.bind(this);
    this.toggle.bind(this);
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

  toggle() {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen
      });
  }

  findName(id){
    return this.state.tags.filter(tag => tag.id === id)[0].name;
  }

  onEditorStateChange(value){
    this.setState({editorState: value});
    console.log(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  render(){
    const config={
          image: { uploadCallback: this.uploadCallback.bind(this) }
        }

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
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle.bind(this)}>
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

            <div className="container-fluid">
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

          <Button disabled={this.state.saving} color="success" onClick={this.submit.bind(this)} >{!this.state.saving ? "Add":"Adding..."}</Button>
      </div>
    );
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
  /*    return new Promise(
        (resolve, reject) => {
          var reader=new FileReader();

          reader.onloadend = function() {
            Meteor.call('fileStorage.uploadFile',reader.result,file.name,file.type,(err,response)=>{
                console.log(response)
               if(err){
                 reject(err)
               }

               resolve({ data: { link: response.data.url } });
            })
          }

          reader.readAsDataURL(file);
        }
      );*/
    }

}
