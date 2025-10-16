import { useEffect, useState } from "react";
import { getAllContacts } from "./api/ContactService";
import type { PaginatedResponse } from "./types";
import { Header } from "./components/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import { ContactList } from "./components/ContactList";

function App() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const getAllContents = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const result = await getAllContacts(page, size);
      console.log("✅ API Response:", result);
      setData(result);
    } catch (error) {
      console.error("❌ Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    getAllContents();
  }, []);

  const toggleModal = () => {
    console.log("i was clicked");
  };

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

      <dialog className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" name="name" required />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input type="text" name="email" required />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input type="text" name="title" required />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input type="text" name="phone" required />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input type="text" name="address" required />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input type="text" name="status" required />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input type="file" name="photo" required />
              </div>
            </div>
            <div className="form_footer">
              <button type="button" className="btn btn-danger">
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default App;
