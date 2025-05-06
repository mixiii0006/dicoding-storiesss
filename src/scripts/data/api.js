import CONFIG from "../config";

const BASE_URL = CONFIG.BASE_URL;

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
}

export async function registerUser(name, email, password) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
}

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

export async function getAllStories(token, page = 1, size = 20, location = 0) {
  const url = new URL(`${BASE_URL}/stories`);
  url.searchParams.append("page", page);
  url.searchParams.append("size", size);
  url.searchParams.append("location", location);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

export async function getStoryDetail(token, id) {
  const response = await fetch(`${BASE_URL}/stories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

export async function addNewStory(
  token,
  description,
  photo,
  lat = null,
  lon = null,
) {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  if (lat !== null) formData.append("lat", lat);
  if (lon !== null) formData.append("lon", lon);

  const response = await fetch(`${BASE_URL}/stories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse(response);
}

export async function addNewStoryGuest(
  description,
  photo,
  lat = null,
  lon = null,
) {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  if (lat !== null) formData.append("lat", lat);
  if (lon !== null) formData.append("lon", lon);

  const response = await fetch(`${BASE_URL}/stories/guest`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
}

export async function subscribeNotification(token, subscription) {
  const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return handleResponse(response);
}

export async function unsubscribeNotification(token, endpoint) {
  const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ endpoint }),
  });
  return handleResponse(response);
}
