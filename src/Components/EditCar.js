import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    id: id,
  });

  const [existingPhotos, setExistingPhotos] = useState([]); // URL строками
  const [photosToDelete, setPhotosToDelete] = useState([]); // URL для удаления
  const [newPhotos, setNewPhotos] = useState([]); // файлы для загрузки

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
useEffect(() => {
  const fetchCar = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/${id}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);

      const data = await res.json();

      console.log("API response data:", data);
      console.log("Existing photos array:", data.photoUrls ?? []);

      setFormData({
        mileage: data.mileage ?? '',
        year: data.year ?? '',
        transmission: data.transmission ?? '',
        fuelType: data.fuelType ?? '',
        brand: data.brand ?? '',
        model: data.model ?? '',
        driverType: data.driverType ?? '',
        condition: data.condition ?? '',
        engineSize: data.engineSize ?? '',
        door: data.door ?? '',
        cylinder: data.cylinder ?? '',
        color: data.color ?? '',
        vin: data.vin ?? '',
        price: data.price ?? '',
        description: data.description ?? '',
        id: data.id ?? id
      });

      setExistingPhotos(data.photoUrls ?? []);  //

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCar();
}, [id]);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleFileChange = (e) => {
    setNewPhotos(Array.from(e.target.files));
  };

  const handleDeleteExistingPhoto = (url) => {
    setPhotosToDelete(prev => [...prev, url]);
    setExistingPhotos(prev => prev.filter(p => p !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Важный момент: добавляем id в FormData
      data.append('Id', formData.id);

      // Добавляем остальные поля кроме photosToDelete и id
      Object.entries(formData).forEach(([key, value]) => {
        if (key.toLowerCase() !== 'id') {
          data.append(key, value);
        }
      });

      // Добавляем новые фото (файлы)
      newPhotos.forEach(photo => data.append('Photos', photo));

      // Добавляем photosToDelete как JSON строку
      data.append('PhotosToDelete', JSON.stringify(photosToDelete));

      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
          // НЕ добавляем Content-Type, он сам будет установлен для FormData
        },
        body: data
      });

      if (res.ok) {
        alert('Car updated!');
        navigate('/profile');
      } else {
        const errText = await res.text();
        alert('Failed to update car: ' + errText);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  if (loading) return <div>Loading car data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container my-5">
      <h2>Edit Car</h2>

      {/* Отображение существующих фото с кнопкой удаления */}
      <div className="mb-3">
        <label>Existing Photos:</label>
        <div className="d-flex flex-wrap gap-2">
          {existingPhotos.length === 0 && <p>No photos</p>}
          {existingPhotos.map(url => (
            <div key={url} style={{ position: 'relative' }}>
              <img src={process.env.REACT_APP_API_URL + url} alt="car" style={{ width: 100, height: 80, objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => handleDeleteExistingPhoto(url)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  cursor: 'pointer'
                }}
              >x</button>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          {/* Здесь все остальные поля, как в твоем примере */}

          <div className="col-md-4">
            <label>Mileage</label>
            <input type="number" name="mileage" className="form-control" value={formData.mileage} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Year</label>
            <input type="number" name="year" className="form-control" value={formData.year} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Engine Size</label>
            <input type="number" name="engineSize" className="form-control" value={formData.engineSize} onChange={handleChange} />
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
            <label>Brand</label>
            <input type="text" name="brand" className="form-control" value={formData.brand} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Model</label>
            <input type="text" name="model" className="form-control" value={formData.model} onChange={handleChange} />
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

          <div className="col-md-12">
            <label>New Photos (multiple)</label>
            <input type="file" multiple className="form-control" onChange={handleFileChange} />
          </div>

          <div className="col-md-12 mt-3">
            <label>Description</label>
            <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} rows={4} />
          </div>

        </div>

        <button type="submit" className="btn btn-primary mt-4">Save Changes</button>
      </form>
    </div>
  );
}
