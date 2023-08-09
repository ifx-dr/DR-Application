const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const jwt = require('jsonwebtoken');
const router=express.Router();

//Access user info in YAML file
const userDataPath = 'ledger_DR.yaml';
const userData = fs.readFileSync(userDataPath, 'utf8');
const usersData = yaml.load(userData);
const usersInfoData=usersData['UserInfo'];
const onGoingDRData=usersData['OngoingProposalInfo'];
console.log("ongoingdr= "+onGoingDRData);

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
router.get("/OngoingDR", async(req,res)=>{
    console.log("in ongoingDR");
    let result;
    try{
        let ongoingDR= onGoingDRData;
        console.log(ongoingDR);
        result = {"success":JSON.parse(ongoingDR)};
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

module.exports=router;