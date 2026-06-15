const BASE_URL = '/api/items';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const itemsApi = {
  getAll: () =>
    fetch(BASE_URL).then(handleResponse),

  getById: (id) =>
    fetch(`${BASE_URL}/${id}`).then(handleResponse),

  create: (body) =>
    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  update: (id, body) =>
    fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  remove: (id) =>
    fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(handleResponse),
};
