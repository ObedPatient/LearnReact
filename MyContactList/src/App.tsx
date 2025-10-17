import { useEffect, useRef, useState } from "react";
import { getAllContacts, saveContact } from "./api/ContactService";
import type { PaginatedResponse } from "./types";
import { Header } from "./components/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import { ContactList } from "./components/ContactList";

function App() {
  const modelRef = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAllContents = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const result = await getAllContacts(page, size);
      console.log("API Response:", result);
      setData(result);
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      setError(error.message || "Failed to fetch contacts. Please try again.");
    }
  };

  useEffect(() => {
    getAllContents();
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };
      console.log("Updated Values:", updatedValues);
      return updatedValues;
    });
    setError(null);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type.startsWith("image/") &&
        selectedFile.size < 5 * 1024 * 1024
      ) {
        setFile(selectedFile);
        console.log("Selected File:", selectedFile);
      } else {
        setError("Please select an image file less than 5MB.");
        setFile(undefined);
        if (fileRef.current) fileRef.current.value = "";
      }
    } else {
      setFile(undefined);
      console.log("No file selected");
    }
    setError(null);
  };

  const handleNewContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("title", values.title);
      formData.append("status", values.status);
      if (file) formData.append("photo", file);

      const response = await saveContact(formData);
      console.log("Contact saved:", response);

      setValues({
        name: "",
        email: "",
        phone: "",
        address: "",
        title: "",
        status: "",
      });
      setFile(undefined);
      if (fileRef.current) fileRef.current.value = "";
      toggleModal(false);
      setError(null);
      await getAllContents(currentPage);
    } catch (error: any) {
      console.error("Error saving contact:", error);
      setError(error.message || "Failed to save contact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModal = (show: boolean) =>
    show ? modelRef.current?.showModal() : modelRef.current?.close();

  return (
    <>
      <Header
        toggleModal={toggleModal}
        nbOfContacts={data?.totalElements ?? 0}
      />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={"/contacts"} />} />
            <Route
              path="/contacts"
              element={
                data && (
                  <ContactList
                    data={data}
                    currentPage={currentPage}
                    getAllContacts={getAllContents}
                  />
                )
              }
            />
          </Routes>
        </div>
      </main>

      <dialog ref={modelRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          {error && (
            <div className="error" style={{ color: "red" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input
                  type="text"
                  value={values.name}
                  onChange={onChange}
                  name="name"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="text"
                  value={values.email}
                  onChange={onChange}
                  name="email"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input
                  type="text"
                  value={values.title}
                  onChange={onChange}
                  name="title"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  type="text"
                  value={values.phone}
                  onChange={onChange}
                  name="phone"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input
                  type="text"
                  value={values.address}
                  onChange={onChange}
                  name="address"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input
                  type="text"
                  value={values.status}
                  onChange={onChange}
                  name="status"
                  required
                />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  name="photo"
                  ref={fileRef}
                />
              </div>
            </div>
            <div className="form_footer">
              <button
                onClick={() => toggleModal(false)}
                type="button"
                className="btn btn-danger"
              >
                Cancel
              </button>
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default App;
