import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import mileageIcon from '../assets/image/car-list-icons/mileage-icon.svg';
import petrolIcon from '../assets/image/car-list-icons/petrol-icon.svg';
import typeIcon from '../assets/image/car-list-icons/type-icon.svg';
import { Link } from 'react-router-dom';

export function CarCardPattern({ car }) {
    const { favorites, toggleFavorite } = useContext(FavoritesContext);
    const isFavorite = favorites.includes(car.id);

    return (
        <div className="" data-aos="fade-up" data-aos-delay="200">
            <div className="card position-relative">
                <Link to={`/cars/${car.id}`}>
                    <div className="my-card-img-top">
                        <img src={`https://localhost:7141${car.photo}`} className="my-card-img" alt={`${car.title}`} />
                    </div>
                    {car.badge && (
                        <span className={`badge ${car.badge === 'Great Price' ? 'bg-green-1' : 'bg-blue'} text-white position-absolute py-2 px-3 dm-sans-medium ft-15 border-30`} style={{ top: '15px', left: '10px' }}>
                            {car.badge}
                        </span>
                    )}
                </Link>

                {/* Иконка избранного */}
                <button
                    className="btn btn-light btn-sm m-0 position-absolute"
                    style={{ top: '15px', right: '10px', backgroundColor: 'white' }}
                    onClick={() => toggleFavorite(car.id)}
                >
                    <i className={isFavorite ? "bi bi-suit-heart-fill text-danger" : "bi bi-suit-heart"}></i>
                </button>

                <div className="card-body">
                    <h5 className="card-title ft-18 mb-1 dm-sans-medium primary-color">
                        {car.brand?.name || car.brand || ''} {car.model}

                    </h5>
                    <div className="row justify-content-center">
                        <div className="col-12 d-flex align-items-center mb-2">
                            <img src={mileageIcon} alt="Mileage Icon" className="fs-2 me-2" />
                            <p className="ft-15 mb-0">{car.mileage} km</p>
                        </div>
                        <div className="col-12 d-flex align-items-center mb-2">
                            <img src={petrolIcon} alt="Fuel Icon" className="fs-2 me-2" />
                            <p className="ft-15 mb-0">{car.fuel || car.fuelType}</p>
                        </div>
                        <div className="col-12 d-flex align-items-center">
                            <img src={typeIcon} alt="Transmission Icon" className="fs-2 me-2" />
                            <p className="ft-15 mb-0">{car.transmission}</p>
                        </div>
                    </div>

                    <div className="row pt-2">
                        <div className="col-6">
                            <h4 className="dm-sans-bold mb-1">
                                ${car.price >= 1000 ? car.price.toLocaleString('de-DE') : car.price}
                            </h4>
                        </div>

                        <div className="col-12 col-md-6 text-start text-md-end">
                            <p className="ft-15 blue-color dm-sans-medium mb-0 view-det">View Details <i className="bi bi-arrow-up-right"></i></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
