import { Navigate, Route, Routes } from "react-router-dom";

import { AuthContextProvider } from "./middleware/AuthContext";

import ProtectedRoute from "./middleware/PrivateRoute";

import Login from "./modules/auth/Login";
import ForgotPassword from "./modules/auth/ForgotPassword";
import ResetPassword from "./modules/auth/ResetPassword";
import CheckEmail from "./modules/auth/CheckEmail";

import UsersCreate from "./modules/users/UsersCreate";
import UsersList from "./modules/users/UsersList";
import UsersUpdate from "./modules/users/UsersUpdate";

import UserRolesList from "./components/AdminPages/UserRoles/UserRolesList";
import UserRolesCreate from "./components/AdminPages/UserRoles/UserRolesCreate";
import UserRolesUpdate from "./components/AdminPages/UserRoles/UserRolesUpdate";

import BranchesList from "./modules/branches/BranchesList";
import BranchesCreate from "./modules/branches/BranchesCreate";
import BranchesUpdate from "./modules/branches/BranchesUpdate";

import History from "./components/StaffPages/History/History";
import QueueList from "./components/StaffPages/QueueList/QueueList";

import TicketsHistory from "./modules/tickets/TicketsHistory";
import TicketsCreate from "./modules/tickets/TicketsCreate";

import MyProfile from "./components/AdminPages/MyProfile/MyProfile";

import TemplatesList from "./modules/templates/TemplatesList";
import TemplateAccessUpdate from "./modules/templates/TemplateAccessUpdate";

import ResourcesIndex from "./modules/resources/ResourcesIndex";
import ResourcesLists from "./modules/resources/ResourcesLists";
import ResourcesCreate from "./modules/resources/ResourcesCreate";
import ResourcesRead from "./modules/resources/ResourcesRead";
import ResourcesUpdate from "./modules/resources/ResourcesUpdate";
import ActivityLogs from "./modules/activity-logs/ActivityLogs";
import TicketCategory from "./modules/tickets/TicketCategory";

export default function AppRouter() {
  return (
    <AuthContextProvider>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:passwordToken"
          name="reset-password"
          element={<ResetPassword />}
        />
        <Route path="/open-email" element={<CheckEmail />} />

        {/* Users */}
        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute
              element={<UsersUpdate />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/users/create"
          element={
            <ProtectedRoute
              element={<UsersCreate />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute element={<UsersList />} allowedRoles={["Admin"]} />
          }
        />

        {/* Resources */}
        <Route
          path="/resources/:resourceID"
          element={
            <ProtectedRoute
              element={<ResourcesRead />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/resources/:resourceID/update"
          element={
            <ProtectedRoute
              element={<ResourcesUpdate />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/resources/create"
          element={
            <ProtectedRoute
              element={<ResourcesCreate />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute
              element={<ResourcesLists />}
              allowedRoles={["Admin", "Staff"]}
            />
          }
        />
        <Route
          path="/resources-index"
          element={
            <ProtectedRoute
              element={<ResourcesIndex />}
              allowedRoles={["Admin", "Staff"]}
            />
          }
        />
        <Route
          path="/staff-view-resource/:slug"
          element={
            <ProtectedRoute
              element={<ResourcesRead />}
              allowedRoles={["Staff"]}
            />
          }
        />

        {/* Tickets */}
        <Route
          path="/ticket-category"
          element={
            <ProtectedRoute
              element={<TicketCategory />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedRoute
              element={<TemplatesList />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/template-access/:userId"
          element={
            <ProtectedRoute
              element={<TemplateAccessUpdate />}
              allowedRoles={["Admin"]}
            />
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute
              element={<TicketsHistory />}
              allowedRoles={["Admin"]}
            />
          }
        />

        <Route
          path="/activity-logs"
          element={
            <ProtectedRoute
              element={<ActivityLogs />}
              allowedRoles={["Admin"]}
            />
          }
        />

        {/* User Roles */}
        <Route
          path="/user-roles/create"
          element={
            <ProtectedRoute
              element={<UserRolesCreate />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/user-roles/:roleId"
          element={
            <ProtectedRoute
              element={<UserRolesUpdate />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/user-roles"
          element={
            <ProtectedRoute
              element={<UserRolesList />}
              allowedRoles={["Admin"]}
            />
          }
        />

        {/* Branches */}
        <Route
          path="/branches"
          element={
            <ProtectedRoute
              element={<BranchesList />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/branches/create"
          element={
            <ProtectedRoute
              element={<BranchesCreate />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/branches/:branchId"
          element={
            <ProtectedRoute
              element={<BranchesUpdate />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/tickets/create"
          element={
            <ProtectedRoute
              element={<TicketsCreate />}
              allowedRoles={["Staff", "Admin"]}
            />
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute element={<History />} allowedRoles={["Staff"]} />
          }
        />
        <Route
          path="/queue-list"
          element={
            <ProtectedRoute element={<QueueList />} allowedRoles={["Staff"]} />
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute
              element={<MyProfile />}
              allowedRoles={["Admin", "Staff"]}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContextProvider>
  );
}
