const express = require('express')
const router = express.Router();
const mydb = require('../index')

//Create new member
router.post('/createMember',async(req,res)=>{
    const {_id,name,position} = req.body
    try
    {   
        console.log()
        const Member = await mydb.insert({_id,name,position})
        res.json(Member)
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Duplicate document or document id is empty!"})
    }
})

//Get all member
router.get('/getall',async(req,res)=>{
    try
    {
        const Members = await mydb.list({include_docs: true})
        const memberList= []
        Members.rows.forEach((rows) => {
            memberList.push(rows.doc)
          })
        res.json(memberList)
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Interal Error!"})
    }
})
//Delete Member
router.delete('/delete/:id',async(req,res)=>{
    const id = req.params.id
    try
    {
        const member = await mydb.get(id)
        console.log(member)
        await mydb.destroy(member._id,member._rev)
        res.json({success:true,message:"Delete successfully!"})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).json({success:false,message:"Can not find the member to delete"})
    }
})
module.exports= router