import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Card, CardHeader, Divider, CardContent, Input
} from '@material-ui/core';

class LoginViews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      Email: '',
      PWD: '',
      flag: false
    }
  }
  handleChangeN = async (event) => {
    let value = event.target.value;
    console.log("value= "+ value);
    this.setState({
      Email: value
    })
  }
  handleChangePWD = async (event) => {
    let value = event.target.value;
    this.setState({
      PWD: value
    })
  }
  async handleSubmit(event)  {
    event.preventDefault();
    let data = {
      useremail: this.state.Email,
      password: this.state.PWD,
    };
    console.log("data= "+JSON.stringify(data));
    console.log("get memberInfo: "+data.useremail);
    try{
      await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then((response)=>{
        return response.json();
      }).then((body)=>{
        console.log(body);
        if(!body.error){
          body = body.success;
          if(body.Fail){
            alert(body.Fail)
            return;
          }
          sessionStorage.setItem('token',body.token);
          alert(`
                  ID:   ${body.ID}\n
                  Name: ${body.Name}\n
                  login success`);
          this.setState({
            flag: true,
          })
        }
        else{
          alert(body.error);
        }
      })
    }
    catch(error){alert(error)}
  }
  updateEmployeeDetails = (event) => {
    this.setState({ data:{Id:event.target.value} });
  };
  render() {
    const EmployeeContext = React.createContext({
      data: '',
      changeEmployeeInfo: () => {},
    }); 
    if(this.state.flag){
      return <Navigate to='/app/dashboard' state={this.state}></Navigate>
    }
    return (
      <form onSubmit={this.handleSubmit.bind(this)} >
        <Card>
          <CardHeader
            subheader= {window.userID} //"This is a mock page for log in"
            title="Log in"
          />
          <Divider />
          <CardContent>
            <TextField
              fullWidth
              onChange={this.handleChangeN}
              label="User Email"
              margin="normal"
              name="Email"
              type="email"
              value={this.state.Email}
              variant="outlined"
            />
            <TextField
              fullWidth
              onChange={this.handleChangePWD}
              label="Password"
              margin="normal"
              name="PWD"
              type="PWD"
              value={this.state.PWD}
              variant="outlined"
            />
          </CardContent>
          <Divider />
          <Button variant="contained" color="primary">
            <Input style={{color: "white"}} type="submit" value="Submit"/>
          </Button>
          <EmployeeContext.Provider value={this.state}/>

        </Card>
      </form>)
  }
};
export default LoginViews;