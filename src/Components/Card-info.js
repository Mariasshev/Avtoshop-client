import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import calendarIcon from '../assets/image/car-info/calendar-icon.svg';
import mileageIcon from '../assets/image/car-info/mileage-icon.svg';
import petrolIcon from '../assets/image/car-info/petrol-icon.svg';
import typeIcon from '../assets/image/car-info/type-icon.svg';

import mileageBlackIcon from '../assets/image/car-info/mileage-black-icon.svg';
import petrolBlackIcon from '../assets/image/car-info/petrol-black-icon.svg';
import yearIcon from '../assets/image/car-info/year-icon.svg';
import transmissionIcon from '../assets/image/car-info/transmission-icon.svg';
import driveTypeIcon from '../assets/image/car-info/drive-type-icon.svg';
import conditionIcon from '../assets/image/car-info/condition-icon.svg';
import engineIcon from '../assets/image/car-info/engine-size-icon.svg';
import doorIcon from '../assets/image/car-info/door-icon.svg';
import cylinderIcon from '../assets/image/car-info/cylinder-icon.svg';
import colorIcon from '../assets/image/car-info/color-icon.svg';
import vinIcon from '../assets/image/car-info/vin-icon.svg';
import phoneIcon from '../assets/image/car-info/phone-icon.svg';
import offerIcon from '../assets/image/car-info/offer-icon.svg';
import getDirectionIcon from '../assets/image/car-info/get-direction-icon.svg';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from 'sweetalert2';

import { CarCardPattern } from './CarCardPattern';

