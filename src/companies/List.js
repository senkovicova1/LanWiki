import React, { Component } from 'react';
import { Progress, Table, InputGroup, InputGroupAddon, InputGroupText, Input, Button, Row, Col, Container, ModalHeader, ModalBody, ModalFooter, Modal  } from 'reactstrap';
import { rebase } from '../index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Add from './Add';
import Edit from './Edit';

import store from "../redux/Store";

export default class TagList extends Component{

  constructor(props){
    super(props);
    this.state = {
      value: 0,

      searchedWord: "",
      items: [],
      itemToEdit: {
        item: {},
        itemId: "",
      },

      isOpenAdd: false,
      isOpenEdit: false,
    };

    this.handleOpenEdit.bind(this);
    this.removeItem.bind(this);
    this.toggle.bind(this);
  }

  componentWillMount(){
    this.ref = rebase.listenToCollection('/cmdb/cmdb/companies', {
      context: this,
      withIds: true,
      then: items=>{
        this.setState({
          items,
          value: 100,
        })
      },
    });
  }


  removeItem(id){
    rebase.removeDoc('/cmdb/cmdb/companies/'+id);
  }


  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

    handleOpenEdit(item){
      let newItemToEdit = {
        item: {name: item.name, active: item.active},
        itemId: item.id,
      }
      this.setState({
        isOpenEdit: true,
        itemToEdit: newItemToEdit,
      });

    }

  render(){
    return (
      <div className="app">
            <Progress value={this.state.value}>{this.state.value === 100 ? "Loaded" : "Loading"}</Progress>

              <Container>
                     <Row>
                       <Col>
                         <InputGroup>
                           <InputGroupAddon addonType="prepend">
                             <InputGroupText>
                               <FontAwesomeIcon icon="search" />
                             </InputGroupText>
                           </InputGroupAddon>

                           <Input placeholder="Search" value={this.state.searchedWord} onChange={(e) => this.setState({searchedWord: e.target.value})}/>
                         </InputGroup>
                       </Col>
                       <Col>
                         <Button color="success" onClick={() => this.setState({isOpenAdd: true})}>Add company</Button>
                       </Col>
                     </Row>
              </Container>

             <Modal isOpen={this.state.isOpenAdd} className='addTag' >
               <ModalHeader>+ company</ModalHeader>
               <ModalBody>
                 <Add closeModal={() => this.setState({isOpenAdd: false})}/>
                </ModalBody>
             </Modal>


             <Modal isOpen={this.state.isOpenEdit} className='editTag' >
               <ModalHeader>Edit company</ModalHeader>
               <ModalBody>
                 <Edit itemId={this.state.itemToEdit.itemId} item={this.state.itemToEdit.item} closeModal={() => this.setState({isOpenEdit: false})}/>
               </ModalBody>
             </Modal>


              <Table>
                 <thead>
                   <tr>
                     <th>Company name</th>
                     <th>Active</th>
                   </tr>
                 </thead>
                 <tbody>
                   {

                       this.state.items
                       .filter(item => item.name.toLowerCase().includes(this.state.searchedWord.toLowerCase()))
                       .map(item =>
                       (
                         <tr key={item.id}>
                           <td onClick={() => this.handleOpenEdit(item)}>{item.name}</td>
                           <td onClick={() => this.handleOpenEdit(item)}>{(item.active ? "True" : "False")}</td>
                           <td><FontAwesomeIcon icon="trash" onClick={() => this.removeItem(item.id)}/></td>
                         </tr>
                        )
                       )
                   }
                 </tbody>
               </Table>

      </div>
    );
  }
}
