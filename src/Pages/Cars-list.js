import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CarCardPattern } from '../Components/CarCardPattern';
import { HeaderDark } from "../Components/Header-dark-1";
import { Footer } from "../Components/Footer";
import { useBrandsAndModels } from '../hooks/useBrandsAndModels';
import { Pagination } from '../Components/Pagination';
import * as bootstrap from 'bootstrap';

import AOS from 'aos';
import 'aos/dist/aos.css';

export const CarsListCatalog = ({ limit }) => {
    const [cars, setCars] = useState([]);
    const [filters, setFilters] = useState({
        brand: '',
        fuelType: '',
        transmission: '',
        priceMin: '',
        priceMax: '',
        yearMin: '',
        yearMax: ''
    });

    const { brands, models } = useBrandsAndModels(filters.brand);
    const [sortOrder, setSortOrder] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    useEffect(() => {
        setCurrentPage(1);
        //applyFilters();
    }, [filters, sortOrder]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const carsToShow = cars
        .sort((a, b) => {
            if (sortOrder === 'priceAsc') return a.price - b.price;
            if (sortOrder === 'priceDesc') return b.price - a.price;
            return 0;
        })
        .slice(startIndex, endIndex);


    const applyFilters = async () => {
        console.log("Apply filters clicked", filters);
        try {
            const query = new URLSearchParams();

            if (filters.brand) query.append('brandId', filters.brand);
            if (filters.model) query.append('modelName', filters.model); // название модели, не id
            if (filters.transmission) query.append('transmission', filters.transmission);
            if (filters.fuelType) query.append('fuelType', filters.fuelType);
            if (filters.color) query.append('color', filters.color);
            if (filters.driverType) query.append('driverType', filters.driverType);
            if (filters.condition) query.append('condition', filters.condition);

            if (filters.yearMin) query.append('yearMin', filters.yearMin);
            if (filters.yearMax) query.append('yearMax', filters.yearMax);

            if (filters.priceMin) query.append('priceMin', filters.priceMin);
            if (filters.priceMax) query.append('priceMax', filters.priceMax);

            if (filters.engineSizeMin) query.append('engineSizeMin', filters.engineSizeMin);
            if (filters.engineSizeMax) query.append('engineSizeMax', filters.engineSizeMax);

            if (filters.door) query.append('door', filters.door);
            if (filters.cylinder) query.append('cylinder', filters.cylinder);
            if (filters.mileage) query.append('mileage', filters.mileage);
            if (filters.hasVin) query.append('hasVin', filters.hasVin);

            // Добавляем сортировку
            if (sortOrder) {
                query.append('sortOrder', sortOrder);
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/filter-cars?${query}`);

            const data = await response.json();
            setCars(limit ? data.slice(0, limit) : data);
        } catch (err) {
            console.error("Failed to fetch filtered cars:", err);
        }
    };


    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cars`);
                const data = await response.json();
                setCars(limit ? data.slice(0, limit) : data);
            } catch (err) {
                console.error("Failed to fetch cars:", err);
            }
        };

        fetchCars();

        AOS.init({
            duration: 1000,
            once: true,
            offset: 200,
        });
    }, [limit]);



    return (
        <>
            <HeaderDark />
            <section className="my-3 my-md-5">
                <div className="container-lg">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Catalog</li>
                        </ol>
                    </nav>
                    <h1 className="dm-sans-bold mb-4" data-aos="fade-up" data-aos-delay="200">Catalog</h1>
                    <div className="row">
                        <div className='d-flex justify-content-between'>
                            {/* Левая колонка с фильтрами */}
                            <button
                                className="btn btn-primary w-auto d-md-none mb-3 ms-2"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#filtersOffcanvas"
                                aria-controls="filtersOffcanvas"
                            >
                                Filters
                            </button>

                            <div className='d-none d-md-flex'>
                                <h5>Filters</h5>
                            </div>

                            <div className="d-flex justify-content-end align-items-center mb-3">
                                <label htmlFor="sortPrice" className="me-2 mb-0 d-none d-md-flex">Sort by price:</label>
                                <select
                                    id="sortPrice"
                                    className="form-select w-auto"
                                    value={sortOrder}
                                    onChange={handleSortChange}
                                >
                                    <option value="">No sorting</option>
                                    <option value="priceAsc">Price: Low to High</option>
                                    <option value="priceDesc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>


                        {/* Offcanvas для мобилок */}
                        <div
                            className="offcanvas offcanvas-start d-md-none"
                            tabIndex="-1"
                            id="filtersOffcanvas"
                            aria-labelledby="filtersOffcanvasLabel"
                        >
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="filtersOffcanvasLabel">Filters</h5>
                                <button
                                    type="button"
                                    className="btn-close text-reset"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="offcanvas-body">
                                <FiltersContent
                                    filters={filters}
                                    brands={brands}
                                    models={models}
                                    handleFilterChange={handleFilterChange}
                                    applyFilters={() => {
                                        applyFilters();
                                        const offcanvasEl = document.getElementById('filtersOffcanvas');
                                        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                                        bsOffcanvas.hide();
                                    }}
                                />
                            </div>
                        </div>

                        {/* Фильтры для десктопа */}
                        <div className="col-12 col-md-3 mb-4 d-none d-md-block" data-aos="fade-up" data-aos-delay="300">
                            <FiltersContent
                                filters={filters}
                                brands={brands}
                                models={models}
                                handleFilterChange={handleFilterChange}
                                applyFilters={applyFilters}
                            />
                        </div>

                        {/* Правая колонка с карточками машин */}
                        <div className="col-12 col-md-9" data-aos="fade-up" data-aos-delay="400">
                            <div className="row gx-2 gy-3">
                                {carsToShow.length === 0 && (
                                    <p className="text-muted">No cars found for selected filters.</p>
                                )}
                                {carsToShow.map(car => (
                                    <div className='col-6 col-md-6 col-lg-4 col-xl-4' key={car.id}>
                                        <CarCardPattern
                                            car={car}
                                            data-aos="fade-up"
                                            data-aos-delay={`${400 + car.id * 100}`}
                                        />
                                    </div>
                                ))}
                            </div>


                            <Pagination
                                totalItems={cars.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>

                </div>
            </section >
            <Footer />
            <Outlet />
        </>
    );



};
const FiltersContent = ({ filters, brands, models, handleFilterChange, applyFilters }) => (
    <div>
        <h6>Brand</h6>
        <select
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="form-select mb-2"
        >
            <option value="">All</option>
            {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
            ))}
        </select>

        <h6>Model</h6>
        <select
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
            className="form-select mb-2"
            disabled={!filters.brand}
        >
            <option value="">All</option>
            {models.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
            ))}
        </select>

        <h6>Year</h6>
        <input type="number" name="yearMin" value={filters.yearMin} onChange={handleFilterChange} placeholder="From" className="form-control mb-1" />
        <input type="number" name="yearMax" value={filters.yearMax} onChange={handleFilterChange} placeholder="To" className="form-control mb-2" />

        <h6>Price</h6>
        <input type="number" name="priceMin" value={filters.priceMin} onChange={handleFilterChange} placeholder="Min" className="form-control mb-1" />
        <input type="number" name="priceMax" value={filters.priceMax} onChange={handleFilterChange} placeholder="Max" className="form-control mb-2" />

        <h6>Color</h6>
        <select name="color" value={filters.color} onChange={handleFilterChange} className="form-select mb-2">
            <option value="">All</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Red">Red</option>
            <option value="Silver">Silver</option>
        </select>

        <h6>Fuel Type</h6>
        <select name="fuelType" value={filters.fuelType} onChange={handleFilterChange} className="form-select mb-2">
            <option value="">All</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
        </select>

        <h6>Transmission</h6>
        <select name="transmission" value={filters.transmission} onChange={handleFilterChange} className="form-select mb-2">
            <option value="">All</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
        </select>

        <h6>Driver Type</h6>
        <select name="driverType" value={filters.driverType} onChange={handleFilterChange} className="form-select mb-2">
            <option value="">All</option>
            <option value="AWD">AWD</option>
            <option value="FWD">FWD</option>
            <option value="RWD">RWD</option>
        </select>

        <h6>Engine Size</h6>
        <input type="number" name="engineSizeMin" value={filters.engineSizeMin} onChange={handleFilterChange} placeholder="Min" className="form-control mb-1" />
        <input type="number" name="engineSizeMax" value={filters.engineSizeMax} onChange={handleFilterChange} placeholder="Max" className="form-control mb-2" />

        <h6>Doors</h6>
        <select name="door" value={filters.door} onChange={handleFilterChange} className="form-select mb-2">
            <option value="">All</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>

        <h6>Cylinders</h6>
        <select name="cylinder" value={filters.cylinder} onChange={handleFilterChange} className="form-select mb-2">
            <option value="">All</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
        </select>

        <h6>Condition</h6>
        <select name="condition" value={filters.condition} onChange={handleFilterChange} className="form-select mb-2">
            <option value="">All</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
        </select>

        <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" name="hasVin" checked={filters.hasVin} onChange={handleFilterChange} id="hasVin" />
            <label className="form-check-label" htmlFor="hasVin">Only with VIN</label>
        </div>

        <button onClick={applyFilters} className="btn btn-primary mt-2 w-100">Apply filters</button>
    </div>
);