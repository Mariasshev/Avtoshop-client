import { Outlet  } from 'react-router-dom';
import {HeaderDark} from "../Components/Header-dark-1";
import {Footer} from "../Components/Footer";
import { ProfilePage } from '../Components/ProfilePage';

export const Profile = () => (
    <>
        <Outlet/>
        <HeaderDark/>
        <ProfilePage/>
        <Footer/>
    </>

);