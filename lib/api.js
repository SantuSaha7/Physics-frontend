const BASE_URL = "http://localhost:5001/api";

async function apiFetch(url, options = {}) {
  const isPanel = window.location.pathname.startsWith("/panel");

  const token = isPanel
    ? localStorage.getItem("panel_token")
    : localStorage.getItem("token");

  // ✅ FIX 1: correct template string
  const safeUrl = url.startsWith("/") ? url : `/${url}`;

  // ✅ FIX 2: headers safe merge
  const headers = {
    ...options.headers,
  };

  // ✅ FIX 3: ONLY add Content-Type when body exists
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  // ✅ FIX 4: only attach token if exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(BASE_URL + safeUrl, {
    ...options,
    headers,
  });

  // ❌ DO NOT auto-logout on student fetch failure
  if (res.status === 401) {
    if (isPanel) {
      localStorage.removeItem("panel_token");
      window.location.href = "/panel/login";
    } else {
      // ❗ student side → just throw
      throw new Error("Unauthorized");
    }
  }

  const text = await res.text();

  if (!res.ok) {
    try {
      const json = text ? JSON.parse(text) : null;
      throw new Error(json?.message || `HTTP error ${res.status}`);
    } catch {
      throw new Error(text || `HTTP error ${res.status}`);
    }
  }

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Invalid JSON response:", e);
    throw e;
  }
}

const api = {
  get: (url) => apiFetch(url),

  post: (url, body) =>
    apiFetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (url, body) =>
    apiFetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: (url, body) =>
    apiFetch(url, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: (url) =>
    apiFetch(url, {
      method: "DELETE",
    }),
};

export default api;
