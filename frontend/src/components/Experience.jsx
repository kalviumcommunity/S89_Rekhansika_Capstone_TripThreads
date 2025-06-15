import React, { useState,useEffect } from 'react';
import './Experience.css';
import Header from '../sections/Header';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import axios from 'axios';
import { FaMapMarkerAlt } from 'react-icons/fa';


const visibilityOptions = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

const Experience = () => {
  // State per card
  const user = JSON.parse(localStorage.getItem("user"));
const likesKey = user && user.email ? `experienceLikes_${user.email}` : 'experienceLikes_guest';

const [liked, setLiked] = useState(() => {
  const storedLikes = localStorage.getItem(likesKey);
  return storedLikes ? JSON.parse(storedLikes) : {};
});

  const [datePickerOpen, setDatePickerOpen] = useState({});
  const [selectedDate, setSelectedDate] = useState({});
  const [locationPickerOpen, setLocationPickerOpen] = useState({});

  const [showModal, setShowModal] = useState(false);
 const [newExperience, setNewExperience] = useState({
    title: '',
    description: '',
    imageUrl: '',
    visibility: 'public',
    location: '',
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editExperience, setEditExperience] = useState(null);
  const [experiences, setExperiences] = useState([]);
 
  useEffect(() => {
    if (user && user.email) {
      axios.get(`http://localhost:3000/socialFeatures/posts?email=${user.email}`,{
         headers: {
          Authorization: `Bearer ${user.token}` // or whatever key you use for the JWT
          }
      })
        .then(res => setExperiences(res.data))
        .catch(() => setExperiences([]));
    }
  }, [user]);
 

  const handleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  

useEffect(() => {
  localStorage.setItem(likesKey, JSON.stringify(liked));
}, [liked, likesKey]);


  const handleDatePicker = (id) => {
    setDatePickerOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDateChange = (id, date) => {
    setSelectedDate((prev) => ({ ...prev, [id]: date }));
    setDatePickerOpen((prev) => ({ ...prev, [id]: false }));
    if (date) {
      console.log('Date saved:', date.toISOString().split('T')[0]);
    }
  };

  const handleLocationPicker = (id) => {
    setLocationPickerOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLocationChange = async (id, selected) => {
    try {
      // Update the experience in the backend
      const response = await axios.patch(`http://localhost:3000/socialFeatures/communities/patchposts/${id}`, {
        location: selected.value
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      // Update local state
      setExperiences((prev) =>
        prev.map((exp) => (exp._id === id ? { ...exp, location: selected.value } : exp))
      );

      setLocationPickerOpen((prev) => ({ ...prev, [id]: false }));
      console.log('Location saved:', selected.value);
    } catch (err) {
      alert("Failed to update location");
      console.error(err);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewExperience({ title: '', description: '', imageUrl: '',visibility: 'public',
      location: ''  });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisibilityChange = (selected) => {
    setNewExperience((prev) => ({ ...prev, visibility: selected.value }));
  };

  const handleEditVisibilityChange = (selected) => {
    setEditExperience((prev) => ({ ...prev, visibility: selected.value }));
  };

const handleAddExperience = async (e) => {
    e.preventDefault();
    if (!newExperience.title || !newExperience.description || !newExperience.imageUrl) return;
    try {
      await axios.post("http://localhost:3000/socialFeatures/communities/posts", {
        userName: user.username,
        email: user.email,
        ...newExperience
      },
    {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  }
);
      const info = await axios.get(`http://localhost:3000/socialFeatures/posts?email=${user.email}`,{
        
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      
      });
      
      setExperiences(info.data);
      handleCloseModal();
    } catch (err) {
      alert("Failed to add experience",err);
    }
  };

  const handleEditClick = (experience) => {
  setEditExperience(experience);
  setEditModalOpen(true);
};

const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditExperience((prev) => ({ ...prev, [name]: value }));
  };

  // Edit experience
  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`http://localhost:3000/socialFeatures/communities/patchposts/${editExperience._id}`, 
        {
          userName: user.name,
          title: editExperience.title,
          description: editExperience.description,
          imageUrl: editExperience.imageUrl,
          visibility: editExperience.visibility,
          location: editExperience.location // include location
        }
      );
      setExperiences((prev) =>
        prev.map((exp) => (exp._id === editExperience._id ? res.data : exp))
      );
      setEditModalOpen(false);
      setEditExperience(null);
    } catch (err) {
      alert("Failed to update experience",err);
    }
  };

  // Delete experience
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await axios.delete(`http://localhost:3000/socialFeatures/communities/deleteposts/${id}`);
        setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      } catch (err) {
        alert("Failed to delete experience",err);
      }
    }
  };


  return (
    <div className="experience-page">
      <Header />

      <div className="experience-section cards-grid" >
        {experiences.length === 0 ? (
    <div className="no-experiences">
      <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
        Share your experiences with the community!
      </p>
      <button className="add-experience-btn" onClick={handleOpenModal}>
        Add Experience
      </button>
    </div>
  ) : (
    <>
    <div className='experience-header'>
      <h3>My experiences</h3>
    </div>
    
    {experiences.map((experience) => (
            <div key={experience._id} className="card experience-card">
              <img src={experience.imageUrl} alt={experience.title} />
              <h2><strong>{experience.title}</strong></h2>
              <p>{experience.description}</p>
             {experience.location && (
  <div>
    <FaMapMarkerAlt style={{ color: "#1b8dc1", marginRight: 4 }} />
    Location: {experience.location}
  </div>
  
)}
              <div style={{fontSize: "0.9rem", color: "#888", marginBottom: "0.5rem"}}>
                  Visibility: {experience.visibility || "public"}
                </div>
              <div className="icons">
                <img
                  src={
                    liked[experience._id]
                      ? 'data:image/png;base64,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'
                      : 'data:image/png;base64,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'
                  
                  }
                  onClick={() => handleLike(experience._id)}
                  className="icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5654/5654592.png"
                  alt="location"
                  onClick={() => handleLocationPicker(experience._id)}
                  className="icon"
                />
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzspEkAFUukBRCWMZsyRDn48nu1pjEsvq27Q&s"
                  alt="calendar"
                  onClick={() => handleDatePicker(experience._id)}
                  className="icon"
                />
                {datePickerOpen[experience._id] && (
                  <DatePicker
                    selected={selectedDate[experience._id] || null}
                    onChange={(date) => handleDateChange(experience._id, date)}
                    inline
                  />
                )}
                <div className="buttons-row">
  <button className="edit-btn" onClick={() => handleEditClick(experience)}>Edit</button>
  <button className="delete-btn" onClick={() => handleDelete(experience._id)}>Delete</button>
</div>
              </div>
            </div>
          ))}
        
        <div className="card add-card" onClick={handleOpenModal}>
          <span className="plus-icon" >+</span>
        </div>
        </>
  )}
          
        {editModalOpen && editExperience && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Edit Experience</h3>
      <form onSubmit={handleEditSave}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={editExperience.title}
          onChange={handleEditInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={editExperience.description}
          onChange={handleEditInputChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={editExperience.imageUrl}
          onChange={handleEditInputChange}
          required
        />
        <div style={{ margin: "1rem 0" }}>
                  <label>Location</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      name="location"
                      placeholder="Enter location"
                      value={editExperience.location || ""}
                      onChange={handleEditInputChange}
                      style={{ flex: 1 }}
                    />
                    <FaMapMarkerAlt style={{ marginLeft: 8, color: "#1b8dc1" }} />
                  </div>
                </div>
     
        <div style={{margin: "1rem 0"}}>
                  <Select
                    options={visibilityOptions}
                    value={visibilityOptions.find(opt => opt.value === (editExperience.visibility || "public"))}
                    onChange={handleEditVisibilityChange}
                    placeholder="Select visibility"
                  />
                </div>
        <div style={{marginTop: '1rem'}}>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditModalOpen(false)} style={{marginLeft: '1rem'}}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}
        {showModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Add New Experience</h3>
      <form onSubmit={handleAddExperience}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newExperience.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newExperience.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={newExperience.imageUrl}
          onChange={handleInputChange}
          required
        />
        <div style={{ margin: "1rem 0" }}>
                  <label>Location</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      name="location"
                      placeholder="Enter location"
                      value={newExperience.location || ""}
                      onChange={handleInputChange}
                      style={{ flex: 1 }}
                    />
                    <FaMapMarkerAlt style={{ marginLeft: 8, color: "#1b8dc1" }} />
                  </div>
                </div>
        <div style={{margin: "1rem 0"}}>
                  <Select
                    options={visibilityOptions}
                    value={visibilityOptions.find(opt => opt.value === (newExperience.visibility || "public"))}
                    onChange={handleVisibilityChange}
                    placeholder="Select visibility"
                  />
                </div>
        <div style={{marginTop: '1rem'}}>
          <button type="submit">Add</button>
          <button type="button" onClick={handleCloseModal} style={{marginLeft: '1rem'}}>Cancel</button>
        </div>
      </form>

    </div>
  </div>
)}
      </div>

      <div className='community-section'>
        <h2>Communities</h2>
        <div className="community-cards">
          <div className='community-card'>
            <img src="https://images.unsplash.com/photo-1464207687429-7505649dae38?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z3JvdXAlMjB0cmF2ZWx8ZW58MHx8MHx8fDA%3D" alt="image" />
          <h5>Travellerspoint</h5>
          <p> Travellerspoint brings together a community of people who love to travel.We have....</p>
          <div style={{textAlign:"right"}}>
            <p>
            <a href="https://www.travellerspoint.com/" target="_blank" rel="noopener noreferrer">
                Click here
            </a>
          </p>

          </div>
          </div>

          <div className='community-card'>
             <img src="https://www.hackerparadise.org/wp-content/uploads/2023/06/hacker-paradise-remote-work-travel-community-scaled-e1687974236659.webp" alt="image" />
          <h5>JustWravel</h5>
          <p> JustWravel covers a wide range of products. We offer group departures to North India...</p>
          <div style={{textAlign:"right"}}>
            <p>
            <a href="https://www.justwravel.com/" target="_blank" rel="noopener noreferrer">
                Click here
            </a>
          </p>

          </div>

          </div>

         <div className='community-card'>
           <img src="https://miro.medium.com/v2/resize:fit:1400/1*vG6jOPu9fxDKVt-E-0v-TA.jpeg" alt="image" />
          <h5>Worldpackers</h5>
          <p> Meet the Worldpackers travel community. Connect with people from all over the world...</p>
          <div style={{textAlign:"right",marginBottom:"2rem"}}>
            <p>
            <a href="https://www.worldpackers.com/community" target="_blank" rel="noopener noreferrer">
                Click here
            </a>
          </p>

          </div>
         </div>
         <div style={{alignItems:"center",color:"black"}}>
          <p>
          <a href="https://www.google.com/search?q=travel+communities&sca_esv=23d642d60e6ce234&rlz=1C1CHBF_enIN1140IN1141&biw=1280&bih=665&ei=Rr8haIyTEvzd2roP-4684Qk&ved=0ahUKEwiMzvmGz52NAxX8rlYBHXsHL5wQ4dUDCBA&uact=5&oq=travel+communities&gs_lp=Egxnd3Mtd2l6LXNlcnAiEnRyYXZlbCBjb21tdW5pdGllczILEAAYgAQYkQIYigUyCxAAGIAEGJECGIoFMgUQABiABDIGEAAYFhgeMgsQABiABBiGAxiKBTILEAAYgAQYhgMYigVIsz5Q-QRYliZwAXgBkAEAmAGrAaABzgSqAQMwLjS4AQPIAQD4AQGYAgWgAvgEwgIKEAAYsAMY1gQYR8ICDRAAGIAEGLADGEMYigXCAgoQABiABBhDGIoFmAMAiAYBkAYJkgcDMS40oAfjF7IHAzAuNLgH5wQ&sclient=gws-wiz-serp&safe=active&ssui=on">Know more communities</a>
         </p>

         </div>
          
        </div>
        
       </div>

       <footer className="experience-footer">
        <div className="about">
          <h4>About our website..</h4>
          <p>
            TripThreads is more than a tool—it's your companion for exploring, discovering, and creating memories around the globe. Whether you're seeking hidden gems or planning the perfect vacation, we've got you covered.
          </p>
        </div>
        <div className="contact">
          <p>Contact us : <span>+91 9963204753, +91 9884807800</span></p>
          <div className="social-icons">
            <img src="https://i.pinimg.com/736x/19/42/d5/1942d5deb0f788e6228054cd92767ff6.jpg" alt="instagram" />
            <img src="https://i.pinimg.com/736x/bf/70/a6/bf70a612edf2ce2b7b80865989d6df0a.jpg" alt="facebook" />
            <img src="https://i.pinimg.com/736x/dd/26/a9/dd26a9a2100d2d4575353e0ece4ab2a1.jpg" alt="whatsapp" />
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Experience;


