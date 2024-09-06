import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login/Login';
import SideBar from './components/SideBar/SideBar';
import UsersList from './components/AdminPages/UsersList/UsersLIst';
import Branches from './components/AdminPages/Branches/Branches';
import StaffLogs from './components/AdminPages/StaffLogs/StaffLogs';
import TicketsHistory from './components/AdminPages/TicketsHistory/TicketsHistory';
import AddNewUser from './components/AdminPages/UsersList/AddNewUser';
import EditUser from './components/AdminPages/UsersList/EditUser';
import UserRoleManagement from './components/AdminPages/UserManagement/UsersManagement';
import EditUserRole from './components/AdminPages/UserManagement/EditUserRole';
import AddNewRole from './components/AdminPages/UserManagement/AddNewRole';
import AddBranch from './components/AdminPages/Branches/AddBranch';
import EditBranch from './components/AdminPages/Branches/EditBranch';
import MyProfile from './components/AdminPages/MyProfile/MyProfile';
import GenerateTickets from './components/StaffPages/GenerateTickets/GenerateTickets';
import History from './components/StaffPages/History/History';
import QueueList from './components/StaffPages/QueueList/QueueList';


function Layout() {
  const location = useLocation();
  const userRole = 'Staff'; 

  return (
    <>
      {location.pathname !== '/' && <SideBar role={userRole} />}
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
        <Route path="/my-profile" element={<MyProfile />} /> 
        <Route path="/history" element={<History />} /> 
        <Route path="/queue-list" element={<QueueList />} /> 
        <Route path="/generate-tickets" element={<GenerateTickets />} /> 
        <Route path="/history" element={<History />} /> 

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
