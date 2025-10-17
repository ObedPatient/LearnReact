import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getAllContacts } from "./api/ContactService";
import type { PaginatedResponse } from "./types";
import { Header } from "./components/Headers";
import { ContactDetail } from "./components/ContactDetails";
import { ContactList } from "./components/ContactList";
import { ContactForm } from "./components/ContactForm";
import "./index.css";

function App() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null); // Added error state

  const fetchContacts = async (page = 0, size = 10) => {
    try {
      setError(null); // Clear previous errors
      const result = await getAllContacts(page, size);
      setData(result);
      setCurrentPage(page);
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      setError(error.message || "Failed to load contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const toggleModal = (show: boolean) => setShowModal(show);

  const handleSave = () => {
    toggleModal(false);
    fetchContacts(currentPage);
  };

  return (
    <Router>
      <Header
        toggleModal={toggleModal}
        nbOfContacts={data?.totalElements ?? 0}
      />
      <main className="container mt-4">
        {error && <div className="alert alert-danger">{error}</div>}{" "}
        {/* Display error */}
        <Routes>
          <Route path="/" element={<Navigate to="/contacts" />} />
          <Route
            path="/contacts"
            element={
              <ContactList
                data={data}
                currentPage={currentPage}
                getAllContacts={fetchContacts}
              />
            }
          />
          <Route path="/contacts/:id" element={<ContactDetail />} />
        </Routes>
      </main>
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <ContactForm onSave={handleSave} />
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
