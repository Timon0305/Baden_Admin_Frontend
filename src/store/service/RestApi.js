import apisauce from 'apisauce'
import Config from '../../config/'

const _instance = (baseURL) => {
  // Create and configure an apisauce-based api object.

  return apisauce.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 100000
  })
}

const instance = _instance.bind(null, Config.API_ENDPOINT);

const tag = 'RestApi';
const login = (api, email, password) => {
  console.log(tag, 'login');
  return api.post('/login', {email, password});
};

const getUsers = (api) => {
  console.log(tag, 'getUsers');
  return api.get('/users');
};

const createUser = (api, newUser) => {
  return api.put('/users', {newUser});
};

const updateUser = (api, id, newUser) => {
  return api.post(`/users/${id}`, {newUser});
};

const deleteUser = (api, id) => {
  return api.delete(`/users/${id}`);
};

const getDoctors = (api) => {
  return api.get('/doctors');
};

const createDoctor = (api, newUser) => {
  return api.put('/doctors', {newUser});
};

const updateDoctor = (api, id, newUser) => {
  return api.post(`/doctors/${id}`, {newUser});
};

const deleteDoctor = (api, id) => {
  return api.delete(`/doctors/${id}`);
};

const getVehicle = (api) => {
  return api.get('/vehicles');
}

const createVehicle = (api, newVehicle) => {
  return api.put('/vehicles', {newVehicle})
}

const updateVehicle = (api, id, newVehicle) => {
  return api.post(`/vehicles/${id}`, {newVehicle})
}

const deleteVehicle = (api, id) => {
  return api.delete(`vehicles/${id}`)
}

export default {
  instance,
  login,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  createDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
}
