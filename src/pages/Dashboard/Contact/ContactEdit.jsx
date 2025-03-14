import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/auth.context";
import contactService from "../../../services/contact.service";

function Contact() {
  const { user } = useContext(AuthContext);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    socialLinks: [],
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await contactService.getContactByUserId(user._id);
        setContact(response.data || null);
        setFormData(response.data || formData); // Rellenar el formulario si hay datos
      } catch (error) {
        console.error("Error fetching contact:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [user._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index][field] = value;
    setFormData({ ...formData, socialLinks: updatedLinks });
  };

  const handleAddSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { platform: "", url: "" }],
    });
  };

  const handleRemoveSocialLink = (index) => {
    const updatedLinks = formData.socialLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, socialLinks: updatedLinks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (contact) {
        await contactService.updateContact(contact._id, formData);
      } else {
        await contactService.createContact({ ...formData, userId: user._id });
      }
      setContact(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving contact:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!contact) return;
    setLoading(true);
    try {
      await contactService.deleteContact(contact._id);
      setContact(null);
      setIsEditing(false);
      setFormData({
        email: "",
        phone: "",
        socialLinks: [],
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-indigo-500">Información de contacto</h2>
      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : contact && !isEditing ? (
        <div className="mt-4">
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Phone:</strong> {contact.phone}</p>
          <div>
            <strong>Social Links:</strong>
            <ul>
              {contact.socialLinks.map((link, index) => (
                <li key={index}>
                  <span>{link.platform}: </span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded-md mr-6 w-24 hover:bg-indigo-600 transition-colors duration-200"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
            <button
              className="bg-white border-2 border-red-500 text-red-500 px-4 py-2 rounded-md w-24 hover:bg-red-50 transition-colors duration-200"
              onClick={handleDelete}
            >
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 pl-16 pr-16">
          <label className="block text-gray-700 font-black text-lg text-left mt-8 mb-4">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
            placeholder="ejemplo@ejemplo.com"
          />

          <label className="block text-gray-700 font-black text-lg text-left mt-8 mb-4">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          />

<label className="block text-gray-700 font-black text-lg text-left mt-8 mb-4">Social Links</label>
{formData.socialLinks.map((link, index) => (
  <div key={index} className="flex space-x-2 mt-2 items-center">
    <input
      type="text"
      name="platform"
      value={link.platform}
      onChange={(e) => handleSocialLinkChange(index, "platform", e.target.value)}
      placeholder="Plataforma (e.j., Twitter, Linkedin)"
      className="w-1/2 border rounded-md p-2"
    />
    <input
      type="url"
      name="url"
      value={link.url}
      onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
      placeholder="URL"
      className="w-1/2 border rounded-md p-2"
    />
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={() => handleRemoveSocialLink(index)}
        className="bg-white border-2 border-red-500 text-red-500 px-4 py-2 rounded-md w-18 hover:bg-red-50 transition-colors duration-200"
      >
        -
      </button>
      <button
        type="button"
        onClick={handleAddSocialLink}
        className="bg-white border-2 border-indigo-500 text-indigo-500 px-4 py-2 rounded-md w-18 hover:bg-indigo-50 transition-colors duration-200"
      >
        +
      </button>
    </div>
  </div>
))}
<br />

<button
  type="submit"
  className="bg-indigo-500 text-white px-4 py-2 rounded-md mt-12"
>
  {contact ? "Guardar" : "Crear"}
</button>

        </form>
      )}
    </div>
  );
}

export default Contact;
