import React, { useState } from "react";
import axios from "axios";

const GenerateToken = ({ data, onClose }) => {
  const [email, setEmail] = useState(null);
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleNotify = async () => {
    if (!email || !amount || isNaN(amount)) {
      setMessage("Por favor completa los campos correctamente.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await axios.post("http://127.0.0.1:80/api/credit-lines/generate-token-total-debt", {
        document: data.document,
        phone: data.phone,
        email: email,
        total_debt: amount
      });

      if (res.data.success) {
        const baseMessage = res.data.messages?.[0] || "Pago notificado correctamente el id de la seson es .";
        const sessionId = res.data.data?.session_id;
        setMessage(`${baseMessage} (ID de sesión: ${sessionId})`);
        setIsError(false);
      } else {
        setMessage(res.data.messages?.[0] || "Error al notificar el pago.");
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

        <h3>Notificar pago de {data.name}</h3>
        <p><strong>Documento:</strong> {data.document}</p>
        <p><strong>Teléfono:</strong> {data.phone}</p>
        <hr style={{ margin: "1rem 0" }} />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          style={{
            width: "100%", padding: "0.5rem", marginBottom: "1rem",
            borderRadius: "0.375rem", border: "1px solid #ccc"
          }}
        />

        <label>Total a Pagar</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto"
          style={{
            width: "100%", padding: "0.5rem", marginBottom: "1rem",
            borderRadius: "0.375rem", border: "1px solid #ccc"
          }}
        />

        <button
          onClick={handleNotify}
          disabled={loading}
          style={{
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            marginTop: "0.5rem",
            cursor: "pointer"
          }}
        >
          {loading ? "Enviando..." : "Notificar Pago"}
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

export default GenerateToken;
