import React, { useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import liff from '@line/liff';

import axios from 'axios';
import {
  BrowserRouter,
  Route,
  Routes,
  useSearchParams,
} from 'react-router-dom';
import { useLocation, useParams } from 'react-router';
import qs from 'qs';

interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

const Home = () => {
  const [userProfile, setUserProfile] = useState<Profile>();

  const params = useParams();
  const location = useLocation();
  const query = useMemo(() => {
    return {
      ...qs.parse(location.search.slice(1)),
      ...params,
    };
  }, [location.search, params]);

  useEffect(() => {
    const iniLiff = async () => {
      try {
        await liff.init({
          liffId: '2001515416-x93O6XMl', // Use own liffId
        });

        const userProfile = await liff.getProfile();
        if (userProfile?.userId) {
          setUserProfile(userProfile);
        }

        // liff.closeWindow();
      } catch (error) {
        console.log({ error });
      }
    };
    iniLiff();
  }, []);

  useEffect(() => {
    const callApi = async () => {
      if (userProfile?.userId) {
        await axios.post(
          'https://immense-raccoon-presumably.ngrok-free.app/api/v1/line/callback',
          {
            query,
            userId: userProfile.userId,
            userProfile,
          }
        );
        // window.location.href = 'https://liff.line.me/2001515416-wnAKvZqD';
        // window.location.href = 'https://line.me/R/oaMessage/@1ppas2k';
        window.location.href = 'https://line.me/R/oaMessage/@225trzbf';
        // window.location.href = 'https://lin.ee/1ppas2k';
      }
    };
    callApi();
  }, [query, userProfile, userProfile?.userId]);

  return (
    <div className='App'>
      <header className='App-header'>
        <p>User Profile</p>
        {!!userProfile && <pre>{JSON.stringify(userProfile, null, 2)}</pre>}
        <p>Query Params</p>
        {!!query && <pre>{JSON.stringify(query, null, 2)}</pre>}
      </header>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
