import { useState, useEffect, useContext, useRef } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { AuthContext } from '../Components/AuthContext';
import { LoadingOverlay } from "../Components/LoadingOverlay";
import profileImg from '../assets/image/user/user-profile-img.png';
import { MyListingItem } from '../Components/MyListingItem.js';
import { FavoritesContext } from '../context/FavoritesContext';
import { CarCardPattern } from '../Components/CarCardPattern';
import { useSearchParams } from 'react-router-dom';

export function ProfilePage() {
  const [key, setKey] = useState('profile');
  const { setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [allCars, setAllCars] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cars`);
        if (!response.ok) throw new Error('Failed to load cars');
        const data = await response.json();
        setAllCars(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCars();
  }, []);

  const favoriteCars = allCars.filter(car => favorites.includes(car.id));

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tabFromQuery = searchParams.get('tab');
    if (tabFromQuery) {
      setKey(tabFromQuery);
    }
  }, [searchParams]);

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch('https://localhost:7141/api/CarBrands')
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.error(err));
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage('Token not found. Please login again.');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            setErrorMessage('Unauthorized access. Please login again.');
            setIsAuth(false);
            navigate("/login-form");
          } else {
            const errorText = await response.text();
            setErrorMessage(`Error fetching profile: ${errorText}`);
          }
          return;
        }

        const data = await response.json();

        setFormData({
          firstName: data.name || '',
          lastName: data.surname || '',
          email: data.email || '',
          phone: data.phoneNumber || '',
          city: data.city || '',
          country: data.country || ''
        });
        setErrorMessage('');
        if (data.photoUrl) {
          const fullUrl = data.photoUrl.startsWith('http')
            ? data.photoUrl
            : `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}${data.photoUrl.startsWith('/') ? '' : '/'}${data.photoUrl}`;
          setProfileImgSrc(fullUrl);
        } else {
          setProfileImgSrc(profileImg);
        }

      } catch (error) {
        setErrorMessage('Failed to load profile. Check your connection.');
      }
    };

    fetchProfile();
  }, [navigate, setIsAuth]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setIsAuth(false);
    setTimeout(() => {
      navigate("/login-form");
      setIsLoggingOut(false);
    }, 1000);
  };

  const handleSaveClick = () => {
    setShowModal(true);
  };

  const confirmSave = async () => {
    setShowModal(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage('Token not found. Please login again.');
      return;
    }

    const payload = {
      name: formData.firstName,
      surname: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phone,
      city: formData.city,
      country: formData.country
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(`Save error: ${errorText}`);
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile data updated!'
      });
      setErrorMessage('');

    } catch (error) {
      setErrorMessage('Network error while saving profile.');
    }
  };

  const [profileImgSrc, setProfileImgSrc] = useState(profileImg);
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token missing');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile/photo`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        console.error('Photo upload error:', response.statusText);
        return;
      }

      const data = await response.json();
      console.log('Photo upload response:', data);

    } catch (error) {
      console.error('Photo upload error', error);
    }
  };

  const [passwordError, setPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const handleChangePassword = async () => {
    setPasswordError('');
    setNewPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setNewPasswordError('New passwords do not match');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Token not found. Please login again.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes('Current password incorrect')) {
          setPasswordError('Current password is incorrect');
        } else {
          setErrorMessage(`Password change error: ${errorText}`);
        }
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password changed successfully!'
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setPasswordError('');
      setNewPasswordError('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Network error during password change.');
    }
  };

  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [listingsError, setListingsError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setListingsError('Token not found. Please login again.');
        return;
      }

      setLoadingListings(true);
      setListingsError('');

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/user-cars`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          setListingsError(`Error loading listings: ${errorText}`);
          setListings([]);
          return;
        }

        const data = await response.json();
        setListings(data);
      } catch (error) {
        setListingsError('Network error loading listings');
        setListings([]);
      } finally {
        setLoadingListings(false);
      }
    };

    fetchListings();
  }, []);

  const handleEdit = (id) => {
    navigate(`/cars/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this listing?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/cars/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setListings(prev => prev.filter(item => item.id !== id));
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The listing has been deleted.'
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the listing.'
          });
        }
      } catch (err) {
        await Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: err.message
        });
      }
    }
  };
  // логика удаления

  return (
    <div className="page-wrapper d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <div className="container-lg mt-5 mb-4">
          <div className="text-center mb-3 mb-md-5 d-none d-md-block">
            <h2 className="fw-bold h2 mb-1">Personal account</h2>
            <p className="body-text-size blue-4">Manage your account, car listings and articles</p>
          </div>

          <Tabs id="profileTabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">

            {/* </Tabs><Tabs id="profileTabs" activeKey={key} onSelect={setKey} className="mb-3"> */}
            <Tab eventKey="profile" title="Profile">
              <div className="card shadow-sm rounded-4 p-3 p-md-4 border-0">
                <div className="row g-4">
                  <div className="col-md-4 text-center d-flex justify-content-center">
                    <div className='profile-img'>
                      <img src={profileImgSrc} className="rounded-circle mb-3" alt="Profile" />
                      <div>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => fileInputRef.current.click()}
                        >
                          Change photo
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>

                  </div>

                  <div className="col-md-8">

                    <p className="fw-semibold">Your profile</p>
                    <hr className="mb-4" />
                    <form>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />

                        </div>
                        <div className="col-md-6">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Country</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="mt-4 text-center text-md-end">
                        <button
                          type="button"
                          className="btn btn-danger px-3 py-2 fw-regular me-1"
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-left me-1"></i> Logout
                        </button>

                        <button
                          type="button"
                          className="btn btn-primary px-3 py-2 fw-semibold"
                          onClick={handleSaveClick}
                        >
                          Save changes
                        </button>
                      </div>


                      <p className="fw-semibold mt-5">Change Password</p>
                      <hr className="mb-4" />

                      <div className="row g-3">
                        <div className="col-md-12">
                          <label className="form-label">Current Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={passwordData.currentPassword}
                            onChange={(e) => {
                              setPasswordData({ ...passwordData, currentPassword: e.target.value });
                              setPasswordError('');
                            }}
                          />
                          {passwordError && (
                            <div className="text-danger small mt-1">{passwordError}</div>
                          )}
                        </div>


                        <div className="col-md-6">
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={passwordData.newPassword}
                            onChange={(e) => {
                              setPasswordData({ ...passwordData, newPassword: e.target.value });
                              setNewPasswordError('');
                            }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Confirm New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            value={passwordData.confirmNewPassword}
                            onChange={(e) => {
                              setPasswordData({ ...passwordData, confirmNewPassword: e.target.value });
                              setNewPasswordError('');
                            }}
                          />
                        </div>
                        {newPasswordError && (
                          <div className="text-danger small mt-1">{newPasswordError}</div>
                        )}

                      </div>

                      <div className="mt-3 text-end">
                        <button
                          type="button"
                          className="btn btn-warning px-3 py-2 fw-semibold"
                          onClick={handleChangePassword}
                        >
                          Change Password
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="favorites" title="Favourites">
              <div className="card shadow-sm rounded-4 p-3 p-md-4 border-0">
                <p className="mb-3 h5 text-start">Favourites</p>

                {favoriteCars.length === 0 && <p>You have no favorites yet.</p>}

                <div className="row">
                  {favoriteCars.map(car => (
                    <div key={car.id} className="col-md-4 mb-3">
                      <CarCardPattern car={car} />
                    </div>
                  ))}
                </div>
              </div>
            </Tab>

            <Tab eventKey="listings" title="My Listings">
              <div className="card shadow-sm rounded-4 p-3 p-md-4 border-0">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">My Listings</h5>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/add-listing')}
                  >
                    <i className="bi bi-plus-lg me-1"></i> Add Listing
                  </button>
                </div>

                {loadingListings && <p>Загрузка объявлений...</p>}
                {listingsError && <p className="text-danger">{listingsError}</p>}

                {!loadingListings && !listingsError && (
                  <>
                    <div className="d-none d-md-block">
                      <div className="table-responsive">
                        <table className="table align-middle">
                          <thead>
                            <tr>
                              <th scope="col">Updated</th>
                              <th scope="col">Photo</th>
                              <th scope="col">Title</th>
                              <th scope="col">Price</th>
                              <th scope="col">Status</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listings.map(listing => (
                              <MyListingItem
                                key={listing.id}
                                listing={listing}
                                brands={brands}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Mobile view */}
                    <div className="d-md-none">
                      {listings.map(listing => (
                        <MyListingItem
                          key={listing.id}
                          listing={listing}
                          brands={brands}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Tab>

          </Tabs>


          {isLoggingOut && <LoadingOverlay text="Logging out..." />}
          {showModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Подтвердите изменения</h5>
                    <button className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <p>Вы уверены, что хотите сохранить изменения?</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Отмена</button>
                    <button className="btn btn-primary" onClick={confirmSave}>Да, сохранить</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
