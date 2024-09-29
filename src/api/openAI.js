import axios from 'axios'

const {apiKey}=require('../constants')
const client =axios.create({
    headers:{
        "Authorization": "Bearer "+apiKey,
        "content-Type": "application/json" 
       
    }
})
const chatGptEndpoint="https://api.openai.com/v1/chat/completions"
const dalleEndpoints="https://api.openai.com/v1/images/generations"

export const apiCall=async(prompt, mesages)=>{
    try{
        const res =await client.post(chatGptEndpoint,{
            model: "gpt-3.5-turbo",
            message:[{
                role:'user',
                content:`Does this message want to generate an AI picture, image, art or anything similar? ${prompt}. Simply answer with yes or no`
            }]

        })
        console.log("results",res.data)
        
    }catch(err){
        console.log("samm",err)
        return Promise.resolve({success: false,msg:err.message})
    }
}