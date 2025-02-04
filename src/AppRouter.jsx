import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Authenticated, AuthRedirect } from "./middleware/auth";

import Login from "./modules/auth/Login";
import ForgotPassword from "./modules/auth/ForgotPassword";
import ResetPassword from "./modules/auth/ResetPassword";
import CheckEmail from "./modules/auth/CheckEmail";

import UsersCreate from "./modules/users/UsersCreate";
import UsersList from "./modules/users/UsersList";
import UsersUpdate from "./modules/users/UsersUpdate";

import UserRolesCreate from "./modules/user-roles/UserRolesCreate";
import UserRolesUpdate from "./modules/user-roles/UserRolesUpdate";
import UserRolesList from "./modules/user-roles/UserRolesList";

import PermissionsList from "./modules/permissions/PermissionsList";
import PermissionsCreate from "./modules/permissions/PermissionsCreate";

import BranchesList from "./modules/branches/BranchesList";
import BranchesCreate from "./modules/branches/BranchesCreate";
import BranchesUpdate from "./modules/branches/BranchesUpdate";

import TicketsList from "./modules/tickets/TicketsList";
import TicketsCreate from "./modules/tickets/TicketsCreate";
import TicketCategory from "./modules/tickets/TicketCategory";

import TemplatesList from "./modules/templates/TemplatesList";
import TemplateAccessUpdate from "./modules/templates/TemplateAccessUpdate";

import Profile from "./modules/profile/Profile";

import ResourcesIndex from "./modules/resources/ResourcesIndex";
import ResourcesLists from "./modules/resources/ResourcesLists";
import ResourcesCreate from "./modules/resources/ResourcesCreate";
import ResourcesRead from "./modules/resources/ResourcesRead";
import ResourcesUpdate from "./modules/resources/ResourcesUpdate";

import ActivityLogs from "./modules/activity-logs/ActivityLogs";
import NotFound from "./modules/not-found/NotFound";
import ResourceCategoriesList from "./modules/resources/ResourceCategoriesList";

export default function AppRouter() {
  const users = (
    <React.Fragment>
      <Route path="/users/:userId" element={<UsersUpdate />} />
      <Route path="/users/create" element={<UsersCreate />} />
      <Route path="/users" element={<UsersList />} />
    </React.Fragment>
  );

  const tickets = (
    <React.Fragment>
      <Route path="/tickets" element={<TicketsList />} />
      <Route path="/ticket-category" element={<TicketCategory />} />
      <Route path="/templates" element={<TemplatesList />} />
      <Route
        path="/template-access/:userId"
        element={<TemplateAccessUpdate />}
      />
      <Route path="/tickets/create" element={<TicketsCreate />} />
    </React.Fragment>
  );

  const branches = (
    <React.Fragment>
      <Route path="/branches" element={<BranchesList />} />
      <Route path="/branches/create" element={<BranchesCreate />} />
      <Route path="/branches/:branchId" element={<BranchesUpdate />} />
    </React.Fragment>
  );

  const resources = (
    <React.Fragment>
      <Route path="/resources/:resourceID" element={<ResourcesRead />} />
      <Route
        path="/resources/:resourceID/update"
        element={<ResourcesUpdate />}
      />
      <Route path="/resources/create" element={<ResourcesCreate />} />
      <Route path="/resources" element={<ResourcesLists />} />
      <Route path="/resources-index" element={<ResourcesIndex />} />
      <Route path="/staff-view-resource/:slug" element={<ResourcesRead />} />

      <Route path="/resource-categories" element={<ResourceCategoriesList />} />
    </React.Fragment>
  );

  const userRoles = (
    <React.Fragment>
      <Route path="/user-roles/create" element={<UserRolesCreate />} />
      <Route path="/user-roles/:roleId" element={<UserRolesUpdate />} />
      <Route path="/user-roles" element={<UserRolesList />} />
    </React.Fragment>
  );

  const permissions = (
    <React.Fragment>
      <Route path="/permissions" element={<PermissionsList />} />
      <Route path="/permissions/create" element={<PermissionsCreate />} />
    </React.Fragment>
  );

  const logs = (
    <React.Fragment>
      <Route path="/activity-logs" element={<ActivityLogs />} />
    </React.Fragment>
  );

  const profile = (
    <React.Fragment>
      <Route path="/profile" element={<Profile />} />
    </React.Fragment>
  );

  const fallback = (
    <React.Fragment>
      <Route path="/not-found" element={<NotFound />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </React.Fragment>
  );

  const resetPassword = (
    <React.Fragment>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/reset-password/:passwordToken"
        element={<ResetPassword />}
      />
      <Route path="/open-email" element={<CheckEmail />} />
    </React.Fragment>
  );

  const authentication = <Route path="/login" element={<Login />} />;

  return (
    <Routes>
      <Route element={<Authenticated />}>
        {users}
        {tickets}
        {branches}
        {resources}
        {userRoles}
        {permissions}
        {logs}
        {profile}
      </Route>

      <Route element={<AuthRedirect />}>{authentication}</Route>

      {resetPassword}

      {fallback}
    </Routes>
  );
}
