import { Outlet  } from 'react-router-dom';
import {HeaderDark} from "../Components/Header-dark-1";
import {Footer} from "../Components/Footer";
import {EditCar} from "../Components/EditCar"

export const EditCarPage = () => (
    <>
    
        <HeaderDark/>
        <EditCar/>
        <Footer/>
    </>
);



