import React, { useState, useEffect } from 'react';
import styles from "../auth/Auth.module.scss";
import Card from '../../components/card/Card';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const SendComplaint = () => {
  const [formData, setFormData] = useState({
    name: '',
    idno: '',
    complaint: '',
    board: '',
    status: 'pending',
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // fetch current user to fill name & idno
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const { id: userId } = jwtDecode(token);

    axios.get(`http://localhost:200/api/users/getuserbyid/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(({ data }) => {
      setUser(data);
      setFormData(fd => ({
        ...fd,
        name: data.name,
        idno:  data.idno  // adjust field if your user schema uses `regno` or `idno`
      }));
    })
    .catch(err => console.error("Error fetching user:", err));
  }, []);

  const sendComplaint = async e => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');

    // sanity-check that idno matches token-user
    if (user && user.idno !== formData.idno) {
      return setError("Identification number does not match your account.");
    }

    try {
      await axios.post(
        "http://localhost:200/api/complaints/send",
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Complaint sent successfully!");
      window.location.href = "/dashboardclient";
    } catch (err) {
      const msg = err.response?.data?.error
        || "An error occurred while sending your complaint.";
      setError(msg);
      console.error("Send complaint error:", err.response || err);
    }
  };

  return (
    <section className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2>SEND A COMPLAINT</h2>
          {error && <div className="alert alert-danger" style={{ color: 'red' }}>{error}</div>}
          <form onSubmit={sendComplaint}>
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={formData.name}
              readOnly
            />

            <input
              type="text"
              name="idno"
              placeholder="Your ID Number"
              value={formData.idno}
              readOnly
            />
           <div>
              <p>Board:</p>
              <select
                name="board"
                value={formData.board}
                onChange={handleChange}
                required
              >
                <option value="">-- Select board you send to --</option>
                <option value="reb">REB</option>
                <option value="rab">RAB</option>
                <option value="rgb">RGB</option>
                <option value="rdb">RDB</option>
                <option value="rmb">RMB</option>
                <option value="rura">RURA</option>
              </select>
            </div>
            <textarea
              name="complaint"
              placeholder="Describe your complaint"
              value={formData.complaint}
              onChange={handleChange}
              required
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Send Complaint
            </button>
          </form>
        </div>
      </Card>
    </section>
  );
};

export default SendComplaint;
