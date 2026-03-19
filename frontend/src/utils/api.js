// src/utils/api.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("jwt");
}

function checkResponse(res) {
  if (res.ok) {
    if (res.status === 204) return null;
    return res.json();
  }

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json().then((err) => Promise.reject(err));
  }

  return res.text().then((text) =>
    Promise.reject({
      message: text || `Request failed with status ${res.status}`,
      statusCode: res.status,
    }),
  );
}

export function updateCurrentUser(data) {
  return fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(checkResponse);
}

export function getItems() {
  return fetch(`${BASE_URL}/items`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);
}

export function createItem(itemData) {
  return fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  }).then(checkResponse);
}

export function deleteItem(itemId) {
  return fetch(`${BASE_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);
}

export function updateItem(itemId, itemData) {
  return fetch(`${BASE_URL}/items/${itemId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  }).then(checkResponse);
}

export function fetchAveragePrice(query) {
  return fetch(
    `${BASE_URL}/pricing/average-price?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    },
  ).then(checkResponse);
}
