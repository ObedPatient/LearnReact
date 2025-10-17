import type { HeadersProps } from "../types";

export const Header: React.FC<HeadersProps> = ({
  toggleModal,
  nbOfContacts,
}) => {
  return (
    <header className="header bg-primary text-white p-3">
      <div className="container d-flex justify-contant-between align-items-center">
        <h3>Contact List ({nbOfContacts})</h3>
        <button onClick={() => toggleModal(true)} className="btn btn-light">
          <i className="bi bi-plus-square"></i> Add new Contact
        </button>
      </div>
    </header>
  );
};
