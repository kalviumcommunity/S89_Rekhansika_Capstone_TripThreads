import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const name = params.get("name");
  const email = params.get("email");
  const id = params.get("id");

  if (token && email && id) {
    // Save the user object with MongoDB id
    localStorage.setItem(
      "user",
      JSON.stringify({ name, email, token, _id:id })
    );
    navigate("/home");
  } else if (token && email) {
    // fallback: fetch profile as before
    axios
      .get("https://s89-rekhansika-capstone-tripthreads-1.onrender.com/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...res.data, token })
        );
        navigate("/home");
      })
      .catch(() => {
        localStorage.setItem(
          "user",
          JSON.stringify({ name, email, token })
        );
        navigate("/home");
      });
  } else {
    navigate("/login");
  }
}, [navigate]);

  return <div>Logging you in...</div>;
};

export default GoogleSuccess;