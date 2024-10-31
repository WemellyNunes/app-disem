import React from 'react';
import AppRoutes from "./routers";
import { UserProvider } from './contexts/user';


function App() {
  return (
    <>
    <UserProvider>
       <AppRoutes />
    </UserProvider>

      
    </>
  )
}

export default App
