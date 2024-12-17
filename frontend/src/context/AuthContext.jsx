import { createContext, useState, useEffect, useContext } from 'react'
import { jwtDecode } from "jwt-decode";
import {useNavigate} from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {

  let [loading, setLoading] = useState(true)

  let [authTokens, setAuthToken] = useState( ()=>
    localStorage.getItem("authTokens") ?
   JSON.parse(localStorage.getItem("authTokens")) : null
  )

  let [user, setUser] = useState( ()=>
    localStorage.getItem("authTokens") ?
    jwtDecode(localStorage.getItem("authTokens")) : null)
  
  useEffect(()=>{
    if(loading){
      updateToken()
    }
    let fourMinute = 1000 * 60 * 4
    let interval = setInterval(()=>{
      if(authTokens){
        updateToken()
      }
    },fourMinute)
    return ()=>clearInterval(interval)
    },[
      authTokens, loading
    ]
  )

  const history = useNavigate()
  let loginUser = async (e) =>{
    e.preventDefault()
    let response = await fetch('http://127.0.0.1:8000/api/token/',{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
    })
    let data = await response.json()
    if(response.status === 200){
      setAuthToken(data)
      setUser(jwtDecode(data.access))
      localStorage.setItem("authTokens", JSON.stringify(data))
      history('/')
    }else{
      alert('something went wrong!')
    }
  }

  let logoutUser = ()  =>{
    setAuthToken(null)
    setUser(null)
    localStorage.removeItem("authTokens")
    history('/login')
  }


  let updateToken = async (e) =>{

    let response = await fetch('http://127.0.0.1:8000/api/token/refresh/',{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({ 'refresh': authTokens?.refresh })
    })
    let data = await response.json()
    if(response.status === 200){
      setAuthToken(data)
      setUser(jwtDecode(data.access))
      localStorage.setItem("authTokens", JSON.stringify(data))
      
    }else{
      logoutUser()
    }
    if(loading){
      setLoading(false)
    }
  }
  let contextData = {
    user:user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser
  }
   return (
    <AuthContext.Provider value={contextData}>
        { loading ? null : children}
    </AuthContext.Provider>
  )
}

