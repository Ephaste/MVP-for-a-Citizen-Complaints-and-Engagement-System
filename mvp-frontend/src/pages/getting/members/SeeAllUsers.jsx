import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../getting/tables.css";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

export const SeeAllUsers = () => {
  const componentPDF = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [membersData, setMembersData] = useState([]);
  const recordsPerPage = 7;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          "http://localhost:200/api/users/getusers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMembersData(data);
      } catch (error) {
        console.error("Error fetching members data:", error);
      }
    };

    fetchMembers();
  }, []);

  // pagination logic
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = membersData.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(membersData.length / recordsPerPage);
  const pageNumbers = Array.from({ length: nPage }, (_, i) => i + 1);

  const prePage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const changePage = (n) => setCurrentPage(n);
  const nextPage = () => {
    if (currentPage < nPage) setCurrentPage(currentPage + 1);
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Members Table",
    onAfterPrint: () => alert("Table saved as PDF")
  });

  return (
    <div className="transactions-container">
      <section className="table__body">
        <div ref={componentPDF}>
          <h2>LIST OF ALL USERS</h2>
          <table className="center">
            <thead>
              <tr>
                <th>№</th>
                <th>Names</th>
                <th>Email</th>
                <th>ID Number</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Passport</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item, idx) => (
                <tr key={item._id} >
                  <td>{firstIndex + idx + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.idno || "—"}</td>
                  <td>{item.phone}</td>
                  <td style={{ textTransform: "capitalize" }}>{item.role}</td>
                  <td>
                    {item.photo ? (
                      <img
                        src={
                          // if stored as a full URL, use it; otherwise prefix with host
                          item.photo.startsWith("http")
                            ? item.photo
                            : `http://localhost:200/${item.photo}`
                        }
                        alt="Passport"
                        width="50"
                        height="50"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav>
          <ul className="pagination">
            <li className="page-item">
              <button className="page-link" onClick={prePage} disabled={currentPage === 1}>
                Prev
              </button>
            </li>

            {pageNumbers.map((n) => (
              <li
                key={n}
                className={`page-item ${currentPage === n ? 'active' : ''}`}
              >
                <button className="page-link" onClick={() => changePage(n)}>
                  {n}
                </button>
              </li>
            ))}

            <li className="page-item">
              <button className="page-link" onClick={nextPage} disabled={currentPage === nPage}>
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

export default SeeAllUsers;
