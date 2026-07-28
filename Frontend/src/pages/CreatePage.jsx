import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeftIcon } from 'lucide-react'

import api from '../lib/axios'
import toast from 'react-hot-toast'
const CreatePage = () => {
  const [title ,setTitle] = useState("") 
  const [content ,setContent] = useState("")
  const [Loading ,setLoading] = useState(false)
  const Navigate = useNavigate()
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!title.trim() || !content.trim()){
      toast.error("All fields are required")
      return 
    }
    setLoading(true)
    try{
      await api.post("/notes",{
        title,
        content
      })
      toast.success("Note created succesfully ")
      Navigate("/")
    }catch(error){
      console.log("Error has been occured ",error)
      if(error.response.status === 429){
        toast.error("Slow down! Too many request",{
          duration:4000,  
        })
      }else{
      toast.error(`Failed to create Note ${error}`,)
      }
     
    }finally{
      setLoading(False)
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className='container mx-auto px-4 py-8'>
        <div className="max-w-2xl mx-auto">
           <Link to={"/"} className='btn btn-ghost mb-6'>
           <ArrowLeftIcon className='size-5'/>
           Back to Notes
           </Link>

           <div className="card bg-base-100">
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4'>Create a Note</h2>
              <form onSubmit={handleSubmit}>

                <div className='form-control mb-4'>
                  <label className="label">
                    <span className='label-text'>Title</span>
                  </label>
                  <input type="text"
                  className='input input-bordered'
                  placeholder='Enter the Note title'
                  value={title}
                  onChange={(e)=>{
                    setTitle(e.target.value)
                  }}
                  />
                </div>


                <div className='form-control mb-4'>
                  <label className="label">
                    <span className='label-text'>Content</span>
                  </label>
                  <input type="text"
                  className='input input-bordered'
                  placeholder='Enter the Note content'
                  value={content}
                  onChange={(e)=>{
                    setContent(e.target.value)
                  }}
                  />
                </div>

                <div className="card-actions justify-end">
                  <button className='btn btn-primary' type='submit' disabled = {Loading}>
                    {Loading ? "Creating":"Create Note"}
                  </button>
                </div>
              </form>
            </div>
           </div>
        </div>

      </div>
    </div>
  )
}

export default CreatePage