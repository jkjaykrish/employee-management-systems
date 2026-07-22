const {applyLeave}=require('../services/leave.service')

const leaveController=async (req,res)=>{
    try{
       
const createLeave=await applyLeave(req.body,req.user)
if(createLeave.success==false)
{
return res.status(200).json({success:false,message:createLeave.message})
}
return res.status(200).json({success:true,message:"Applied Leave Successfully",resultData:createLeave})

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

module.exports={
    leaveController
}