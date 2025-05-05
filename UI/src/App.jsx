import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Landing from './Components/Landing'
import Login from './Components/Login'
import ProfilePage from './Components/ProfilePage'

import { Particles } from './Components/magicui/particles'
import appStore from './Store/appStore'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatPage from './Components/ChatPage'
function App() {
 const appRouter = createBrowserRouter([
   {
     path: '/',
     element: <Login />
   },
   {
     path: '/login',
     element: <Login />
   },
   {
     path:'/chat',
     element:<ChatPage />
   },
   {
    path:'/profile',  
     element:<ProfilePage />
   }
 ])
 
  
  return (
  <>
    <Provider store={appStore}>
       <div className="appContainer">
        <Particles className='h-[100vh]' />
        <RouterProvider router={appRouter} />
        <ToastContainer />
      </div>
    </Provider>
  </>
  )
}

export default App
