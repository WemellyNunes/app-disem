import React from 'react';
import AppRoutes from "./routers";
import { UserProvider } from './contexts/user';
import { NotificationProvider } from './contexts/notification/NotificationContext';



function App() {
  return (
    <>
    <UserProvider>
      <NotificationProvider>
       <AppRoutes />
      </NotificationProvider>
    </UserProvider>

      
    </>
  )
}

export default App
