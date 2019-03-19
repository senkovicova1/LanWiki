import React, { Component } from 'react';
import { Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, ButtonDropdown, ButtonGroup, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { rebase } from './index';

import CKEditor from 'ckeditor4-react';

import PictureUpload from './PictureUpload';

import store from "./redux/Store";

export default class Note extends Component{

  constructor(props){
    super(props);

    this.state = {
      saving: false,
      loading: true,
      dropdownOpen: false,
      modalOpen: false,
      name: "",
      body: "",
      tags: [],
      chosenTags: [],

      timeout: null,
    }

    this.onEditorChange.bind(this);
    this.appendImage.bind(this);

    this.startTimeout.bind(this);

    this.changeName.bind(this);
    this.findName.bind(this);
    this.addTag.bind(this);
    this.removeTag.bind(this);
    this.toggleDropDown.bind(this);
    this.toggleModal.bind(this);
    this.submit.bind(this);
    this.fetchData.bind(this);
    this.fetchData(this.props.match.params.noteID);
  }

  fetchData(id){
    rebase.get('notes/' + id, {
      context: this,
    }).then((note) =>
        {
          rebase.get('/tags', {
            context: this,
            withIds: true,
          }).then((tags) => this.setState({name: note.name, body: note.body, chosenTags: note.tags, tags, loading:false})  );
        })

  }

  componentWillReceiveProps(props){
    if(this.props.match.params.noteID!==props.match.params.noteID){
      this.setState({loading:true});
      this.fetchData(props.match.params.noteID);
    }
  }

  submit(){
    this.setState({saving:true});
    rebase.updateDoc('/notes/'+this.props.match.params.noteID, {name:this.state.name, body:this.state.body, tags: this.state.chosenTags})
    .then(() => {
      this.setState({
        saving:false,
        timeout: null,
      });
    });
  }

  remove(){
    if (window.confirm("Chcete zmazať túto poznámku?")) {
      rebase.removeDoc('/notes/'+this.props.match.params.noteID)
      .then(() => {
        this.props.history.goBack();
      });
    }
  }

  changeName(e){
      console.log(this.state);
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
        dropdownOpen: !this.state.dropdownOpen,
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

  /*
  ak user (prihlaseny alebo public) nema opravnenie write na ani jeden z tagov, tak sa mu vypise iba ciste
  */
  render(){

    const CAN_WRITE = this.state.tags.length > 0 && this.state.tags.filter(tag => this.state.chosenTags.includes(tag.id) && tag.write.includes(store.getState().user.id)).length > 0;
    if (!CAN_WRITE) {
      return (
        <div >
            <h1>{this.state.name}</h1>

                  <ButtonGroup>
                    {
                      this.state.chosenTags
                      .map(id => {
                        return(
                          <Button key={id}>
                            {this.findName(id)}
                          </Button>
                        );
                      })
                    }
                  </ButtonGroup>

                  <div dangerouslySetInnerHTML={{ __html: this.state.body }} />

                </div>
      );
    }
    return (
      <div >
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

          <FormGroup>
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
                                  } else {
                                    return null;
                                  }
                                }
                              )
                            }
                          </DropdownMenu>
                    </ButtonDropdown>
                  }
                  </ButtonGroup>
            </FormGroup>

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
</div>
    );
  }
}
