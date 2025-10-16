import { Link } from "react-router-dom";

// Define the type for the contact prop
interface ContactProps {
  contact: {
    id: string | number; // Adjust based on whether your contact ID is a string or number
    imageUrl: string;
    name: string;
    title: string;
    email: string;
    address: string;
    phone: string;
    status: string;
  };
}

export const Contact = ({ contact }: ContactProps) => {
  return (
    <Link to={`/contacts/${contact.id}`} className="contact_item">
      <div className="contact__header">
        <div className="contact__image">
          <img src={contact.imageUrl} alt={contact.name} />
        </div>
        <div className="contact__details">
          <p className="contact__name">{contact.name.substring(0, 15)}</p>
          <p className="contact__title">{contact.title}</p>
        </div>
      </div>
      <div className="contact__body">
        <p>
          <i className="bi bi-envelope"></i>
          {contact.email.substring(0, 20)}
        </p>
        <p>
          <i className="bi bi-geo"></i>
          {contact.address}
        </p>
        <p>
          <i className="bi bi-telephone"></i>
          {contact.phone}
        </p>
        <p>
          {contact.status === "active" ? (
            <i className="bi bi-check-circle"></i>
          ) : (
            <i className="bi bi-x-circle"></i>
          )}
          {contact.status}
        </p>
      </div>
    </Link>
  );
};
