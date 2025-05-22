import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../auth/Auth.module.scss';
import Card from '../../components/card/Card';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Respond = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const complaint = location.state?.complaint;

  const [agentName, setAgentName] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  // **Always call hooks at the top level!**
  useEffect(() => {
    const fetchAgentName = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated.');
        return;
      }
      try {
        const { id: userId } = jwtDecode(token);
        const res = await axios.get(`http://localhost:200/api/users/getuserbyid/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAgentName(res.data.name);
      } catch (err) {
        setError('Failed to load agent profile.');
      }
    };
    fetchAgentName();
  }, []);

  // **Only after hooks come conditional returns**
  if (!complaint) {
    return (
      <section className={`container ${styles.auth}`}>
        <Card>
          <div>
            <h2>No complaint selected</h2>
            <p>Please go back and select a complaint to respond to.</p>
            <button className="--btn --btn-primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </Card>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!response.trim()) {
      setError('Response cannot be empty.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:200/api/responses/respond',
        { complaintId: complaint._id, response },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Response submitted successfully.');
      navigate('/dashboardagent');
    } catch {
      setError('Failed to submit response. Please try again.');
    }
  };

  return (
    <section className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2>RESPOND TO COMPLAINT</h2>
          {error && <div className="alert alert-danger" style={{ color: 'red' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <label>Agent Name</label>
            <input type="text" value={agentName} readOnly className="--btn-block" />

            <label>Complaint By</label>
            <input type="text" value={complaint.name} readOnly className="--btn-block" />

            <label>Complaint</label>
            <textarea value={complaint.complaint} readOnly rows={4} className="--btn-block" />

            <label>Your Response</label>
            <textarea
              name="response"
              placeholder="Type your response here"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              required
              className="--btn-block"
            />

            <button className="--btn --btn-primary --btn-block" type="submit">
              Send Response
            </button>
          </form>
        </div>
      </Card>
    </section>
  );
};

export default Respond;
