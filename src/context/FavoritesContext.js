import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);

    // При загрузке страницы получаем избранное из localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(saved);
    }, []);

    // Обновляем localStorage при изменении favorites
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (id) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
        );
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}
