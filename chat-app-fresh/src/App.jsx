import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login"
import PageNotFound from "./Components/PageNotFound";
import Home from "./Components/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import ErrorBoundary from "./Components/ErrorBoundary";
import { useState } from "react";

function App() {
  // loggdeIn -> information , user data -> CRUD
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<ProtectedRoute>
          <Home ></Home>
        </ProtectedRoute>}></Route>

      <Route path="/:chatid" element={
          <ProtectedRoute><Home></Home></ProtectedRoute>
        }></Route>

        <Route path="/login" element={<Login ></Login>}></Route>
        <Route path="*" element={< PageNotFound />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App 