import React, { Component } from 'react';
import { Progress, Table, InputGroup, InputGroupAddon, InputGroupText, Input, Button, Row, Col, Container  } from 'reactstrap';
import { rebase } from './index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import store from "./redux/Store";

export default class ListNotes extends Component{

  constructor(props){
    super(props);

    this.state = {
      value: 0,

      searchedWord: "",
      items: [],
      newItem: "",

      pointless: 42,
    };

    this.niceDate.bind(this);
    this.addItem.bind(this);
    this.removeItem.bind(this);
    this.changeName.bind(this);
    this.toggle.bind(this);
    this.fetch.bind(this);
    this.fetch();
  }

  fetch(){
    rebase.get('/cmdb/cmdb/statuses', {
      context: this,
      withIds: true,
    }).then((statuses) => {
      rebase.get('/cmdb/cmdb/companies', {
        context: this,
        withIds: true,
      }).then((companies) => {
          this.setState({
            statuses,
            companies,
            value: 100,
          });
        });
    });
  }

  componentWillMount(){
    const unsub = store.subscribe(this.handleChange.bind(this));

    this.ref = rebase.listenToCollection('/cmdb/items/servers', {
      context: this,
      withIds: true,
      then: servers=>{
        rebase.get('/cmdb/cmdb/statuses', {
          context: this,
          withIds: true,
        }).then((statuses) => {
          rebase.get('/cmdb/cmdb/companies', {
            context: this,
            withIds: true,
          }).then((companies) => {
              this.setState({
                statuses,
                companies,
                items: servers.map(srv => ({id: srv.id, ip: srv.ip, name: srv.name, company: this.state.companies.filter(cmp => cmp.id === srv.companyId)[0].name, status: this.state.statuses.filter(st => st.id === srv.statusId)[0].name})),
                unsubscribe: unsub,
                value: 100});
            });
        });
      },
    });
  }

  addItem(){
    let dateCreated = Date().toLocaleString();
    rebase.addToCollection('items',
    {
      name: this.state.newItem,
      dateCreated: dateCreated,
    }).then((data) =>
      this.setState({
        newItem: "",
      })
    )
  }

  removeItem(id){
    rebase.removeDoc('/cmdb/items/servers/'+id);
  }

  changeName(id, name){
    rebase.updateDoc('/cmdb/items/servers/'+id,
    {name: name});

  }

  niceDate(uglyDate){
    if (uglyDate){
      let arr = uglyDate.split(" ");
      let niceDate = arr[2] + " " + arr[1] + " " + arr[3] + "  " + arr[4];
      return niceDate;
    } else {
      return "no date";
    }
  }

  handleChange(){
    this.setState({
      pointless: 43,
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
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
                         <Button color="success" onClick={() => this.props.history.push(`/cmdb/server-add`)}>Add server</Button>
                       </Col>
                     </Row>
              </Container>



              <Table>
                 <thead>
                   <tr>
                     <th>Server name</th>
                     <th>Company</th>
                     <th>IP</th>
                     <th>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {

                       this.state.items
                       .filter(item => item.name.toLowerCase().includes(this.state.searchedWord.toLowerCase()))
                       .map(item =>
                       (
                         <tr key={item.id}>
                           <td onClick={() => this.props.history.push(`/cmdb/server-${item.id}`)}>{item.name}</td>
                           <td onClick={() => this.props.history.push(`/cmdb/server-${item.id}`)}>{item.company}</td>
                           <td onClick={() => this.props.history.push(`/cmdb/server-${item.id}`)}>{item.ip}</td>
                           <td onClick={() => this.props.history.push(`/cmdb/server-${item.id}`)}>{item.status}</td>
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
