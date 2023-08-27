import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Grid, Heading, Popover, PopoverCloseButton, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react'
import "../Css/Contact.css"
import { Link } from 'react-router-dom'
import axios from 'axios'
import {v4} from "uuid"
import { useDispatch, useSelector } from 'react-redux'
import { addContact } from '../Redux/Add_Contacts/addContacts.action.js'

const getData=async()=>{
    return await axios.get("https://taiyo-ai-server.onrender.com/contacts")
}


const Contacts = () => {
    const [flag,setFlag]=useState(false)
    const [contacts,setContacts]=useState([{name:String,lastName:String,status:String}])
    const [edit,setEdit]=useState({name:"",lastName:"",status:""})
    const [data,setData]=useState([])
    const dispatch=useDispatch()
    const [view,setView]=useState(false)


const handleChange=(e)=>{
        const {name,value}=e.target;
      
          setContacts({...contacts,[name]:value});
    }


const handleSubmit=(e)=>{
        e.preventDefault()
        if(contacts.name && contacts.lastName && contacts.status){
            dispatch(addContact({
                id:v4(),
                ...contacts
            }))
        }else{
          alert("please fill all creadentials")
        }
        setContacts({})
    }


const handleChangeEdit=(e)=>{
    const {name,value}=e.target;
  
      setEdit({...edit,[name]:value});

}
const handleSubmitEdit=(e,id)=>{
    e.preventDefault();    
    try{
      axios.put(`https://taiyo-ai-server.onrender.com/contacts/${id}`,{name:edit.name,lastName:edit.lastName,status:edit.status}).then(()=>alert("Contact Edit Successfully")).then(()=>getData().then((res)=>setContacts(res.data)))
    }
    catch(err){
      console.log(err)
    }       
}
const deleteContact=(id)=>{
    axios.delete(`https://taiyo-ai-server.onrender.com/contacts/${id}`).then((res)=>alert("Contact Delete Successfully")).then(()=>getData().then((res)=>setContacts(res.data)))
}
useEffect(()=>{
        getData().then((res)=>setData(res.data))
    },[handleSubmit])

const onOpen=()=>{
    setFlag(true)
}

const onClose=()=>{
    setFlag(false)
}

const viewContact=()=>{
    setView(!view)
}

  return (
    <div id="contact_page">
        <Heading color={'white'} p={"10px 20px"} bg={"#28686e"}>Contact Page</Heading>
        <div id="contact_page_div">
            {window.innerWidth>900?<Box padding={"10px"} w={"19%"} bg={"rgb(251 146 60)"} boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}>
               <Box><Link style={{textDecoration:"none", color:"black",fontSize:"20px",fontWeight:"bold"}} to="/">Contacts</Link></Box>
               <br />
               <br />
               <Box><Link style={{textDecoration:"none", color:"black",fontSize:"20px",fontWeight:"bold"}} to="/chartsandmaps">Charts & Maps</Link></Box>
            </Box>:<Flex justifyContent={"space-evenly"} w={"100%"} margin={'auto'} marginBottom={"20px"} p={"10px 0px"}  boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}>
               <Box><Link  style={{textDecoration:"none",fontSize:"20px",fontWeight:"bold"}} to="/">Contacts</Link></Box>
               <Box><Link  style={{textDecoration:"none",fontSize:"20px",fontWeight:"bold"}} to="/chartsandmaps">Charts & Maps</Link></Box>
            </Flex>}
            <Box  padding={"30px"} margin={'auto'}  w={"79%"} boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"} bg={"rgb(244 114 182)"} border={"rounded-s-10xl"}>
               {flag?<></>:<Button marginTop={"20px"} hover={"bg-cyan-500"} onClick={onOpen}>Create Contact</Button>}
               <Box>
                {
                    flag?
                    <form onSubmit={handleSubmit} id="form">
                    <Heading onClick={onClose}>X</Heading>
                    <label >First Name:</label>
                    <input type="text" id="name" name="name" onChange={handleChange} />
                    <br />
                    <br />
                    <label>Last Name:</label>
                    <input type="text" id="lastName" name="lastName" onChange={handleChange}/>
                    <br />
                    <br />
                    <label>Status:</label>
                    <input type="checkbox" id="status" name="status" value="active" onChange={handleChange}/>
                    <label>Active</label>
                    <input type="checkbox" id="status" name="status" value="inactive" onChange={handleChange}/>
                    <label>Inactive</label>
                    <br />
                    <br />
                    <input type="submit" value="Save Contact"/>
                    </form>:<></>
                }
               </Box>
               {data.length<1?
                    <Box id="empty" margin={"auto"}  marginTop={"4%"} width={"50%"} border={"1px solid gray"}>
                        <Heading>No Contact Found Please add contact from Create Contact Button</Heading>
                    </Box>:
                    <Box marginTop={"4%"}>
                        <div id="data_container">
                            {data.map((el)=>(
                              <div key={el.id}>
                                <Text fontWeight={"bold"}>{el.name} {el.lastName}</Text>
                                <Popover >
                                   <PopoverTrigger  >
                                    <button onClick={viewContact}   style={{backgroundColor:"cyan"}}>View</button>
                                   </PopoverTrigger>
                                   <PopoverContent backgroundColor={'cyan'} padding={'20px'} color='white' margin={'auto'}  >
                                     <PopoverCloseButton backgroundColor={'#bbc1c6'}><Button backgroundColor={"black"} color={'white'}>x</Button></PopoverCloseButton>
                                     <Text color={"black"}>name- {el.name}</Text>
                                     <Text color={"black"}>lastname- {el.lastName}</Text>
                                     <Text color={"black"}>status- {el.status}</Text>
                                   </PopoverContent>
                                </Popover>
                                <Popover >
                               <PopoverTrigger  >
                                 <button  style={{ color:"white",backgroundColor:"#194d33"}}>Edit</button>
                               </PopoverTrigger>
                               <PopoverContent backgroundColor={'#194d33'} padding={'10px'} color='white' margin={'auto'}   >
                                   <PopoverCloseButton backgroundColor={'#194d33'}><Button backgroundColor={"black"} color={'white'}>x</Button></PopoverCloseButton>
                                        <label >Name:</label>
                                          <input type="text" id="name" name="name" onChange={handleChangeEdit} />
                                            <br />
                                        
                                        <label>Last Name:</label>
                                          <input type="text" id="lastName" name="lastName" onChange={handleChangeEdit}/>
                                             
                                            
                                        <label>Status:</label><input type="checkbox" id="status" name="status" value="active" onChange={handleChangeEdit}/>
                                        <label>Active</label>
                                           <input type="checkbox" id="status" name="status" value="inactive" onChange={handleChangeEdit}/>
                                        <label>Inactive</label>
                                          <br />
                                    
                                          <button
                                            onClick={(e)=>handleSubmitEdit(e,el.id)}
                                            >Submit</button>
                                </PopoverContent>
                            </Popover>
                            <button onClick={()=>deleteContact(el.id)} style={{ color:"white",backgroundColor:"red"}}>Delete</button>
                              </div>
                            ))} 
                        </div>
                    </Box>
                }
            </Box>
        </div>
    </div>
  )
}

export default Contacts