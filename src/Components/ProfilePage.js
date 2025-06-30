import { useState, useEffect, useContext,useRef } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Components/AuthContext';
import { LoadingOverlay } from "../Components/LoadingOverlay";
import profileImg from '../assets/image/user/user-profile-img.png';

export function ProfilePage() {
  const [key, setKey] = useState('profile');
  const { setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      console.log('Начинаем fetchProfile');
      const token = localStorage.getItem("token");

      if (!token) {
        console.error('Токен не найден в localStorage');
        setErrorMessage('Токен не найден. Пожалуйста, войдите заново.');
        return;
      }
      console.log('Токен найден:', token);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Ответ от сервера получен, статус:', response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.warn('401 Unauthorized - переходим на страницу входа');
            setErrorMessage('Неавторизованный доступ. Войдите снова.');
            setIsAuth(false);
            navigate("/login-form");
          } else {
            const errorText = await response.text();
            console.error('Ошибка от сервера:', errorText);
            setErrorMessage(`Ошибка при получении профиля: ${errorText}`);
          }
          return;
        }

        const data = await response.json();
        console.log('Данные профиля:', data);

        setFormData({
          firstName: data.name || '',
          lastName: data.surname || '',
          email: data.email || '',
          phone: data.phoneNumber || '',
          city: data.city || '',
          country: data.country || ''
        });
        setErrorMessage(''); // очищаем ошибку, если всё ок
        if (data.photoUrl) {
  const fullUrl = data.photoUrl.startsWith('http')
    ? data.photoUrl
    : `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}${data.photoUrl.startsWith('/') ? '' : '/'}${data.photoUrl}`;
  setProfileImgSrc(fullUrl);
} else {
  setProfileImgSrc(profileImg); // дефолтное
}

      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        setErrorMessage('Ошибка загрузки профиля. Проверьте соединение.');
      }
    };

    fetchProfile();
  }, [navigate, setIsAuth]);

  const handleLogout = () => {
    console.log('Вызван handleLogout');
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
      console.error('Токен не найден при сохранении');
      setErrorMessage('Токен не найден. Пожалуйста, войдите заново.');
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
        console.error('Ошибка при сохранении:', errorText);
        setErrorMessage(`Ошибка при сохранении: ${errorText}`);
        return;
      }

      alert('Данные обновлены!');
      setErrorMessage('');

    } catch (error) {
      console.error('Ошибка сети при обновлении профиля:', error);
      setErrorMessage('Ошибка сети при сохранении профиля.');
    }
  };


  //
  const [profileImgSrc, setProfileImgSrc] = useState(profileImg); // дефолт
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
      console.error('Ошибка загрузки фото:', response.statusText);
      return;
    }

    const data = await response.json();
    console.log('Ответ сервера по фото:', data);

  } catch (error) {
    console.error('Ошибка при загрузке фото', error);
  }
};



  return (
    <div className="page-wrapper d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <div className="container-lg mt-5">
          <div className="text-center mb-3 mb-md-5 d-none d-md-block">
            <h2 className="fw-bold h2 mb-1">Personal account</h2>
            <p className="body-text-size blue-4">Manage your account, car listings and articles</p>
          </div>

          <Tabs id="profileTabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
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
                    </form>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="favorites" title="Favourites">
              <div className="card shadow-sm rounded-4 p-3 p-md-4 border-0">
                <p className="mb-3 h5 text-start">Favourites</p>
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
