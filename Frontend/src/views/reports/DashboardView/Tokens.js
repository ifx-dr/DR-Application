import React, { Component } from 'react';
import { Avatar, Card, CardContent, Grid, Typography } from '@material-ui/core';
import AccountBalance from '@material-ui/icons/AccountBalance';

class Tokens extends Component {
  constructor(props) {
    super(props);
    this.state = { tokens: null };
  }

  componentDidMount() {
    console.log("in component did mount");
    this.getTokens();
  }

  getTokens = async () => {
    console.log("in token");
    const data = {
      id: 'visitor'
    }
    let token = 0;
    const jwt=require('jsonwebtoken');
    let session_token = sessionStorage.getItem('token');
    const secretKey='secretKey';
    console.log(session_token);
    
    //this may be useless
    if(session_token!==null){
      let decoded=jwt.verify(session_token,secretKey);
      console.log("decoded "+JSON.stringify(decoded));
      data.id = decoded.data.ID;
      
    }
    console.log("in token");
    console.log("session_token");
    
    // if(window.userID) {
    //   data.id = window.userID;
    // }
    // const data = await fetch('http://localhost:3001/tokens').then((response) => response.json());

    //display only if the user is connected
    if(session_token){
      console.log("before calling the tokens");
      try{
        await fetch('http://localhost:3001/tokens', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session_token}`,
          }
        }).then(function(response){
          return response.json();
        }).then(function(body){
          if(!body.error){
            token=body.success;
            console.log(body);
          }
          else{
            alert(body.error)
          }
        });
        console.log('RESULT= ' + token);
        this.setState({
          tokens: token
        });
        console.log('***********Succesfully invoke func '+this.state.tokens);
      }
      catch (error) {
        alert(error);
      }
    };
  }
    

  render() {

    return (
      <Card>
        <CardContent>
          <Grid
            container
            justify="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="h6"
              >
                Your Tokens:
              </Typography>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                {this.state.tokens}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar>
                <AccountBalance />
              </Avatar>
            </Grid>
          </Grid>

        </CardContent>
      </Card>
    );
  }
}
export default Tokens;
