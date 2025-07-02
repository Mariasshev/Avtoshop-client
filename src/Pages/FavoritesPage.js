import React, { useState, useEffect } from 'react';
import { CarCardPattern } from '../Components/CarCardPattern';
import { HeaderDark } from "../Components/Header-dark-1";
import { Footer } from "../Components/Footer";

export function FavoritesPage() {
    const [allCars, setAllCars] = useState([]);
    const [favoriteCars, setFavoriteCars] = useState([]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cars`);
                const data = await response.json();
                setAllCars(data);
            } catch (error) {
                console.error('Ошибка загрузки машин:', error);
            }
        };
        fetchCars();
    }, []);

    useEffect(() => {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            const favoriteIds = JSON.parse(savedFavorites);
            const favoritesFiltered = allCars.filter(car => favoriteIds.includes(car.id));
            setFavoriteCars(favoritesFiltered);
        } else {
            setFavoriteCars([]);
        }
    }, [allCars]);

    return (
        <>
            <HeaderDark />
            <div className="container mt-4 min-vh-100">
                <h2>Your Favorites</h2>
                {favoriteCars.length === 0 ? (
                    <p>You have no favorites yet.</p>
                ) : (
                    <div className="row">
                        {favoriteCars.map(car => (
                            <div key={car.id} className="col-md-4 mb-3">
                                <CarCardPattern car={car} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
