import { Navigate, Route, Routes } from "react-router-dom";

import { AuthContextProvider } from "./components/Authentication/authContext";

import ProtectedRoute from "./components/PrivateRoute/PrivateRoute";

import Login from "./components/Login/Login";
import ForgotPassword from "./components/PasswordReset/ForgotPassword";
import ResetPassword from "./components/PasswordReset/ResetPassword";
import CheckEmail from "./components/PasswordReset/CheckEmail";

import UsersList from "./components/AdminPages/UsersList/UsersList";
import UsersCreate from "./components/AdminPages/UsersList/UsersCreate";
import UsersUpdate from "./components/AdminPages/UsersList/UsersUpdate";

import UserRolesList from "./components/AdminPages/UserRoles/UserRolesList";
import UserRolesCreate from "./components/AdminPages/UserRoles/UserRolesCreate";
import UserRolesUpdate from "./components/AdminPages/UserRoles/UserRolesUpdate";

import Branches from "./components/AdminPages/Branches/Branches";
import AddBranch from "./components/AdminPages/Branches/AddBranch";
import EditBranch from "./components/AdminPages/Branches/EditBranch";

import StaffLogs from "./components/AdminPages/StaffLogs/StaffLogs";
import History from "./components/StaffPages/History/History";
import QueueList from "./components/StaffPages/QueueList/QueueList";

import TicketsHistory from "./components/AdminPages/TicketsHistory/TicketsHistory";
import TicketCategory from "./components/AdminPages/TemplateManagement/TicketCategory";

import GenerateTickets from "./components/StaffPages/GenerateTickets/GenerateTickets";

import MyProfile from "./components/AdminPages/MyProfile/MyProfile";

import TemplateManagement from "./components/AdminPages/TemplateManagement/TemplateManagement";
import EditUserTemplateAccess from "./components/AdminPages/TemplateManagement/EditUserTemplateAccess";

import ResourcesIndex from "./components/AdminPages/Resources/ResourcesIndex";
import ResourcesLists from "./components/AdminPages/Resources/ResourcesLists";
import ResourcesCreate from "./components/AdminPages/Resources/ResourcesCreate";
import ResourcesUpdate from "./components/AdminPages/Resources/ResourcesUpdate";
import ViewResources from "./components/AdminPages/Resources/ViewResources";

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
          path="/users"
          element={
            <ProtectedRoute element={<UsersList />} allowedRoles={["Admin"]} />
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
          path="/users/:userId"
          element={
            <ProtectedRoute
              element={<UsersUpdate />}
              allowedRoles={["Admin"]}
            />
          }
        />

        {/* Resources */}
        <Route
          path="/resources/:resourceID"
          element={
            <ProtectedRoute
              element={<ViewResources />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/staff-view-resource/:slug"
          element={
            <ProtectedRoute
              element={<ViewResources />}
              allowedRoles={["Staff"]}
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
          path="/resources/create"
          element={
            <ProtectedRoute
              element={<ResourcesCreate />}
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
          path="/ticket-category"
          element={
            <ProtectedRoute
              element={<TicketCategory />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/template-management"
          element={
            <ProtectedRoute
              element={<TemplateManagement />}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/assign-tickets/:userId"
          element={
            <ProtectedRoute
              element={<EditUserTemplateAccess />}
              allowedRoles={["Admin"]}
            />
          }
        />

        <Route
          path="/staff-logs"
          element={
            <ProtectedRoute element={<StaffLogs />} allowedRoles={["Admin"]} />
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
          path="/branches"
          element={
            <ProtectedRoute element={<Branches />} allowedRoles={["Admin"]} />
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
        <Route
          path="/add-branch"
          element={
            <ProtectedRoute element={<AddBranch />} allowedRoles={["Admin"]} />
          }
        />
        <Route
          path="/edit-branch/:branchId"
          element={
            <ProtectedRoute element={<EditBranch />} allowedRoles={["Admin"]} />
          }
        />
        <Route
          path="/generate-tickets"
          element={
            <ProtectedRoute
              element={<GenerateTickets />}
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
