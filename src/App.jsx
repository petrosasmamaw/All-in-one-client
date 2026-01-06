import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Navbar from './Components/Pages/navbar';
import Login from './Components/Pages/login';
import Register from './Components/Pages/register';
import Profile from './Components/Pages/profile';
import Shop from './Components/Pages/shop';
import ShopDetail from './Components/Pages/shopDetail';
import Chat from './Components/Pages/chat';
import MyChats from './Components/Pages/mychats';
import ClientFooter from './Components/Pages/clientFooter';


import { fetchSession } from './Components/Slice/authSlice';

const AppWrapper = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // fetch session on mount; only auto-navigate if user is on an auth route or root
    (async () => {
      const res = await dispatch(fetchSession());
      const isAuthRoute = ['/','/login','/register'].includes(location.pathname);
      if (isAuthRoute) {
        if (!res.payload?.user) navigate('/login');
        else navigate('/shop');
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const currentUser = user?.user || user || null;
  const userId = currentUser?.id || null;
  const isAuthenticated = !!currentUser && status === 'succeeded';

  return (
    <>
      <Navbar user={currentUser} userId={userId} status={status} />
      <div style={{ padding: 12 }}>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Shop user={currentUser} userId={userId} />} />
              <Route path="/shop" element={<Shop user={currentUser} userId={userId} />} />
              <Route path="/shop/:id" element={<ShopDetail user={currentUser} userId={userId} />} />
              <Route path="/chat/:itemId/:clientId/:sellerId" element={<Chat user={currentUser} userId={userId} />} />
              <Route path="/mychats" element={<MyChats user={currentUser} userId={userId} />} />
              <Route path="/profile" element={<Profile user={currentUser} userId={userId} />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Login />} />
            </>
          )}
        </Routes>
        <ClientFooter />
      </div>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);

export default App;
