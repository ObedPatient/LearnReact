import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { PaginatedResponse, Contact } from "../types";
import { getAllContacts } from "../api/ContactService";

interface ContactListProps {
  data: PaginatedResponse | null;
  currentPage: number;
  getAllContacts: (page?: number, size?: number) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  data,
  currentPage,
  getAllContacts,
}) => {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    getAllContacts(page);
  }, [page, getAllContacts]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="contact-list container mt-4">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Title</th>
            <th>Status</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((contact: Contact) => (
            <tr key={contact.id}>
              {" "}
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>{contact.address}</td>
              <td>{contact.title}</td>
              <td>{contact.status}</td>
              <td>
                {contact.imageUrl ? (
                  <img
                    src={contact.imageUrl}
                    alt={`${contact.name}'s photo`}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "No Photo"
                )}
              </td>
              <td>
                <Link
                  to={`/contacts/${contact.id}`}
                  className="btn btn-sm btn-primary"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          disabled={page === 0}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button
          className="btn btn-secondary"
          disabled={page >= (data?.totalPages || 0) - 1}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
