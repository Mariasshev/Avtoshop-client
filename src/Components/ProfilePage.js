import { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

export function ProfilePage() {
  const [key, setKey] = useState('profile');

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
              {/* Профиль */}
              <div className="card shadow-sm rounded-4 p-3 p-md-4 border-0">
                <div className="row g-4">
                  <div className="col-md-4 text-center">
                    <img src="../images/news/icon/user.svg" className="rounded-circle mb-3 profile-img" alt="Profile`s photo" />
                    <div>
                      <button className="btn btn-outline-primary btn-sm">Change photo</button>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <form>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">First Name</label>
                          <input type="text" className="form-control" placeholder="Enter your name" />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Last Name</label>
                          <input type="text" className="form-control" placeholder="Enter your last name" />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-control" placeholder="Enter email" />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone</label>
                          <input type="text" className="form-control" placeholder="Enter your phone number" />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">City</label>
                          <input type="text" className="form-control" placeholder="Enter your city" />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Country</label>
                          <input type="text" className="form-control" placeholder="Enter your country" />
                        </div>
                      </div>
                      <div className="mt-4 text-center text-md-end">
                        <button className="btn btn-danger px-3 py-2 fw-regular me-1"><i class="bi bi-box-arrow-left me-1"></i> Logout</button>
                        <button className="btn btn-primary px-3 py-2 fw-semibold">Save changes</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="favorites" title="Favourites">
              <div className="card shadow-sm rounded-4 p-3 p-md-4 border-0">
                <p className="mb-3 h5 text-start">Favourites</p>
                {/* <div className="row">
                  {[...Array(6)].map((_, i) => (
                    <div className="col-12 col-sm-6 col-md-3" key={i}>
                      <CarCard />
                    </div>
                  ))}
                </div> */}
              </div>
            </Tab>


          </Tabs>
        </div>
      </main>
    </div>
  );
}