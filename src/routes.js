import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Users = React.lazy(() => import('./views/pages/users'));
const Drivers = React.lazy(() => import('./views/pages/drivers'));
const Vehicles = React.lazy(() => import('./views/pages/vehicles/index'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/users', name: 'Users', component: Users },
  { path: '/drivers', name: 'Vehicle', component: Drivers },
  { path: '/vehicles', name: 'Vehicle', component: Vehicles },
];

export default routes;
