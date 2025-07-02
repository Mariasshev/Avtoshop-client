import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CarInfo } from "../Components/Card-info";
import {HeaderDark} from "../Components/Header-dark-1";
import {Footer} from "../Components/Footer";

export const CarCard = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Запрос к API за данными по id
    fetch(`https://localhost:7141/api/cars/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Ошибка при загрузке авто");
        return res.json();
      })
      .then(data => {
        setCar(data);
        console.log(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!car) return <p>Автомобиль не найден</p>;

  return (
    <>
      <HeaderDark />
      <CarInfo car={car} />
      <Footer />
    </>
  );
};
