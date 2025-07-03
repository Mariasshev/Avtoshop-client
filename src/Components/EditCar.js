import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mileage: '',
    year: '',
    transmission: '',
    fuelType: '',
    brandId: '',          // исправлено с brand -> brandId
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

  const [existingPhotos, setExistingPhotos] = useState([]);
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/CarBrands`)
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.error('Failed to load brands', err));
  }, []);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/${id}/details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Load error: ${res.status}`);
        const data = await res.json();

        let brandId = String(data.brandId ?? '');
        let modelName = data.model ?? '';

        setFormData({
          mileage: data.mileage ?? '',
          year: data.year ?? '',
          transmission: data.transmission ?? '',
          fuelType: data.fuelType ?? '',
          brandId: brandId,
          model: modelName,
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

        setExistingPhotos(data.photoUrls ?? []);

        if (brandId) {
          fetch(`${process.env.REACT_APP_API_URL}/api/CarBrands/${brandId}/models`)
            .then(res => res.json())
            .then(data => setModels(Array.isArray(data) ? data : []))
            .catch(err => console.error('Failed to load models', err));
        }
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

  const handleBrandChange = (e) => {
    const selectedBrandId = e.target.value;
    setFormData(prev => ({
      ...prev,
      brandId: selectedBrandId,
      model: ''
    }));
    if (selectedBrandId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/CarBrands/${selectedBrandId}/models`)
        .then(res => res.json())
        .then(data => setModels(Array.isArray(data) ? data : []))
        .catch(err => {
          console.error('Failed to load models', err);
          setModels([]);
        });
    } else {
      setModels([]);
    }
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
    if (!formData.brandId || !formData.model || !formData.year || !formData.price) {
      await Swal.fire({ icon: 'warning', title: 'Missing fields', text: 'Please fill in required fields: brand, model, year, price.' });
      return;
    }

    try {
      const data = new FormData();
      data.append('Id', formData.id);
      data.append('BrandId', formData.brandId); // добавляем нужным ключом
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'brandId') data.append(key, value);
      });
      newPhotos.forEach(photo => data.append('Photos', photo));
      data.append('PhotosToDelete', JSON.stringify(photosToDelete));

      const token = localStorage.getItem('token');
      if (!token) {
        await Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'Please log in again.' });
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        await Swal.fire({ icon: 'success', title: 'Success', text: 'Car updated successfully!' });
        navigate('/profile');
      } else {
        const errText = await res.text();
        await Swal.fire({ icon: 'error', title: 'Error', text: `Failed to update car: ${errText}` });
      }
    } catch (err) {
      await Swal.fire({ icon: 'error', title: 'Network Error', text: err.message });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container my-5">
      <h2>Edit Car</h2>
      <div className="mb-3">
        <label>Existing Photos:</label>
        <div className="d-flex flex-wrap gap-2">
          {existingPhotos.length === 0 && <p>No photos</p>}
          {existingPhotos.map(url => (
            <div key={url} style={{ position: 'relative' }}>
              <img src={process.env.REACT_APP_API_URL + url} alt="car" style={{ width: 100, height: 80, objectFit: 'cover' }} />
              <button type="button" onClick={() => handleDeleteExistingPhoto(url)} style={{
                position: 'absolute', top: 0, right: 0, background: 'red',
                color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20
              }}>x</button>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label>Brand</label>
            <select name="brandId" className="form-select" value={formData.brandId} onChange={handleBrandChange}>
              <option value="">Select brand</option>
              {brands.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label>Model</label>
            <select name="model" className="form-select" value={formData.model} onChange={handleChange} disabled={!formData.brandId}>
              <option value="">Select model</option>
              {models.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </div>
          {/* остальные поля оставляем как у тебя */}
          {/* mileage, year, engineSize, door, cylinder, price, vin, color, transmission, fuelType, driverType, condition, new photos, description */}
          <div className="col-md-4"><label>Mileage</label>
            <input type="number" name="mileage" className="form-control" value={formData.mileage} onChange={handleChange} /></div>
          <div className="col-md-4"><label>Year</label>
            <input type="number" name="year" className="form-control" value={formData.year} onChange={handleChange} /></div>
          <div className="col-md-4"><label>Engine Size</label>
            <input type="number" name="engineSize" className="form-control" value={formData.engineSize} onChange={handleChange} /></div>
          <div className="col-md-4"><label>Doors</label>
            <input type="number" name="door" className="form-control" value={formData.door} onChange={handleChange} /></div>
          <div className="col-md-4"><label>Cylinders</label>
            <input type="number" name="cylinder" className="form-control" value={formData.cylinder} onChange={handleChange} /></div>
          <div className="col-md-4"><label>Price</label>
            <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} /></div>
          <div className="col-md-4"><label>VIN</label>
            <input type="text" name="vin" className="form-control" value={formData.vin} onChange={handleChange} /></div>
          <div className="col-md-4"><label>Color</label>
            <select name="color" className="form-select" value={formData.color} onChange={handleChange}>
              <option value="">Select color</option>
              <option value="Black">Black</option><option value="White">White</option>
              <option value="Red">Red</option><option value="Blue">Blue</option>
              <option value="Gray">Gray</option><option value="Other">Other</option>
            </select></div>
          <div className="col-md-4"><label>Transmission</label>
            <select name="transmission" className="form-select" value={formData.transmission} onChange={handleChange}>
              <option value="">Select transmission</option><option value="Automatic">Automatic</option><option value="Manual">Manual</option>
            </select></div>
          <div className="col-md-4"><label>Fuel Type</label>
            <select name="fuelType" className="form-select" value={formData.fuelType} onChange={handleChange}>
              <option value="">Select fuel type</option><option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option><option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select></div>
          <div className="col-md-4"><label>Drive Type</label>
            <select name="driverType" className="form-select" value={formData.driverType} onChange={handleChange}>
              <option value="">Select drive type</option><option value="FWD">FWD</option>
              <option value="RWD">RWD</option><option value="AWD">AWD</option>
            </select></div>
          <div className="col-md-4"><label>Condition</label>
            <select name="condition" className="form-select" value={formData.condition} onChange={handleChange}>
              <option value="">Select condition</option><option value="New">New</option>
              <option value="Used">Used</option><option value="Damaged">Damaged</option>
            </select></div>
          <div className="col-md-12 mt-3"><label>New Photos (multiple)</label>
            <input type="file" multiple className="form-control" onChange={handleFileChange} /></div>
          <div className="col-md-12 mt-3"><label>Description</label>
            <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} rows={4} /></div>
        </div>
        <button type="submit" className="btn btn-primary mt-4">Save Changes</button>
      </form>
    </div>
  );
}
