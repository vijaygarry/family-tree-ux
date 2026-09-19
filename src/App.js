import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./layout/MainLayout";
import LoginLayout from "./layout/LoginLayout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import FamilyDetails from "./pages/FamilyDetails";
import FamilySearch from "./pages/FamilySearch";
import AddFamily from "./pages/AddFamily";
import ChangePassword from "./pages/ChangePassword";
import MemberProfile from "./pages/MemberProfile";
import EventListPage from "./pages/EventListPage";
import EventDetailPage from "./pages/EventDetailPage";
import AccountsPage from "./pages/AccountsPage";
import ForgotPassword from "./pages/ForgotPassword";
import SignUp from "./pages/SignUp";
import HelpPage from "./pages/HelpPage";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AddMember from "./pages/AddMember";
import MarkAsDeceased from "./pages/MarkAsDeceased";
import SetHeadOfFamily from "./pages/SetHeadOfFamily";
import ManageRelationship from "./pages/ManageRelationship";
import MemberSearch from "./pages/MemberSearch";
import RegisterFamilyRequest from "./pages/RegisterFamilyRequest";
import FamiliesByCityPage from "./pages/FamiliesByCityPage";
import AddHeadOfFamily from "./pages/AddHeadOfFamily";
import FamilyRegistrationManagement from "./pages/FamilyRegistrationManagement";

//import UserDetails from "./pages/UserDetails";

const App = () => (
  <Routes>
    {/* Public route */}
    <Route
      path="/login"
      element={
        <LoginLayout>
          <Login />
        </LoginLayout>
      }
    />
    <Route
      path="/registerFamilyrequest"
      element={
        <LoginLayout>
          <RegisterFamilyRequest />
        </LoginLayout>
      }
    />
    <Route
      path="/forgotpassword"
      element={
        <LoginLayout>
          <ForgotPassword />
        </LoginLayout>
      }
    />
    <Route
      path="/signup"
      element={
        <LoginLayout>
          <SignUp />
        </LoginLayout>
      }
    />
    {/* Show this page without login */}
    <Route
      path="/helpWithoutMenu"
      element={
        <LoginLayout>
          <HelpPage />
        </LoginLayout>
      }
    />
    {/* Show this route in header menu */}
    <Route
      path="/helpWithMenu"
      element={
        <PrivateRoute>
          <MainLayout>
            <HelpPage />
          </MainLayout>
        </PrivateRoute>
      }
    />
    {/* Protected routes with layout */}
    <Route
      path="/"
      element={
        <PrivateRoute>
          <MainLayout>
            <HomePage />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/family"
      element={
        <PrivateRoute>
          <MainLayout>
            <FamilyDetails />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/family/:familyId"
      element={
        <PrivateRoute>
          <MainLayout>
            <FamilyDetails />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/addfamily"
      element={
        <PrivateRoute>
          <MainLayout>
            <AddFamily />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/searchfamily"
      element={
        <PrivateRoute>
          <MainLayout>
            <FamilySearch />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/myProfile"
      element={
        <PrivateRoute>
          <MainLayout>
            <MemberProfile />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/member/:id"
      element={
        <PrivateRoute>
          <MainLayout>
            <MemberProfile />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/searchMember"
      element={
        <PrivateRoute>
          <MainLayout>
            <MemberSearch />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/events"
      element={
        <PrivateRoute>
          <MainLayout>
            <EventListPage />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/addMember"
      element={
        <PrivateRoute>
          <MainLayout>
            <AddMember />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/markasdeceased"
      element={
        <PrivateRoute>
          <MainLayout>
            <MarkAsDeceased />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/setheadoffamily"
      element={
        <PrivateRoute>
          <MainLayout>
            <SetHeadOfFamily />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/manageRelationship"
      element={
        <PrivateRoute>
          <MainLayout>
            <ManageRelationship />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/addheadoffamily"
      element={
        <PrivateRoute>
          <MainLayout>
            <AddHeadOfFamily />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/event/:id"
      element={
        <PrivateRoute>
          <MainLayout>
            <EventDetailPage />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/accounts"
      element={
        <PrivateRoute>
          <MainLayout>
            <AccountsPage />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/changepassword"
      element={
        <PrivateRoute>
          <MainLayout>
            <ChangePassword />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/families-by-city"
      element={
        <PrivateRoute>
          <MainLayout>
            <FamiliesByCityPage />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/family-registration-management"
      element={
        <PrivateRoute>
          <MainLayout>
            <FamilyRegistrationManagement />
          </MainLayout>
        </PrivateRoute>
      }
    />
  </Routes>
);

export default App;
