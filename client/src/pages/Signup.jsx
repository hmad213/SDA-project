import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Signup.module.css";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { signup as signupService } from "../services/authService";
import Footer from "../components/Footer";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    address: "",
    phone: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Please provide your full name";
    if (!formData.city.trim()) newErrors.city = "Please provide a city";
    if (!formData.address.trim())
      newErrors.address = "Please provide an address";
    if (!formData.phone) {
      newErrors.phone = "Please provide a phone number";
    } else {
      const isNumeric = /^\d+$/.test(formData.phone);
      if (formData.phone.length != 11) {
        newErrors.phone = "Please enter a valid phone number";
      } else if (!isNumeric) {
        newErrors.phone = "Phone number must be only digits";
      }
    }
    if (!formData.username.trim())
      newErrors.username = "Please provide a username";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setServerError(null);
    try {
      const { data } = await signupService({
        name: formData.fullName,
        city: formData.city,
        address: formData.address,
        phone_number: formData.phone,
        username: formData.username,
        password: formData.password,
      });
      login(data.user, data.accessToken, data.refreshToken);
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>Signup</h1>

          {serverError && <p className={styles.errorText}>{serverError}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Full Name */}
            <div className={styles.inputGroup}>
              <label htmlFor="fullName" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={styles.input}
              />
              {errors.fullName && (
                <span className={styles.errorText}>{errors.fullName}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="city" className={styles.label}>
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={styles.input}
              />
              {errors.city && (
                <span className={styles.errorText}>{errors.city}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="address" className={styles.label}>
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={styles.input}
              />
              {errors.address && (
                <span className={styles.errorText}>{errors.address}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
              />
              {errors.phone && (
                <span className={styles.errorText}>{errors.phone}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={styles.input}
              />
              {errors.username && (
                <span className={styles.errorText}>{errors.username}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
              />
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <div className={styles.loginContainer}>
          <span className={styles.existingUser}>Already have an account? </span>
          <Link to="/Login" className={styles.loginLink}>
            Login
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
