  import React, { useState } from "react";
  import axios from "axios";

  const BalanceCreditLine = ({ data, onClose, onSuccess  }) => {
    const [extraBalance, setExtraBalance] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSendBalance = async () => {
      if (!extraBalance || isNaN(extraBalance)) {
        setMessage("Por favor ingresa un valor válido.");
        setIsError(true);
        return;
      }

      setLoading(true);
      setMessage("");
      setIsError(false);

      try {
        const res = await axios.post("http://127.0.0.1:80/api/credit-lines/send-balane", {
          document: data.document,
          phone: data.phone,
          balance: extraBalance,
        });

        if (res.data.success) {
          setMessage("Saldo enviado con éxito.");
          if (onSuccess) onSuccess();  
          setIsError(false);
          setExtraBalance(""); // limpiar input
        } else {
          setMessage(res.data.messages?.[0] || "Error al enviar el saldo.");
          setIsError(true);
        }
      } catch (err) {
        const backendMessage = err.response?.data?.messages?.[0];
        setMessage(backendMessage || "Error en la conexión con el servidor.");
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

          <h3>Aumentar saldo de {data.name}</h3>
          <p><strong>Documento:</strong> {data.document}</p>
          <p><strong>Teléfono:</strong> {data.phone}</p>

          <hr style={{ margin: "1rem 0" }} />

          <label><strong>Agregar Saldo:</strong></label>
          <input
            type="number"
            value={extraBalance}
            onChange={(e) => setExtraBalance(e.target.value)}
            placeholder="Ingresa el valor"
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              borderRadius: "0.375rem",
              border: "1px solid #ccc"
            }}
          />

          <button
            onClick={handleSendBalance}
            disabled={loading}
            style={{
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              cursor: "pointer"
            }}
          >
            {loading ? "Enviando..." : "Enviar Saldo"}
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

  export default BalanceCreditLine;
