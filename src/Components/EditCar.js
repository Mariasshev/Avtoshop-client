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
    description: ''
    // isOnStock: 1,
  });

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/${id}/details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error(`Ошибка загрузки: ${res.status}`);
        }
        const data = await res.json();
console.log("API response:", data);
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
        isOnStock: data.isOnStock ?? 1,  // если нужно, можно раскомментировать
        id: data.id ?? id // обязательно положи id, чтобы он не пропал
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);



  console.log("engineSize:", formData.engineSize);
  console.log("model:", formData.model);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleFileChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
const data = new FormData();

// Обязательно добавь id в FormData
data.append('Id', id); // или formData.id если у тебя в состоянии

// Добавь остальные поля
Object.entries(formData).forEach(([key, value]) => {
  if (key !== 'id') { // чтобы не дублировать id
    data.append(key, value);
  }

});

      photos.forEach(photo => data.append('Photos', photo)); // имя с большой буквы

      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
          // НЕ добавляй "Content-Type" для FormData, браузер сам установит нужный с boundary
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
      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          <div className="col-md-4">
            <label>Mileage</label>
            <input
              type="number"
              name="mileage"
              className="form-control"
              value={formData.mileage}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Year</label>
            <input
              type="number"
              name="year"
              className="form-control"
              value={formData.year}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Engine Size</label>
            <input
              type="number"
              name="engineSize"
              className="form-control"
              value={formData.engineSize}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Doors</label>
            <input
              type="number"
              name="door"
              className="form-control"
              value={formData.door}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Cylinders</label>
            <input
              type="number"
              name="cylinder"
              className="form-control"
              value={formData.cylinder}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              className="form-control"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Model</label>
            <input
              type="text"
              name="model"
              className="form-control"
              value={formData.model}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>VIN</label>
            <input
              type="text"
              name="vin"
              className="form-control"
              value={formData.vin}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Color</label>
            <select
              name="color"
              className="form-select"
              value={formData.color}
              onChange={handleChange}
            >
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
            <select
              name="transmission"
              className="form-select"
              value={formData.transmission}
              onChange={handleChange}
            >
              <option value="">Select transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Fuel Type</label>
            <select
              name="fuelType"
              className="form-select"
              value={formData.fuelType}
              onChange={handleChange}
            >
              <option value="">Select fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Drive Type</label>
            <select
              name="driverType"
              className="form-select"
              value={formData.driverType}
              onChange={handleChange}
            >
              <option value="">Select drive type</option>
              <option value="FWD">FWD</option>
              <option value="RWD">RWD</option>
              <option value="AWD">AWD</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Condition</label>
            <select
              name="condition"
              className="form-select"
              value={formData.condition}
              onChange={handleChange}
            >
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>

          <div className="col-md-12">
            <label>Photos (multiple)</label>
            <input
              type="file"
              multiple
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          <div className="col-md-12 mt-3">
            <label>Description</label>
            <p className='fw-bold'>!This field does not allow: <br />
              <span className='text-danger fw-normal'>Leaving links or contact information</span><br />
              <span className='text-danger fw-normal'>Offering services</span></p>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* <div className="col-md-12 mt-3">
            <div className="form-check">
              <input
                type="checkbox"
                name="isOnStock"
                className="form-check-input"
                checked={formData.isOnStock === 1}
                onChange={handleChange}
                id="isOnStockCheck"
              />
              <label htmlFor="isOnStockCheck" className="form-check-label">Is On Stock</label>
            </div>
          </div> */}

        </div>

        <button type="submit" className="btn btn-primary mt-4">Save Changes</button>
      </form>
    </div>
  );
}
