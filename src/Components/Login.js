import React, { useState, useContext  } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from "./AuthContext";
import { LoadingOverlay } from "../Components/LoadingOverlay";


export function Login() {
    const [isLoading, setIsLoading] = useState(false);

    const { setIsAuth } = useContext(AuthContext);
    const [regFullName, setRegFullName] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [regConfirm, setRegConfirm] = useState("");
    const [regError, setRegError] = useState("");
    const [regSuccess, setRegSuccess] = useState("");

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginSuccess, setLoginSuccess] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };


    const navigate = useNavigate();

    const handleRegister = async (e) => {
  e.preventDefault();
  setRegError("");
  setRegSuccess("");

  // Включаем индикатор
  setIsLoading(true);
  
  // Валидация
  if (!regFullName || !regPhone || !regEmail || !regPassword || !regConfirm) {
    setRegError("All fields are required");
    setIsLoading(false);
    return;
  }
  if (regPassword !== regConfirm) {
    setRegError("Passwords do not match");
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch(/* ... */);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Registration failed");
    }
    const data = await response.json();
    // Сохраняем токен и авторизуем
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    setIsAuth(true);
    setRegSuccess(`Welcome, ${data.name}!`);

    // Переход
    setTimeout(() => navigate("/"), 1000);
  } catch (err) {
    setRegError(err.message);
  } finally {
    setIsLoading(false);
  }
};


    const handleLogin = async (e) => {
  e.preventDefault();
  setLoginError("");
  setLoginSuccess("");
  setIsLoading(true); // <--- включаем спиннер

  if (!loginEmail || !loginPassword) {
    setLoginError("Please enter email and password");
    setIsLoading(false); // <--- выключаем при ошибке
    return;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Login failed");
    }

    const data = await response.json();
    setLoginSuccess(`Welcome, ${data.name}!`);
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    setIsAuth(true);

    setTimeout(() => {
      navigate("/");
      setIsLoading(false); // <--- выключаем после редиректа
    }, 1000);
  } catch (err) {
    setLoginError(err.message);
    setIsLoading(false); // <--- выключаем при ошибке
  }
};


    return (
        <div className="container form-container py-5">
            <ul className="nav nav-tabs mb-3" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link dm-sans-medium ft-16 active" id="sign-in-tab" data-bs-toggle="tab" data-bs-target="#sign-in" type="button" role="tab">Sign in</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link dm-sans-medium ft-16" id="register-tab" data-bs-toggle="tab" data-bs-target="#register" type="button" role="tab">Register</button>
                </li>
            </ul>

            <div className="tab-content">
                {/* Sign In */}
                <div className="tab-pane fade show active" id="sign-in">
                    <form onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div className="mb-3 form-floating">
                            <input
                                type="email"
                                className="form-control"
                                id="loginEmail"
                                placeholder="Email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                            <label htmlFor="loginEmail" className="label-txt">Email</label>
                        </div>
                        <div className="mb-3 position-relative form-floating">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                id="loginPassword"
                                placeholder="Password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                            <label htmlFor="loginPassword" className="label-txt">Password</label>

                            <span
                                className="position-absolute end-0 top-50 translate-middle-y me-3"
                                style={{ cursor: 'pointer' }}
                                onClick={togglePasswordVisibility}
                            >
                            <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                            </span>
                        </div>

                        {loginError && <div className="text-danger mb-3">{loginError}</div>}
                        {loginSuccess && <div className="text-success mb-3">{loginSuccess}</div>}

                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-custom btn-block dm-sans-medium ft-15">Login</button>
                        </div>
                    </form>
                </div>

                {/* Register */}
                <div className="tab-pane fade" id="register">
                    <form onSubmit={handleRegister}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="regFullName"
                                placeholder="Full Name"
                                value={regFullName}
                                onChange={(e) => setRegFullName(e.target.value)}
                            />
                            <label htmlFor="regFullName" className="label-txt">Full Name</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="regPhone"
                                placeholder="Phone Number"
                                value={regPhone}
                                onChange={(e) => setRegPhone(e.target.value)}
                            />
                            <label htmlFor="regPhone" className="label-txt">Phone Number</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="regEmail"
                                placeholder="Email"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                            />
                            <label htmlFor="regEmail" className="label-txt">Email</label>
                        </div>

                        {/* Password */}
                        <div className="mb-3 position-relative form-floating">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                id="regPassword"
                                placeholder="Password"
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                            />
                            <label htmlFor="regPassword" className="label-txt">Password</label>
                            <span
                                className="position-absolute end-0 top-50 translate-middle-y me-3"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                            <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                            </span>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-3 position-relative form-floating">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                className="form-control"
                                id="regConfirm"
                                placeholder="Confirm Password"
                                value={regConfirm}
                                onChange={(e) => setRegConfirm(e.target.value)}
                            />
                            <label htmlFor="regConfirm" className="label-txt">Confirm Password</label>
                            <span
                                className="position-absolute end-0 top-50 translate-middle-y me-3"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowConfirm(prev => !prev)}
                            >
                            <i className={`bi ${showConfirm ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                            </span>
                        </div>

                        {regError && <div className="text-danger mb-3">{regError}</div>}
                        {regSuccess && <div className="text-success mb-3">{regSuccess}</div>}

                        <div className="d-grid">
                            <button type="submit" className="btn btn-custom btn-block dm-sans-medium ft-15">Register</button>
                        </div>
                    </form>
                </div>

                {isLoading && <LoadingOverlay text="Please wait..." />}

            </div>
        </div>
    );
}
