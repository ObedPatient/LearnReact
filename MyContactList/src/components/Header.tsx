// Define the prop types for the Header component
interface HeaderProps {
  toggleModal: (isOpen: boolean) => void;
  nbOfContacts: number;
}

export const Header = ({ toggleModal, nbOfContacts }: HeaderProps) => {
  return (
    <header className="header">
      <div className="container">
        <h3>ContactList ({nbOfContacts})</h3>
        <button onClick={() => toggleModal(true)} className="btn">
          <i className="bi bi-plus-square"></i> Add new contact
        </button>
      </div>
    </header>
  );
};
