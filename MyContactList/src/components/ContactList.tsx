// src/components/ContactList.tsx
import React from "react";
import { Contact as ContactComponent } from "./Contact";
import type { Contact, PaginatedResponse } from "../types";

interface ContactListProps {
  data: PaginatedResponse;
  currentPage: number;
  getAllContacts: (page: number) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  data,
  currentPage,
  getAllContacts,
}) => {
  return (
    <main className="main">
      {data?.content?.length === 0 && (
        <div>No contacts. Please add a new contact</div>
      )}
      <ul className="contact__list">
        {data?.content?.length > 0 &&
          data.content.map((contact: Contact) => (
            <ContactComponent contact={contact} key={contact.id} />
          ))}
      </ul>

      {data?.content?.length > 0 && data?.totalPages > 1 && (
        <div className="pagination">
          <a
            onClick={() => getAllContacts(currentPage - 1)}
            className={currentPage === 0 ? "disable" : ""}
          >
            &laquo;
          </a>
          {data &&
            [...Array(data.totalPages).keys()].map((page) => (
              <a
                onClick={() => getAllContacts(page)}
                className={currentPage === page ? "active" : ""}
                key={page}
              >
                {page + 1}
              </a>
            ))}
          <a
            onClick={() => getAllContacts(currentPage + 1)}
            className={data.totalPages === currentPage + 1 ? "disable" : ""}
          >
            &raquo;
          </a>
        </div>
      )}
    </main>
  );
};
