import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [alerts, setAlerts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    program: "",
    date: "",
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (user.role === "student") {
      fetchAlerts();
    }
  }, []);

  const fetchAlerts = async () => {
    const response = await axios.get("https://ignou-alert-backend.onrender.com/api/alerts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Optional: filter by program
    const filtered = response.data.filter(
      (alert) => alert.program === user.program
    );

    setAlerts(filtered);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();

    await axios.post(
      "https://ignou-alert-backend.onrender.com/api/alerts",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Alert Created!");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome, {user.name}</h2>
        <p><strong>Role:</strong> {user.role}</p>

        {user.role === "admin" && (
          <>
            <h3>Create Alert</h3>
            <form onSubmit={handleCreateAlert}>
              <input
                name="title"
                placeholder="Title"
                onChange={handleChange}
                required
              />

              <input
                name="description"
                placeholder="Description"
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="date"
                onChange={handleChange}
                required
              />

              <input
                name="program"
                placeholder="Program (MCA/BCA)"
                onChange={handleChange}
                required
              />

              <button type="submit">Post Alert</button>
            </form>
          </>
        )}

        {user.role === "student" && (
          <>
            <h3>Your Alerts</h3>
            {alerts.length === 0 ? (
              <p>No alerts available</p>
            ) : (
              alerts.map((alert) => (
                <div key={alert._id} className="dashboard">
                  <h4>{alert.title}</h4>
                  <p>{alert.description}</p>
                  <p><strong>Date:</strong> {new Date(alert.date).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </>
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;