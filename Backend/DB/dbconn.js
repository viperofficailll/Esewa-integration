import mongoose from "mongoose"
export const conn =  async ()=>{
    try {
         await mongoose.connect('mongodb://localhost:27017',{dbName:"Esewa"})
         console.log("connected ")
    } catch (error) {
        console.log(error)
        
    }
    
}