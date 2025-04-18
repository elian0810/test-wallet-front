import React, { useEffect, useState } from "react";
import axios from "axios";
import '../app.css'; // o '../css/tailwind.css'

const CreditLinesTable = () => {
  const [creditLines, setCreditLines] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1/api/credit-lines?paginate=true&page=${pageNumber}`
      );
      setCreditLines(res.data.data.data);
      setPagination(res.data.data);
    } catch (error) {
      console.error("Error fetching credit lines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handlePrev = () => {
    if (pagination.current_page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (pagination.current_page < pagination.last_page) {
      setPage((prev) => prev + 1);
    }
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
    }).format(value);
  };
  return (
    <div className="credit-table-container">
      <h2>Billeteras</h2>
      <table className="credit-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Balance</th>
            <th>Deuda Total</th>
            <th>Consumo Total</th>
            <th>Documento</th>
            <th>Email</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {creditLines.map((line) => (
            <tr key={line.id}>
              <td>{line.id}</td>
              <td>{line.name}</td>
              <td><span className="positive">{formatCurrency(line.balance)}</span></td>
              <td><span className="negative">{formatCurrency(line.total_debt)}</span></td>
              <td>{formatCurrency(line.total_consumption)}</td>
              <td>{line.document}</td>
              <td>{line.email}</td>
              <td>{line.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <div className="pagination">
        <button onClick={handlePrev} disabled={pagination.current_page === 1}>Anterior</button>
        <span>Página {pagination.current_page} de {pagination.last_page}</span>
        <button onClick={handleNext} disabled={pagination.current_page === pagination.last_page}>Siguiente</button>
      </div>
    </div>
  );
  
};

export default CreditLinesTable;