export function CarInfo({ car, cars }) {

  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const navigate = useNavigate();

  const handleAddCarClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp > currentTime) {
          navigate("/add-listing");
        } else {
          showLoginModal();
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        localStorage.removeItem("token");
        showLoginModal();
      }
    } else {
      showLoginModal();
    }
  };

  const showLoginModal = () => {
    Swal.fire({
      title: 'Authorization required',
      text: 'Please log in or register to add a new car listing.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: 'Register',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-4',
        title: 'fw-bold',
        confirmButton: 'btn btn-dark px-3 ms-1',
        cancelButton: 'btn btn-outline-dark px-3'
      },
      buttonsStyling: false,
      background: '#fff',
      color: '#050B20',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login-form");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate("/login-form");
      }
    });
  };

  const [slidesToShowNew, setSlidesToShowNew] = useState(4);
  const [slidesToShowFavorable, setSlidesToShowFavorable] = useState(4);

  const sliderSettingsNew = {
    slidesToShow: slidesToShowNew,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: Math.min(slidesToShowNew, 3) }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(slidesToShowNew, 2) }
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  const sliderSettingsFavorable = {
    slidesToShow: slidesToShowFavorable,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: Math.min(slidesToShowFavorable, 3) }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(slidesToShowFavorable, 2) }
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 }
      }
    ]
  };


  return (

    <section className="">
      <div className="container py-0 py-md-5">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item"><a href="#">Listings</a></li>
            <li className="breadcrumb-item active" aria-current="page">{`${car?.brand} ${car?.model}` || 'Car Details'}</li>
          </ol>
        </nav>
        <h2 className="dm-sans-bold" data-aos="fade-up" data-aos-delay="200">{`${car?.brand} ${car?.model}`}</h2>

        <div className="row">
          <div className="col-12 col-md-8 col-lg-6" data-aos="fade-up" data-aos-delay="300">
            <div className="row gy-2 gx-1">
              <div className="col-6 col-md-3">
                <div className="blue-color border-40 bg-light-blue py-2 px-2 text-center ft-15">
                  <img src={calendarIcon} alt="Year" /> {car?.year || '-'}
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="blue-color border-40 bg-light-blue py-2 px-2 text-center ft-15">
                  <img src={mileageIcon} alt="Mileage" /> {car?.mileage || '-'} miles
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="blue-color border-40 bg-light-blue py-2 px-2 text-center ft-15">
                  <img src={typeIcon} alt="Transmission" /> {car?.transmission || '-'}
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="blue-color border-40 bg-light-blue py-2 px-2 text-center ft-15">
                  <img src={petrolIcon} alt="Fuel Type" /> {car.fuelType || '-'}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-6" data-aos="fade-up" data-aos-delay="300">
            <div className="text-end ft-15">Add to favourites<button className="btn border-0"><i className="bi bi-suit-heart"></i></button></div>
          </div>
        </div>

        <div className="row pt-3">
          <div className="col-12 col-lg-8" data-aos="fade-up" data-aos-delay="400">
            <div>
              <img src={`https://localhost:7141${car.photo}`} className="img-fluid border-16" alt={`${car?.brand} ${car?.model}` || 'Car image'} />
            </div>

            <div className="row mt-3">
              <div className="col-12 fw-bold ft-26">
                Car Overview
              </div>
            </div>

            <div className="row pt-4 pb-4" data-aos="fade-up" data-aos-delay="300">

              <div className="col-lg-3 col-6 fw-bold pb-3"><img src={conditionIcon} alt="Condition" /> Condition:</div>
              <div className="col-lg-3 col-6">{car?.condition || '-'}</div>

              <div className="col-lg-3 col-6 fw-bold pb-3"><img src={mileageBlackIcon} alt="Mileage" /> Mileage:</div>
              <div className="col-lg-3 col-6">{car?.mileage || '-'}</div>

              <div className="col-lg-3 col-6 fw-bold pb-3"><img src={engineIcon} alt="Engine Size" /> Engine Size:</div>
              <div className="col-lg-3 col-6">{car?.engineSize || '-'}</div>

              <div className="col-lg-3 col-6 fw-bold pb-3"><img src={petrolBlackIcon} alt="Fuel Type" /> Fuel Type:</div>
              <div className="col-lg-3 col-6">{car?.fuelType || '-'}</div>

              <div className="col-lg-3 col-6 fw-bold pb-3"><img src={doorIcon} alt="Doors" /> Door:</div>
              <div className="col-lg-3 col-6">{car?.door || '-'}</div>

              <div className="col-lg-3 col-6 fw-bold pb-3"><img src={yearIcon} alt="Year" /> Year:</div>
              <div className="col-lg-3 col-6">{car?.year || '-'}</div>

              <div className="col-lg-3 col-6 fw-bold pb-3"><img src={cylinderIcon} alt="Cylinder" /> Cylinder:</div>
              <div className="col-lg-3 col-6">{car?.cylinder || '-'}</div>

              <div className="col-lg-3 col-6 fw-bold pb-3"><img src={transmissionIcon} alt="Transmission" /> Transmission:</div>
              <div className="col-lg-3 col-6">{car?.transmission || '-'}</div>

              <div className="col-lg-3 col-6 fw-bold pb-3"><img src={colorIcon} alt="Color" /> Color:</div>
              <div className="col-lg-3 col-6">{car?.color || '-'}</div>

              <div className="col-lg-3 col-6 fw-bold pb-3"><img src={driveTypeIcon} alt="Drive Type" /> Drive Type:</div>
              <div className="col-lg-3 col-6">{car?.driverType || '-'}</div>

              <div className="col-lg-3 col-6 fw-bold pb-3"><img src={vinIcon} alt="VIN" /> VIN:</div>
              <div className="col-lg-3 col-6">{car?.vin || '-'}</div>
            </div>
            <hr />

            <div className="row pt-3" data-aos="fade-up" data-aos-delay="300">
              <div className="col-12 fw-bold ft-26 pb-2">
                Description
              </div>
              <div className="pt-2">
                <p>{car?.description || 'No description'}</p>
              </div>
              <div>
                {/* <div className="d-grid gap-2 col-12 col-md-4 pt-3">
                  <button className="btn btn-outline-dark h55" type="button">
                    <img src={calendarIcon} alt="Brochure" /> {car?.brochureName || 'Car-Brochure.pdf'}
                  </button>
                </div> */}
              </div>
            </div>
            <hr />

            {/* <FinancingCalc /> */}
          </div>


          <div className="col-12 col-lg-4" data-aos="fade-up" data-aos-delay="200">
            <div className="pt-lg-0 pt-5">
              <div className="border-btn1 border-16">
                <div className="row m-3 pt-2 pb-2">
                  <div className="col-12">
                    <p className="m-0 pb-2">Price</p>
                  </div>

                  <div className="col-12 pb-2">
                    <span className="ft-16 line-through">${car?.oldPrice?.toLocaleString() || '180,000'}</span>{" "}
                    <span className="h3 dm-sans-bold">${car?.price?.toLocaleString() || '165,000'}</span>
                  </div>

                  <div className="col-12 pb-2">
                    <p>Instant Saving: ${car?.instantSaving?.toLocaleString() || '15,000'}</p>
                  </div>

                  <div className="d-grid gap-2 col-11 mx-auto pb-3">
                    <button className="btn btn-primary h55" type="button"><img src={offerIcon} alt="Offer" /> Make An Offer Price</button>
                  </div>
                  {/* <div className="d-grid gap-2 col-11 mx-auto pb-3">
                    <button className="btn btn-outline-dark h55" type="button"><img src={driveTypeIcon} alt="Test Drive" /> Schedule Test Drive</button>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="pt-4 pb-5" data-aos="fade-up" data-aos-delay="200">
              <div className="border-btn1 border-16">
                <div className="row m-2 pt-2 pb-2">

                  <div className="col-12">
                    <img
                      src={`https://localhost:7141${car.salerPhoto}`}
                      alt="Admin"
                      className="saler-photo"
                    />

                    <p className="m-0 ft-20 dm-sans-medium mb-2">{car.salerName || 'admin'}</p>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <p className="ft-15"><img src={getDirectionIcon} alt="Direction" /> {car?.salerAddress || ' '}</p>
                    </div>
                    <div className="col-6">
                      <p className="ft-15"><img src={phoneIcon} alt="Phone" /> {car?.salerPhone || ' '}</p>
                    </div>
                  </div>

                  <div className="d-grid gap-2 col-11 mx-auto pb-2">
                    <button className="btn btn-primary h55" type="button"> Message Dealer <i className="bi bi-arrow-up-right"></i></button>
                  </div>
                  <div className="d-grid gap-2 col-11 mx-auto pb-3">
                    <button className="btn btn-outline-success h55" type="button">View All stock at this dealer <i className="bi bi-arrow-up-right"></i></button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      <div className="container mb-5 pb-4">
        {/* 1 slider */}
        <div className="row mt-3">
          <div className="col-12">
            <div className="d-flex justify-content-between mb-3">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">New cars</h2>
                <div className="ms-2 align-middle d-flex align-items-center">
                  <button
                    className={`btn btn-sm px-3 rounded-2 ${slidesToShowNew === 4 ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() => setSlidesToShowNew(4)}
                  >
                    sm
                  </button>
                  <button
                    className={`btn btn-sm ms-1 px-3 rounded-2 ${slidesToShowNew === 3 ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() => setSlidesToShowNew(3)}
                  >
                    lg
                  </button>
                </div>

              </div>

              <div>
                <button
                  className="btn btn-md px-3 btn-success rounded-2 ms-1"
                  onClick={handleAddCarClick}
                >
                  Add new car
                </button>
              </div>

            </div>
          </div>
        </div>
        <div className="row">
          <div className="slider-wrapper">

            <Slider {...sliderSettingsNew}>
              {cars.filter(car => car.badge?.trim().toLowerCase() === "new").map(car => (
                <CarCardPattern
                  key={car.id}
                  car={car}
                  data-aos="fade-up"
                  data-aos-delay={`${400 + car.id * 100}`}
                />
              ))}
            </Slider>

          </div>

        </div>

        {/* 2 slider */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="d-flex justify-content-between">
              <h2>Favorable price</h2>
              <div>
                <button
                  className={`btn btn-sm px-3 rounded-2 ${slidesToShowFavorable === 4 ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setSlidesToShowFavorable(4)}
                >
                  sm
                </button>
                <button
                  className={`btn btn-sm ms-1 px-3 rounded-2 ${slidesToShowFavorable === 3 ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setSlidesToShowFavorable(3)}
                >
                  lg
                </button>
              </div>

            </div>
          </div>
        </div>
        <div className="row">
          <div className="slider-wrapper">

            <Slider {...sliderSettingsFavorable}>
              {cars.filter(car => car.badge?.trim().toLowerCase() === "new").map(car => (
                <CarCardPattern
                  key={car.id}
                  car={car}
                  data-aos="fade-up"
                  data-aos-delay={`${400 + car.id * 100}`}
                />
              ))}
            </Slider>

          </div>

        </div>

      </div>
    </section>

  );
}
