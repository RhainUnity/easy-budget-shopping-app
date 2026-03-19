// src/utils/auth.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function checkResponse(res) {
  if (!res.ok) {
    return res.json().then((err) => Promise.reject(err));
  }

  return res.json();
}

export function signup({ name, email, password }) {
  return fetch(`${BASE_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  }).then(checkResponse);
}

export function signin({ email, password }) {
  return fetch(`${BASE_URL}/users/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then(checkResponse);
}

export function checkToken(token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);
}
