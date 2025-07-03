import React, { useState, useEffect } from 'react';
import { CarCardPattern } from './CarCardPattern';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function CarsList({ limit }) {
    const [cars, setCars] = useState([]);

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
        <div className="section bg-white-2 py-3">
            <div className="container my-5">
                <div className="row pt-3" data-aos="fade-up" data-aos-delay="200">
                    <div className="col-sm-8 col-12 text-sm-start text-center">
                        <h2 className="primary-color dm-sans-bold text-h2">Explore All Vehicles</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" data-aos="fade-up" data-aos-delay="300">
                        <ul className="nav nav-underline">
                            <li className="nav-item dm-sans-medium">
                                <a className="nav-link active">Recent Cars</a>
                            </li>
                            {/* <li className="nav-item">
                                <a className="nav-link">Featured Cars</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link">Popular Cars</a>
                            </li> */}
                        </ul>
                    </div>
                    <div className="col-12 mt-5" data-aos="fade-up" data-aos-delay="400">
                        <div className="row gx-1 gx-md-3 gy-3">
                            {cars.map(car => (
                                <div className='col-6 col-md-6 col-lg-4 col-xl-3' key={car.id}>
                                    <CarCardPattern
                                        car={car}
                                        data-aos="fade-up"
                                        data-aos-delay={`${400 + car.id * 100}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='text-center mt-3'>
                        <Link to="/cars-list">
                            <button type="button" className="btn btn-outline-primary dm-sans-medium ft-18">
                                Show all cars
                            </button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
