import React, { useState } from "react";
import axios from "axios";

const DebtCreditLine = ({ data, onClose }) => {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleConfirmPayment = async () => {
    if (!email || isNaN(token)) {
        setMessage("Por favor ingresa un valor válido.");
        setIsError(true);
        return;
    }
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await axios.post("http://127.0.0.1:80/api/credit-lines/debt-credit-line", {
        session_id: data.uuid,
        token: token,
        email: email
      });

      if (res.data.success) {
        setMessage("Pago confirmado correctamente.");
        setIsError(false);
      } else {
        setMessage(res.data.messages?.[0] || "Error al confirmar el pago.");
        setIsError(true);
      }
    } catch (err) {
      const backendMessage = err.response?.data?.messages?.[0];
      setMessage(backendMessage || "Error de conexión con el servidor.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0,
      width: "100%", height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "#fff", padding: "2rem", borderRadius: "1rem",
        maxWidth: "600px", width: "90%", position: "relative"
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "1rem", right: "1rem",
          background: "transparent", border: "none", fontSize: "1.5rem"
        }}>×</button>

        <h3>Confirmar pago de {data.name}</h3>
        <p><strong>Documento:</strong> {data.document}</p>
        <p><strong>Deuda total:</strong> {data.total_debt}</p>
        <hr style={{ margin: "1rem 0" }} />

        <div style={{ marginTop: "1rem" }}>
          <label><strong>Email:</strong></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              marginBottom: "1rem",
              borderRadius: "0.375rem",
              border: "1px solid #ccc"
            }}
          />

          <label><strong>Token:</strong></label>
          <input
            type="number"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              borderRadius: "0.375rem",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <button
          onClick={handleConfirmPayment}
          disabled={loading}
          style={{
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            marginTop: "1rem",
            cursor: "pointer"
          }}
        >
          {loading ? "Confirmando..." : "Confirmar Pago"}
        </button>

        {message && (
          <p style={{
            marginTop: "1rem",
            color: isError ? "red" : "green"
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default DebtCreditLine;
