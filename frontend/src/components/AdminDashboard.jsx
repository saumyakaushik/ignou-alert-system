import { useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    program: "MCA",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePostAlert = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in as admin");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/alerts",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      setFormData({ title: "", description: "", date: "", program: "MCA" });

    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to post alert");
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard - Post Alert</h2>
      <form onSubmit={handlePostAlert}>
        <input type="text" name="title" placeholder="Title"
          value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description"
          value={formData.description} onChange={handleChange} required />
        <input type="date" name="date"
          value={formData.date} onChange={handleChange} required />
        <select name="program" value={formData.program} onChange={handleChange}>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
          <option value="BA">BA</option>
        </select>
        <button type="submit">Post Alert</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminDashboard;
