import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { login as loginService } from "../services/authService";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
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

    if (!formData.username.trim()) {
      newErrors.username = "Please enter a Username";
    }
    if (!formData.password) {
      newErrors.password = "Please enter a password";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"; //min length is just for now, can be changed later
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setServerError(null);
    try {
      const { data } = await loginService(formData);
      login(data.user, data.accessToken, data.refreshToken);
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>Login</h1>

          {serverError && <p className={styles.errorText}>{serverError}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
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
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <Link to="/help" className={styles.goldfishLink}>
            Help I'm a Goldfish
          </Link>
        </div>

        <div className={styles.signupContainer}>
          <span className={styles.newHere}>New here? </span>
          <Link to="/Signup" className={styles.signupLink}>
            Signup
          </Link>
        </div>
      </div>
    </>
  );
}
