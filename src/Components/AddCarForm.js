import React, { useState } from 'react';

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
    isOnStock: 1 // если у тебя в DTO есть это поле
  });
  const [photos, setPhotos] = useState([]);

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

  const data = new FormData();
  // append все поля формы
  Object.entries(formData).forEach(([key, value]) => {
    data.append(key, value);
  });

  // append фотографии
  photos.forEach((photo) => {
    data.append('Photos', photo); // имя с большой буквы, как в CarCreateDto
  });

//   if (isUpdate) {
//     data.append('PhotosToDelete', JSON.stringify(photosToDelete));
//   }

  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // для проверки

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/add`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data,
    });

    if (response.ok) {
      alert('Car successfully added!');
      // очистим форму
      setFormData({
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
      setPhotos([]);
    } else {
      const errorText = await response.text();
      console.error('Server error:', errorText);
      alert('Failed to add car: ' + errorText);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error');
  }
//   if (isUpdate) {
//   data.append('PhotosToDelete', JSON.stringify(photosToDelete));
// }
};


  return (
    <div className="container-lg my-5">
      <h2 className="mb-4">Add New Car</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3 ">
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
          <div className="col-md-4">
            <label>Photos (multiple)</label>
            <input type="file" multiple className="form-control" onChange={handleFileChange} />
          </div>
        </div>
        <div className="col-md-12 mt-3">
  <label>Description</label>
  <p className='fw-bold'>!This field does not allow: <br></br>
<span className='text-danger fw-normal'>Leaving links or contact information</span><br></br>
<span className='text-danger fw-normal'>Offering services</span></p>
  <textarea
    name="description"
    className="form-control"
    value={formData.description}
    onChange={handleChange}
    rows={4}
  />
</div>


        <button type="submit" className="btn btn-primary mt-4">Add Car</button>
      </form>
    </div>
  );
};

