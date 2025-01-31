import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import AuthService from "../services/AuthService";

export function AuthRedirect(props) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [check, setCheck] = useState("pending");

  useEffect(() => {
    if (user?.token) {
      AuthService.authenticated(user?.token)
        .then((response) => {
          setCheck(response.data.auth ? "success" : "failed");
        })
        .catch(() => {
          setCheck("failed");
        });
    } else {
      setCheck("failed");
    }
  }, [navigate]);

  switch (check) {
    case "pending":
      // tri-state breaks the route loop
      return;
    case "success":
      return user?.role_name === "Admin" ? <Navigate to="/users" /> : <Navigate to="/users" />;
    case "failed":
      return <Outlet {...props} />;
  }
}

export function Authenticated(props) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [check, setCheck] = useState("pending");

  useEffect(() => {
    if (user?.token) {
      AuthService.authenticated(user?.token)
        .then((response) => {
          setCheck(response.data.auth ? "success" : "failed");
        })
        .catch(() => {
          setCheck("failed");
        });
    } else {
      setCheck("failed");
    }
  }, [navigate]);

  switch (check) {
    case "pending":
      // tri-state breaks the route loop
      return;
    case "success":
      return <Outlet {...props} />;
    case "failed":
      return <Navigate to="/login" />;
  }
}
