import './App.css'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
import PrivateRoute from './utils/privateRoute'


function App() {
  return (
      <div className='App'>
        <BrowserRouter>
          <AuthProvider>
            <Header/>
            <Routes>
          <Route 
            path='/' 
            element={<PrivateRoute><HomePage/></PrivateRoute>}
            exact
          />
          <Route path='/login' element={<LoginPage/>} />
            </Routes>
        </AuthProvider>
        </BrowserRouter> 
      </div>

  )
}
export default App
