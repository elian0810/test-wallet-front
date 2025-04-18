import React, { useState } from "react";
import axios from "axios";

const CreateCustomer = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    document: "",
    name: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
  
    try {
      const response = await axios.post("http://127.0.0.1:80/api/customers/create", formData);
  
      if (response.data.success) {
        setSuccessMessage(response.data.messages?.[0] || "Cliente creado exitosamente.");
        setFormData({ document: "", name: "", email: "", phone: "" });
        onSuccess();
        // Esperar un poco antes de cerrar para que se vea el mensaje
        setTimeout(() => {
          setLoading(false);
          onClose();
        }, 1500);
      } else {
        setErrorMessage(response.data.messages?.[0] || "Hubo un error al crear el cliente.");
        setLoading(false);
      }
  
    } catch (error) {
      console.error("Error al crear cliente:", error);
      if (error.response?.data?.messages?.length) {
        setErrorMessage(error.response.data.messages[0]);
      } else {
        setErrorMessage("Error inesperado al crear cliente.");
      }
      setLoading(false);
    }
  };
  
  

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100%", height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "1rem",
        width: "90%",
        maxWidth: "600px",
        position: "relative"
      }}>
        <button onClick={onClose} style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "transparent",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer"
        }}>×</button>
        <h3 style={{ marginBottom: "1.5rem" }}>Crear nuevo cliente</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          name="document"
          placeholder="Documento"
          value={formData.document}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem"
          }}
        >
          Guardar Cliente
        </button>
          {loading && <p style={{ color: "#3b82f6" }}>Guardando cliente...</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateCustomer;
