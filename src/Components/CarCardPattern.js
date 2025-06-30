import React from 'react';
import mileageIcon from '../assets/image/car-list-icons/mileage-icon.svg';
import petrolIcon from '../assets/image/car-list-icons/petrol-icon.svg';
import typeIcon from '../assets/image/car-list-icons/type-icon.svg';
import { Link } from 'react-router-dom';

export function CarCardPattern({ car }) {
    return (
        <div className="col-12 col-md-6 col-lg-4 col-xl-3" data-aos="fade-up" data-aos-delay="200">
            <Link to={`/car-card/${car.id}`}>
                <div className="card">
                    <div className="position-relative">
                        <div className='my-card-img-top'>
                            <img src={`https://localhost:7141${car.photo}`} className="my-card-img" alt={`${car.title}`} />
                        </div>
                        
                    
                        {car.badge && (
                            <span className={`badge ${car.badge === 'Great Price' ? 'bg-green-1' : 'bg-blue'} text-white position-absolute py-2 px-3 dm-sans-medium ft-15 border-30`} style={{ top: '15px', left: '10px' }}>
                                {car.badge}
                            </span>
                        )}
                    </div>
                    <div className="card-body">
                        <h5 className="card-title ft-18 mb-1 dm-sans-medium primary-color">
                            {car.title}
                        </h5>
                        <div className="row justify-content-center">
                            <div className="col-4 text-center">
                                <img src={mileageIcon} alt="Mileage Icon" className="fs-2" />
                                <p className="ft-15">{car.mileage} км</p>
                            </div>
                            <div className="col-4 text-center">
                                <img src={petrolIcon} alt="Fuel Icon" className="fs-2" />
                                <p className="ft-15">{car.fuel}</p>
                            </div>
                            <div className="col-4 text-center">
                                <img src={typeIcon} alt="Transmission Icon" className="fs-2" />
                                <p className="ft-15">{car.transmission}</p>
                            </div>
                        </div>
                        <div className="row pt-3">
                            <div className="col-6">
                                <h4 className="dm-sans-bold mb-0">${car.price}</h4>
                            </div>
                            <div className="col-6 text-end">
                                <p className="ft-15 blue-color dm-sans-medium mb-0 view-det">View Details <i className="bi bi-arrow-up-right"></i></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
