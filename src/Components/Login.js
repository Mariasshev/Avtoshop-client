import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export function Login() {
    return (
        <div className="container form-container py-5">
            {/* Вкладки */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <a className="nav-link dm-sans-medium ft-16 active" data-bs-toggle="tab" href="#sign-in">Sign in</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link dm-sans-medium ft-16" data-bs-toggle="tab" href="#register">Register</a>
                </li>
            </ul>

            <div className="tab-content">
                {/* Вкладка Sign In */}
                <div className="tab-pane fade show active" id="sign-in">
                    <form>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" />
                            <label htmlFor="floatingInput2">Email</label>
                        </div>
                        <div className="mb-3 position-relative form-floating">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                id="floatingPassword"
                            />
                            <label htmlFor="floatingPassword">Password</label>

                            <span
                                className="position-absolute end-0 top-50 translate-middle-y me-3"
                                style={{ cursor: 'pointer' }}
                                onClick={togglePassword}
                            >
        <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
      </span>
                        </div>

                        <div className="form-check mb-3">
                            <div className="row">
                                <div className="col-6">
                                    <input type="checkbox" className="form-check-input" />
                                    <label className="form-check-label dm-sans-regular ft-15">Keep me signed in</label>
                                </div>
                                <div className="col-6 text-end">
                                    <a href="#" className="dm-sans-medium ft-15 text-decoration-underline">Lost Your Password?</a>
                                </div>
                            </div>
                        </div>

                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-custom btn-block dm-sans-medium ft-15">Login</button>
                        </div>

                        <div className="or-divider dm-sans-regular ft-16">
                            <span>OR</span>
                        </div>

                        <div className="row gx-1">
                            <div className="col-6 d-grid mb-3">
                                <button type="button" className="btn btn-outline-primary social-btn social-btn-facebook dm-sans-regular ft-14 py-3">
                                    <i className="bi bi-facebook"></i> Login with Facebook
                                </button>
                            </div>
                            <div className="col-6 d-grid mb-3">
                                <button type="button" className="btn social-btn social-btn-google dm-sans-regular ft-14 py-3">
                                    <i className="bi bi-google"></i> Login with Google
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Вкладка Register */}
                <div className="tab-pane fade" id="register">
                    <form>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" />
                            <label>Full Name</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" />
                            <label>Phone number</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" />
                            <label>Email</label>
                        </div>

                        <div className="mb-3 position-relative form-floating">
                            <input type="password" className="form-control" />
                            <label>Password</label>
                            <span className="position-absolute end-0 top-50 translate-middle-x me-2">
                                <i className="bi bi-eye-slash"></i>
                            </span>
                        </div>

                        <div className="mb-3 position-relative form-floating">
                            <input type="password" className="form-control" />
                            <label>Confirm Password</label>
                            <span className="position-absolute end-0 top-50 translate-middle-x me-2">
                                <i className="bi bi-eye-slash"></i>
                            </span>
                        </div>

                        <div className="form-check mb-3">
                            <input type="checkbox" className="form-check-input" />
                            <label className="form-check-label dm-sans-regular ft-15">
                                I agree to the <a href="#" className="text-decoration-underline">Terms & Conditions</a>
                            </label>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-custom btn-block dm-sans-medium ft-15">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
