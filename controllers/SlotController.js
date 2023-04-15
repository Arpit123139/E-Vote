const Slot=require('../models/Slot')
const BigPromise=require('../middleware/bigpromise');
const Booth=require('../models/boothManager')
const e = require('express');

exports.getSlot=(BigPromise(async(req,res)=>{

    const area=req.params.areaName;
    console.log("Area "+area);

   
    if(!area){
        return res.status(200).json({
            message:"Plz Provide The Area "
        })
    }
    const slot=await Slot.find({area});

    
    res.status(200).json({
        slot:slot[0]
    })
}))

exports.alotSlot=(BigPromise(async(req,res)=>{

    const {areaName,id,voterId}=req.params;
    console.log(req.params)

    const document=await Booth.findOne({voterId:voterId})
    console.log(document)
    if(!document){
        return res.status(401).json({
            success:"User Not Verified "
        })
    }

    const slot=await Slot.find({area:areaName})

    // console.log(slot[0]._id);
    const available=await slot[0].timeslot[id].availability
    // console.log("Slot Avalilable "+available)
    slot[0].timeslot[id].availability=available-1;

    // console.log( slot[0].timeslot[id])
    
    const arr=[]
    for(let i=0;i<20;i++){
        arr.push(slot[0].timeslot[i])
    }
    // console.log("Array "+arr)
    slot[0].timeslot=arr;
    const newData={
        area:areaName,
        timeslot:arr
    }
    await Slot.findByIdAndUpdate(slot[0]._id,newData)

    res.status(200).json({
        success:true
    })
    
}))