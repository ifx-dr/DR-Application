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



//retrieve the total member number 
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

//handle get request to display the URI of the ongoing proposal
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
router.get('/tokens',async(req,res)=>{
    let result;
    //console.log(req.headers.authorization);
    const token=req.headers.authorization.split(' ')[1];
    try{
        const decoded=jwt.verify(token,'secretKey');
        //console.log("ide= "+decoded.data.ID);
        const user=usersInfoData.find(user=> user.ID==decoded.data.ID);
        console.log(user);
        let countToken=user.Tokens;
        console.log("count tokens: "+countToken);
        result = {"success":JSON.parse(countToken)};
    }catch(error){
        result = {"error":error.toString()};
    }

    res.json(result);
});

//retrieve information about the ontology repository
router.get("/Repo", async (req, res) => {
    let result = {"success":{
        Platform: ontologyInfo['Platform'],
        RepoName: ontologyInfo['Repo'],
        DefaultBranch: ontologyInfo['Default'],
        AccessToken: ontologyInfo['AccessToken']
    }};
    res.json(result);
});

router.get("/DR", async (req, res) => {
    //Get the URI of the latest  DR
    let result;
    try {	
        //let res = await contract.evaluateTransaction('CheckLatestDR');
        //TO DO: retrieve latest DR from db
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
        //let res = await contract.evaluateTransaction('CheckDRHash');
        result = {"success":latestDRHash};
    } catch (error) {
        result = {"error":error.toString()};
    }

    res.json(result);
});

module.exports=router;