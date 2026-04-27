import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Login.module.css";
import Navbar from "../components/Navbar"

export default function Login(){
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>{
    const{ name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]){
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    const newErrors = {};

    if(!formData.username.trim()){
      newErrors.username = "Please enter a Username";
    }
    if(!formData.password){
      newErrors.password = "Please enter a password";
    } 
    else if(formData.password.length < 8){     
      newErrors.password = "Password must be at least 8 characters";     //min length is just for now, can be changed later
    }

    if(Object.keys(newErrors).length > 0){
      setErrors(newErrors);
      return;
    }

    console.log("Login successful (more after backend connection)", formData);
    alert("Login successful (more after backend connection)");
  };

  return(
    <>
    <Navbar />
    <div className={styles.wrapper}>
        <div className={styles.card}>
            <h1 className={styles.title}>Login</h1>

            <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.label}>Username</label>
                <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={styles.input}
                />
                {errors.username && <span className={styles.errorText}>{errors.username}</span>}
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                />
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <button type="submit" className={styles.submitBtn}>
                Log In
            </button>
            </form>

            <Link to="/help" className={styles.goldfishLink}>
                Help I'm a Goldfish
            </Link>
        </div>

        <div className={styles.signupContainer}>
            <span className={styles.newHere}>New here? </span>
            <Link to="/Signup" className={styles.signupLink}>Signup</Link>
        </div>
        </div>
    </>
    );
}