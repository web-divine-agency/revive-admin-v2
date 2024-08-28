import React from 'react';
// import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login/Login';
import SideBar from './components/SideBar/SideBar';
import UsersList from './components/Pages/UsersList/UsersLIst';
import Branches from './components/Pages/Branches/Branches';
import StaffLogs from './components/Pages/StaffLogs/StaffLogs';
import TicketsHistory from './components/Pages/TicketsHistory/TicketsHistory';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import AddNewUser from './components/Pages/UsersList/AddNewUser';
import EditUser from './components/Pages/UsersList/EditUser';
import UserRoleManagement from './components/Pages/UserManagement/UsersManagement';
import EditUserRole from './components/Pages/UserManagement/EditUserRole';
import AddNewRole from './components/Pages/UserManagement/AddNewRole';
import AddBranch from './components/Pages/Branches/AddBranch';
import EditBranch from './components/Pages/Branches/EditBranch';






function Layout() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/' && <SideBar />}
      <Routes>
        <Route path="/userlist" element={<UsersList />} />
        <Route path="/user-management" element={<UserRoleManagement />} />
        <Route path="/staff-logs" element={<StaffLogs />} />
        <Route path="/tickets-history" element={<TicketsHistory />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/add-new-user" element={<AddNewUser />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route path="/edit-user-role" element={<EditUserRole />} />
        <Route path="/add-new-role" element={<AddNewRole />} />
        <Route path="/add-branch" element={<AddBranch />} />
        <Route path="/edit-branch" element={<EditBranch />} />
        <Route index element={<Login />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Layout />
      </Router>
    </div>
  );
}

export default App;
