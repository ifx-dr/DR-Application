const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const jwt = require('jsonwebtoken');
const router=express.Router();

//Access information stored in YAML file
const userDataPath = 'ledger_DR.yaml';
const userData = fs.readFileSync(userDataPath, 'utf8');
const usersData = yaml.load(userData);
const usersInfoData=usersData['UserInfo'];
const onGoingDRData=usersData['OngoingProposalInfo'];
const ontologyInfo=usersData['OntologyInfo'];
const latestDRURI=usersData['LatestDR'];
const latestDRHash=usersData['FileHash'];
const newBlockRequest=usersData['NewBlockRequest'];
const historic=usersData['ClosedProposalInfo'];



/**
 * Retrieve the count of members registered in the voting app 
*/
router.get('/allMembers', async(req,res)=>{
    let result;
    try{
        let countMembers=usersInfoData.length;
        result = {"success":JSON.parse(countMembers)};
    } catch(error){
        result = {"error":error.toString()};
    }
    res.json(result);
});

/**
 * Retrieve the URI of the ongoing proposal commit.
*/
router.get("/OngoingDR", async(req,res)=>{
    let result;
    try{
        let ongoingDR= onGoingDRData[0];
        if(ongoingDR.length>0){
            result = {"success":ongoingDR.URI};
        }else{
            result=[];
        }
        
    }catch(error){
        result = {"error":error.toString()};
    }
    res.json(result);
});

/**
 * Retrieve the number of tokens of the user.
 * If the user has been identified, sends as a response the user's tokens
*/
router.get('/tokens',async(req,res)=>{
    let result;
    const token=req.headers.authorization.split(' ')[1]; //retrieve the token from the header
    try{
        const decoded=jwt.verify(token,'secretKey'); //decrypt the token to have its data
        const user=usersInfoData.find(user=> user.ID==decoded.data.ID); //find the user with the corresponding ID
        let countToken=user.Tokens;
        result = {"success":JSON.parse(countToken)};
    }catch(error){
        result = {"error":error.toString()};
    }

    res.json(result);
});

/**
 * Retrieve information about the ontology repository
 * The object response has the following properties: Platform, RepoName, DefaultBrach, AccessToken
 */
//utility ?
router.get("/Repo", async (req, res) => {
    let result = {"success":{
        Platform: ontologyInfo['Platform'],
        RepoName: ontologyInfo['Repo'],
        DefaultBranch: ontologyInfo['Default'],
        AccessToken: ontologyInfo['AccessToken']
    }};
    res.json(result);
});

/**
 * Retrieve the URI of the last update commit
*/
router.get("/DR", async (req, res) => {
    let result;
    try {	
        result = {"success":latestDRURI};
    } catch (error) {
        result = {"error":error.toString()};
    }
    console.log(result);
    res.json(result);
});

//Get the Hash value of the latest update
router.get("/DRHash", async (req, res) => {
    
    let result;
    try {
        result = {"success":latestDRHash};
    } catch (error) {
        result = {"error":error.toString()};
    }

    res.json(result);
});

/**
 * Check if there is a new block to be generated.
 * newBlockRequest has the following properties: newBlockWaiting:boolean, porposalId, author, lobeOwner, supervisor
*/
router.get("/checkNewBlockRequest", async (req, res) => {
    let result;
    try {
        result = {"success":newBlockRequest};
        
    } catch (error) {
        result = {"error":error.toString()};
    }

    res.json(result);
});

//retrives the information of the latest block
router.get("/checkLatestBlock", async (req, res) => {
    let result;
    try {
        const latestBlock=historic[historic.length-1];
        result = {"success":latestBlock}
    } catch (error) {
        result = {"error":error.toString()};
    }
    
    res.json(result);
});

module.exports=router;