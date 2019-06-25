export function fetchCreateItem(endpoint,data,token) {
  let requestInit = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  return new Promise((resolve, reject) => {
    fetch(endpoint, requestInit)
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  });

}

export function fetchPutItem(endpoint, data, token) {
  let requestInit = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  return new Promise((resolve, reject) => {
    fetch(endpoint, requestInit)
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  });
}