import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export function AddCarForm() {
  const [formData, setFormData] = useState({
    mileage: '',
    year: '',
    transmission: '',
    fuelType: '',
    brand: '',
    model: '',
    driverType: '',
    condition: '',
    engineSize: '',
    door: '',
    cylinder: '',
    color: '',
    vin: '',
    price: '',
    description: '',
    isOnStock: 1
  });
  const [photos, setPhotos] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const navigate = useNavigate();

  // Загрузка брендов при монтировании
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/CarBrands`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched brands:', data);
        setBrands(data);
      })
      .catch(err => console.error('Failed to fetch brands:', err));
  }, []);

  // Загрузка моделей при выборе бренда
  useEffect(() => {
    if (formData.brand) {
      fetch(`${process.env.REACT_APP_API_URL}/api/CarBrands/${formData.brand}/models`)
        .then(res => res.json())
        .then(data => {
          console.log('Fetched models:', data);
          setModels(data);
        })
        .catch(err => console.error('Failed to fetch models:', err));
    } else {
      setModels([]);
    }
  }, [formData.brand]);

  const handleBrandChange = (e) => {
    const selectedBrandId = e.target.value;
    console.log('Selected brandId:', selectedBrandId);
    setFormData(prev => ({
      ...prev,
      brand: selectedBrandId,
      model: '' // сбрасываем модель при смене бренда
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация с красивыми swal-уведомлениями
    if (!formData.brand || formData.brand === "0") {
      await Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please select a brand'
      });
      console.error('Brand is missing or invalid:', formData.brand);
      return;
    }

    if (!formData.model || formData.model === "0") {
      await Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please select a model'
      });
      console.error('Model is missing or invalid:', formData.model);
      return;
    }

    if (!formData.year) {
      await Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter the year'
      });
      console.error('Year is missing');
      return;
    }

    if (!formData.price) {
      await Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter the price'
      });
      console.error('Price is missing');
      return;
    }

    const data = new FormData();

    // Найдем выбранные бренд и модель по id
    const selectedBrand = brands.find(b => b.id.toString() === formData.brand);
    const selectedModel = models.find(m => m.id.toString() === formData.model);

    if (!selectedBrand) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Selected brand not found in brand list'
      });
      console.error('Brand not found in list:', formData.brand);
      return;
    }

    if (!selectedModel) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Selected model not found in model list'
      });
      console.error('Model not found in list:', formData.model);
      return;
    }

    // Добавляем все поля, кроме brand и model (они отдельно)
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'brand' && key !== 'model') {
        data.append(key, value);
      }
    });

    data.append('BrandId', parseInt(formData.brand, 10));
    data.append('Model', selectedModel.name);

    if (photos.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please upload at least one photo'
      });
      console.error('No photos selected');
      return;
    }

    photos.forEach(photo => data.append('Photos', photo));

    // Логируем отправляемые данные (файлы отображаются по имени)
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        await Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You are not authorized. Please log in.'
        });
        console.error('No auth token found');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/add`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Car successfully added!'
        });
        navigate('/profile');

        // Сброс формы
        setFormData({
          mileage: '', year: '', transmission: '', fuelType: '',
          brand: '', model: '', driverType: '', condition: '',
          engineSize: '', door: '', cylinder: '', color: '',
          vin: '', price: '', description: '', isOnStock: 1
        });
        setPhotos([]);
        setModels([]);
      } else {
        const errorText = await response.text();
        await Swal.fire({
          icon: 'error',
          title: 'Server error',
          text: errorText
        });
        console.error('Server error:', errorText);
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Network error',
        text: 'Please check your connection and try again.'
      });
      console.error('Network error:', error);
    }
  };

  return (
    <div className="container-lg my-5">
      <h2 className="mb-4">Add New Car</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label>Brand</label>
            <select name="brand" className="form-select" value={formData.brand} onChange={handleBrandChange}>
              <option value="">Select brand</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

          </div>

          <div className="col-md-4">
            <label>Model</label>
            <select name="model" className="form-select" value={formData.model} onChange={handleChange} disabled={!formData.brand}>
              <option value="">Select model</option>
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Оставшиеся твои поля без изменений */}
          <div className="col-md-4">
            <label>Year</label>
            <input type="number" name="year" className="form-control" value={formData.year} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Mileage</label>
            <input type="number" name="mileage" className="form-control" value={formData.mileage} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Engine Size</label>
            <input type="number" step="0.1" name="engineSize" className="form-control" value={formData.engineSize} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Doors</label>
            <input type="number" name="door" className="form-control" value={formData.door} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Cylinders</label>
            <input type="number" name="cylinder" className="form-control" value={formData.cylinder} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Price</label>
            <input type="number" step="0.01" name="price" className="form-control" value={formData.price} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>VIN</label>
            <input type="text" name="vin" className="form-control" value={formData.vin} onChange={handleChange} />
          </div>

          <div className="col-md-4">
            <label>Color</label>
            <select name="color" className="form-select" value={formData.color} onChange={handleChange}>
              <option value="">Select color</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Gray">Gray</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Transmission</label>
            <select name="transmission" className="form-select" value={formData.transmission} onChange={handleChange}>
              <option value="">Select transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Fuel Type</label>
            <select name="fuelType" className="form-select" value={formData.fuelType} onChange={handleChange}>
              <option value="">Select fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Drive Type</label>
            <select name="driverType" className="form-select" value={formData.driverType} onChange={handleChange}>
              <option value="">Select drive type</option>
              <option value="FWD">FWD</option>
              <option value="RWD">RWD</option>
              <option value="AWD">AWD</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Condition</label>
            <select name="condition" className="form-select" value={formData.condition} onChange={handleChange}>
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Photos (multiple)</label>
            <input type="file" multiple className="form-control" onChange={handleFileChange} />
          </div>
        </div>

        <div className="col-md-12 mt-3">
          <label>Description</label>
          <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} rows={4} />
        </div>

        <button type="submit" className="btn btn-primary mt-4">Add Car</button>
      </form>
    </div>
  );
}
