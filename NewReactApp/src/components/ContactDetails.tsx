import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContact, deleteContact } from "../api/ContactService";
import type { Contact } from "../types";
import { ContactForm } from "./ContactForm";

interface ContactDetailProps {}

export const ContactDetail: React.FC<ContactDetailProps> = () => {
  const { id } = useParams<{ id: string | undefined }>();

  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getContact(id)
        .then((data) => setContact(data))
        .catch((err) => setError("Failed to load contact: " + err.message));
    } else {
      setError("No contact ID provided");
    }
  }, [id]);

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteContact(id);
        navigate("/contacts");
      } catch (error: any) {
        setError(error.message || "Failed to delete contact");
      }
    } else {
      setError("Cannot delete: No contact ID provided");
    }
  };

  const handleSave = () => {
    setEditing(false);
    if (id) {
      getContact(id)
        .then((data) => setContact(data))
        .catch((err) => setError("Failed to refresh contact: " + err.message));
    }
  };

  if (!contact) {
    return <p>{error || "Loading..."}</p>;
  }

  if (editing) {
    return <ContactForm contactId={id} onSave={handleSave} />;
  }

  return (
    <div className="container mt-4">
      <h2>{contact.name}</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="card">
        <div className="card-body">
          {contact.imageUrl && (
            <img
              src={contact.imageUrl}
              alt={contact.name}
              className="img-fluid mb-3"
              style={{ maxWidth: "200px" }}
            />
          )}
          <p>
            <strong>Email:</strong> {contact.email}
          </p>
          <p>
            <strong>Phone:</strong> {contact.phone}
          </p>
          <p>
            <strong>Address:</strong> {contact.address}
          </p>
          <p>
            <strong>Title:</strong> {contact.title}
          </p>
          <p>
            <strong>Status:</strong> {contact.status}
          </p>
          <div className="d-flex">
            <button
              className="btn btn-primary me-2"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
