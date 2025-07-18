import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import "slick-carousel/slick/slick.css";
import 'boxicons/css/boxicons.min.css';
import "slick-carousel/slick/slick-theme.css";
import './App.css';

//import { AuthProvider } from './Components/AuthContext';
//import {useState } from 'react';
import { MainPage } from "./Pages/MainPage";
import { CarsListCatalog } from "./Pages/Cars-list";
import { CarCard } from "./Pages/Car-card";
import { Blog } from "./Pages/Blog";
import { BlogPage } from "./Pages/blog-page";
import { Shop } from "./Pages/Shop";
import { Questions } from "./Pages/Questions";
import { LoanCalc } from "./Pages/LoanCalc";
import { PriceCards } from "./Pages/PriceCards";
import { Service } from "./Pages/Service";
import { AboutUs } from "./Pages/AboutUs";
import { Contacts } from "./Pages/Contacts";
import { LoginForm } from "./Pages/LoginForm";
import { Profile } from './Pages/Profile';
import { AddCarPage } from './Pages/AddCarPage';
import { EditCarPage } from './Pages/EditCarPage';
import { FavoritesPage } from './Pages/FavoritesPage';


function App() {

    useEffect(() => {
        AOS.init({
            duration: 1000, // Настройка продолжительности анимации (по умолчанию 400ms)
        });
    }, []);


    return (

        <BrowserRouter>
            <Routes>
                {/* Redirect from root path to index */}
                <Route path="/" element={<Navigate to="index" />} />

                {/* Главная страница - index */}
                <Route path="index" element={<MainPage />} />

                {/* Cars-list */}
                <Route path="cars-list" element={<CarsListCatalog />} />

                {/* Car-card */}
                <Route path="/cars/:id" element={<CarCard />} />

                {/* Blog */}
                <Route path="blog" element={<Blog />} />

                {/* Blog-page */}
                <Route path="blog-page" element={<BlogPage />} />

                {/* Shop */}
                <Route path="shop" element={<Shop />} />

                {/* Questions */}
                <Route path="questions" element={<Questions />} />

                {/* Loan Calculator */}
                <Route path="loan-calc" element={<LoanCalc />} />

                {/* Price Cards */}
                <Route path="price-cards" element={<PriceCards />} />

                {/* Service */}
                <Route path="service" element={<Service />} />

                {/* About Us */}
                <Route path="about-us" element={<AboutUs />} />

                {/* Contacts */}
                <Route path="contacts" element={<Contacts />} />

                {/* Profile */}
                <Route path="profile" element={<Profile />} />

                {/* Login Form */}
                <Route path="login-form" element={<LoginForm />} />

                {/* Car Form */}
                <Route path="/add-listing" element={<AddCarPage />} />

                {/* Edit user car */}
                <Route path="/cars/edit/:id" element={<EditCarPage />} />

                {/* Favourites */}
                <Route path="/favorites" element={<FavoritesPage />} />


            </Routes>
        </BrowserRouter>


    );
}

export default App;