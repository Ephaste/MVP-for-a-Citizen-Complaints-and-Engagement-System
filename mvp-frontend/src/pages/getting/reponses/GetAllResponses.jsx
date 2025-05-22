// src/pages/GetAllResponses.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

const GetAllResponses = () => {
  const componentPDF = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [responses, setResponses] = useState([]);
  const recordsPerPage = 7;

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:200/api/responses/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResponses(data);
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };
    fetchResponses();
  }, []);

  // Pagination
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = responses.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(responses.length / recordsPerPage);
  const pageNumbers = Array.from({ length: nPage }, (_, i) => i + 1);

  const prev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goTo = (n) => setCurrentPage(n);
  const next = () => setCurrentPage((p) => Math.min(p + 1, nPage));

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Responses Table",
    onAfterPrint: () => alert("Table saved as PDF"),
  });

  return (
    <div className="transactions-container">
      <section className="table__body">
        <div ref={componentPDF}>
          <h2>ALL RESPONSES (Admin View)</h2>
          <table className="center">
            <thead>
              <tr>
                <th>№</th>
                <th>Agent Name</th>
                <th>User (Responder)</th>
                <th>Complaint</th>
                <th>Response</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((r, idx) => (
                <tr key={r._id}>
                  <td>{firstIndex + idx + 1}</td>
                  <td>{r.name}</td>
                  <td>
                    {r.responseOwner?.name || "—"}<br/>
                    <small>{r.responseOwner?.email || ""}</small>
                  </td>
                  <td style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                    {r.complaint?.complaint || "—"}
                  </td>
                  <td style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                    {r.response}
                  </td>
                  <td>
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav>
          <ul className="pagination">
            <li className="page-item">
              <button onClick={prev} disabled={currentPage === 1} className="page-link">
                Prev
              </button>
            </li>

            {pageNumbers.map((n) => (
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
              <button
                className="--btn --btn-primary --btn-block"
                onClick={generatePDF}
              >
                PDF
              </button>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  );
};

export default GetAllResponses;
