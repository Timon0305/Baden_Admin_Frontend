import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Users = React.lazy(() => import('./views/pages/users'));
const Doctors = React.lazy(() => import('./views/pages/doctors'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/users', name: 'Users', component: Users },
  { path: '/doctors', name: 'Doctors', component: Doctors },
];

export default routes;
