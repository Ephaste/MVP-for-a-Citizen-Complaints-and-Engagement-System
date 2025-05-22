import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";

export const ClientComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const componentPDF = useRef();

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:200/api/complaints/getclientcomplaints",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComplaints(res.data);
      } catch (err) {
        console.error("Error fetching your complaints:", err);
      }
    };
    fetchMyComplaints();
  }, []);

  // pagination
  const lastIdx = currentPage * recordsPerPage;
  const firstIdx = lastIdx - recordsPerPage;
  const current = complaints.slice(firstIdx, lastIdx);
  const nPage = Math.ceil(complaints.length / recordsPerPage);
  const pages = Array.from({ length: nPage }, (_, i) => i + 1);

  const prev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const next = () => setCurrentPage(p => Math.min(p + 1, nPage));
  const goTo = n => setCurrentPage(n);

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "My Complaints",
    onAfterPrint: () => alert("Saved as PDF"),
  });

  return (
    <div className="transactions-container">
      <section className="table__body" ref={componentPDF}>
        <h2>My Complaints</h2>
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
              <tr key={c._id}>
                <td>{firstIdx + i + 1}</td>
                <td>{c.name}</td>
                <td>{c.idno || "—"}</td>
                <td>{c.complaint}</td>
                <td>{c.paymentWay}</td>
                <td style={{ textTransform: "capitalize" }}>{c.status}</td>
                <td style={{ textTransform: "uppercase" }}>{c.board}</td>
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
            <li key={n} className={`page-item ${currentPage === n ? "active" : ""}`}>
              <button onClick={() => goTo(n)} className="page-link">
                {n}
              </button>
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

export default ClientComplaintsPage;
