import { AddCarForm } from '../Components/AddCarForm';
import { Outlet  } from 'react-router-dom';
import {HeaderDark} from "../Components/Header-dark-1";
import {Footer} from "../Components/Footer";

export const AddCarPage = () => (
    <>
        <Outlet/>
        <HeaderDark/>
        <AddCarForm/>
        <Footer/>
    </>

);