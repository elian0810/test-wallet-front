import BalanceCredirLine from "../components/forms/credirLine/BalanceCredirLine"; 
import DebtCreditLine from "../components/forms/credirLine/DebtCreditLine";
import CreateCustomer from "../components/forms/customer/CreateCustomer"; 
import GenerateToken from "../components/forms/credirLine/GenerateToken"; 
import React, { useEffect, useState } from "react";
import axios from "axios";
import '../app.css';

const CreditLinesTable = () => {
  const [creditLines, setCreditLines] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedToNotify, setSelectedToNotify] = useState(null);
  const [selectedToConfirm, setSelectedToConfirm] = useState(null);

  const [filterDocument, setFilterDocument] = useState("");
  const [filterPhone, setFilterPhone] = useState("");

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      let url = `http://127.0.0.1/api/credit-lines?paginate=true&page=${pageNumber}`;

      if (filterDocument && filterPhone) {
        url = `http://127.0.0.1/api/credit-lines?phone=${filterPhone}&document=${filterDocument}`;
      }

      const res = await axios.get(url);

      if (filterDocument && filterPhone) {
        setCreditLines(res.data.data);
        setPagination({ current_page: 1, last_page: 1 });
      } else {
        setCreditLines(res.data.data.data);
        setPagination(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching credit lines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBalance = (line) => setSelectedLine(line);
  const handleNotifyPayment = (line) => setSelectedToNotify(line);
  const handleConfirmPayment = (line) => setSelectedToConfirm(line);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handlePrev = () => {
    if (pagination.current_page > 1) setPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (pagination.current_page < pagination.last_page) setPage(prev => prev + 1);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const btnStyle = {
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  return (
    <div className="credit-table-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Billeteras</h2>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "0.5rem 1rem",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer"
          }}
        >
          Crear Cliente
        </button>
      </div>

      {showForm && (
        <CreateCustomer
          onClose={() => setShowForm(false)}
          onSuccess={() => fetchData(page)}
        />
      )}

      {/* Filtros */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Documento"
          value={filterDocument}
          onChange={(e) => setFilterDocument(e.target.value)}
          style={{ padding: "0.5rem", width: "200px" }}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={filterPhone}
          onChange={(e) => setFilterPhone(e.target.value)}
          style={{ padding: "0.5rem", width: "200px" }}
        />
        <button
          onClick={() => {
            setPage(1);
            fetchData(1);
          }}
          disabled={!filterDocument || !filterPhone}
          style={{
            padding: "0.5rem 1rem",
            background: (!filterDocument || !filterPhone) ? "#ccc" : "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: (!filterDocument || !filterPhone) ? "not-allowed" : "pointer"
          }}
        >
          Buscar
        </button>
        
        <button
          onClick={() => {
            setFilterDocument("");
            setFilterPhone("");
            setPage(1);
            fetchData(1);
          }}
          style={{
            padding: "0.5rem 1rem",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer"
          }}
        >
          Limpiar
        </button>
      </div>


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
            <th>Acciones</th>
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
              <td>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                  <button
                    title="Aumentar saldo"
                    onClick={() => handleBalance(line)}
                    style={btnStyle}
                  >
                    <span role="img" aria-label="Aumentar saldo">⬆️</span>
                  </button>
                  <button
                    title="Notificar pago"
                    onClick={() => handleNotifyPayment(line)}
                    style={btnStyle}
                  >
                    <span role="img" aria-label="Notificar pago">💳</span>
                  </button>
                  <button
                    title="Confirmar pago"
                    onClick={() => handleConfirmPayment(line)}
                    style={btnStyle}
                  >
                    <span role="img" aria-label="Confirmar pago">🧾</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLine && (
        <BalanceCredirLine
          data={selectedLine}
          onClose={() => setSelectedLine(null)}
          onSuccess={() => {
            fetchData(page);
            setSelectedLine(null);
          }}
        />
      )}

      {selectedToNotify && (
        <GenerateToken
          data={selectedToNotify}
          onClose={() => setSelectedToNotify(null)}
          onSuccess={() => {
            fetchData(page);
            setSelectedToNotify(null);
          }}
        />
      )}

      {selectedToConfirm && (
        <DebtCreditLine
          data={selectedToConfirm}
          onClose={() => setSelectedToConfirm(null)}
          onSuccess={() => {
            fetchData(page);
            setSelectedToConfirm(null);
          }}
        />
      )}


      <div className="pagination">
        <button onClick={handlePrev} disabled={pagination.current_page === 1}>Anterior</button>
        <span>Página {pagination.current_page} de {pagination.last_page}</span>
        <button onClick={handleNext} disabled={pagination.current_page === pagination.last_page}>Siguiente</button>
      </div>
    </div>
  );
};

export default CreditLinesTable;
