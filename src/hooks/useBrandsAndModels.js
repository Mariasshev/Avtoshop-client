import { useState, useEffect } from 'react';

export function useBrandsAndModels(selectedBrandId) {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/CarBrands`);
                const data = await res.json();
                setBrands(data);
            } catch (err) {
                console.error('Failed to fetch brands:', err);
            }
        };
        fetchBrands();
    }, []);

    useEffect(() => {
        if (selectedBrandId) {
            const fetchModels = async () => {
                try {
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/CarBrands/${selectedBrandId}/models`);
                    const data = await res.json();
                    setModels(data);
                } catch (err) {
                    console.error('Failed to fetch models:', err);
                }
            };
            fetchModels();
        } else {
            setModels([]);
        }
    }, [selectedBrandId]);

    return { brands, models };
}
