import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

export const ComplaintsPage = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const navigate = useNavigate();
  const componentPDF = useRef();

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://localhost:200/api/complaints/agent',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (err) {
        console.error('Error fetching complaints:', err);
      }
    };
    fetch();
  }, []);

  // Pagination
  const lastIdx = currentPage * recordsPerPage;
  const firstIdx = lastIdx - recordsPerPage;
  const current = data.slice(firstIdx, lastIdx);
  const nPage = Math.ceil(data.length / recordsPerPage);
  const pages = Array.from({ length: nPage }, (_, i) => i + 1);

  const prev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const next = () => setCurrentPage(p => Math.min(p + 1, nPage));
  const goTo = n => setCurrentPage(n);

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Complaints Table',
    onAfterPrint: () => alert('Saved as PDF'),
  });

  // Pass entire complaint object in state, NOT just name and complaint
  const handleRowClick = (complaint) => {
    navigate('/dashboardagent/respond', { state: { complaint } });
  };

  return (
    <div className="transactions-container">
      <section className="table__body" ref={componentPDF}>
        <table className="center">
          <thead>
            <tr>
              <th>№</th>
              <th>Name</th>
              <th>ID No.</th>
              <th>Complaint</th>
              <th>Payment Way</th>
              <th>Status</th>
              <th>Board</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {current.map((c, i) => (
              <tr
                key={c._id}
                onClick={() => handleRowClick(c)}
                style={{ cursor: 'pointer' }}
              >
                <td>{firstIdx + i + 1}</td>
                <td>{c.name}</td>
                <td>{c.idno || '—'}</td>
                <td>{c.complaint}</td>
                <td>{c.paymentWay}</td>
                <td style={{ textTransform: 'capitalize' }}>{c.status}</td>
                <td style={{ textTransform: 'uppercase' }}>{c.board}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <nav>
        <ul className="pagination">
          <li className="page-item">
            <button onClick={prev} disabled={currentPage === 1} className="page-link">
              Prev
            </button>
          </li>

          {pages.map(n => (
            <li key={n} className={`page-item ${currentPage === n ? 'active' : ''}`}>
              <button onClick={() => goTo(n)} className="page-link">{n}</button>
            </li>
          ))}

          <li className="page-item">
            <button onClick={next} disabled={currentPage === nPage} className="page-link">
              Next
            </button>
          </li>

          <li className="page-item">
            <button onClick={generatePDF} className="--btn --btn-primary --btn-block">
              PDF
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ComplaintsPage;
