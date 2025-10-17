import React, { useState, useEffect } from "react";
import {
  saveContact,
  updateContact,
  updateImage,
  getContact,
} from "../api/ContactService";
import type { Contact } from "../types";

interface ContactFormProps {
  contactId?: string;
  onSave: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  contactId,
  onSave,
}) => {
  const [values, setValues] = useState<Contact>({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
    imageUrl: "",
  });

  const [file, setFile] = useState<File | undefined>(undefined);

  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (contactId) {
      getContact(contactId)
        .then((data) => setValues(data))
        .catch((err) => setError("Failed to load contact"));
    }
  }, [contactId]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setError(null);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type.startsWith("image/") &&
        selectedFile.size < 5 * 1024 * 1024
      ) {
        setFile(selectedFile);
        console.log("Selected file:", selectedFile.name);
      } else {
        setError("Please select an image file less than 5MB");
        setFile(undefined);
      }
    } else {
      setFile(undefined);
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      let savedContact: Contact;
      if (contactId) {
        savedContact = await updateContact(contactId, values);
      } else {
        savedContact = await saveContact(values);
      }

      if (file && savedContact.id) {
        await updateImage(savedContact.id, file);
      }
      onSave();
    } catch (error: any) {
      setError(error.message || "Failed to save contact");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-content p-4 bg-white rounded shadow">
      <h3>{contactId ? "Edit Contact" : "New Contact"}</h3>

      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            value={values.phone}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            value={values.address}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <input
            type="text"
            name="status"
            value={values.status}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="form-control"
          />
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-secondary me-2"
            type="button"
            onClick={onSave}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
