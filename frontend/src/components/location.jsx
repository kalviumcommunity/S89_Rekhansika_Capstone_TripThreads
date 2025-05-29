import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./location.css";

const placesData = [
  {
    name: "Charminar",
    info: "The Charminar is a monument located in Hyderabad, Telangana, India. Constructed in 1591, the landmark is a symbol of Hyderabad and officially incorporated in the emblem of Telangana.[3] The Charminar's long history includes the existence of a mosque on its top floor for more than 425 years. While both historically and religiously significant, it is also known for its popular and busy local markets surrounding the structure, and has become one of the most frequented tourist attractions in Hyderabad. ",
    image: "https://media.hitex.co.in/posts/2022/charminar-the-arc-de-triomphe-of-the-east.jpg?1658579435",
    link: "https://en.wikipedia.org/wiki/Charminar"
  },
  {
    name: "Goa",
    info: "This place is known for its famous beaches, culture, climate, and historical places. You may find colourful architecture, lush greenery, and breathtaking beaches here. Goa is a perfect blend of Portugal and Indian culture. People get attracted to this place to experience world-class music, dance, and sunset.",
    image: "https://media.digitalnomads.world/wp-content/uploads/2021/02/20120605/goa.jpg",
    link: "https://en.wikipedia.org/wiki/Goa"
  },
  {
    name: "The Red Fort",
    info: "The Red Fort Complex was built as the palace fort of Shahjahanabad – the new capital of the fifth Mughal Emperor of India, Shah Jahan. Named for its massive enclosing walls of red sandstone, it is adjacent to an older fort, the Salimgarh, built by Islam Shah Suri in 1546, with which it forms the Red Fort Complex.",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/1-red-fort-delhi-city-ff?qlt=82&ts=1726737172588",
    link: "https://en.wikipedia.org/wiki/The_Red_Fort"
  },
  {
    name: "Mumbai",
    info: "Mumbai, formerly known as Bombay, is the capital city of the Indian state of Maharashtra. It is the most populous city in India and serves as the financial, commercial, and entertainment hub of the country. Mumbai is known for its diverse culture, bustling markets, and iconic landmarks such as the Gateway of India, Marine Drive, and Bollywood film industry. The city is a melting pot of various cultures and languages, making it one of the most vibrant cities in India.",
    image: "https://lp-cms-production.imgix.net/image_browser/Mumbai_nightlife_S.jpg",
    link: "https://en.wikipedia.org/wiki/Mumbai"
  },
  {
    name: "Jaipur",
    info: "Jaipur, also known as the Pink City, is the capital of the Indian state of Rajasthan. It is famous for its historic palaces, forts, and vibrant culture. The city was founded in 1727 by Maharaja Sawai Jai Singh II and is known for its distinctive pink-colored buildings, which were painted to welcome the Prince of Wales in 1876. Jaipur is part of the Golden Triangle tourist circuit along with Delhi and Agra.",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/hawa-mahal-jaipur-rajasthan-city-1-hero?qlt=82&ts=1726660605161",
    link: "https://en.wikipedia.org/wiki/Jaipur"
  },
   {
    name: "Vizag",
    info: "The joys of Visakhapatnam lie in its subtle hints at history, culture with a whiff of modernism in the air. This perfect amalgamation of some of the best aspects of a holiday destination is what makes the city one of the best places to visit with ample places to discover",
    image: "https://sunrayvillageresort.com/blog/admin/assets/img/post/image_2024-10-04-10-56-55_66ffc9f780355.jpg",
    link: "https://vizagtourism.org.in/places-to-visit-in-vizag"
  },
  {
    name: "Taj Mahal",
    info: "The Taj Mahal is famous as a symbol of love and a masterpiece of Indo-Islamic architecture. Built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal, it's a grand mausoleum adorned with intricate marble carvings and inlaid work. The Taj Mahal is also recognized as a UNESCO World Heritage Site and one of the Seven Wonders of the World. ",
    image: "https://th-thumbnailer.cdn-si-edu.com/KclowVjVtgy4uX2kpLxW2bgCaag=/fit-in/1200x0/filters:focal(1471x1061:1472x1062)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/b6/30/b630b48b-7344-4661-9264-186b70531bdc/istock-478831658.jpg",
    link: "https://en.wikipedia.org/wiki/Taj_Mahal"
  },
   {
    name: "Wonderla Amusement Park",
    info: "Wonderla Amusement Park is one of the largest amusement parks in India, located in Hyderabad. It features a wide range of thrilling rides, water slides, and entertainment options for all ages. The park is known for its cleanliness, safety measures, and well-maintained attractions, making it a popular destination for families and thrill-seekers alike.",
    image: "https://www.prestigesouthernstar.info/images/prestige/wonderla-amusement-park.webp",
    link: "https://www.wonderla.com/"
  },
  // Add more places as needed
];

const Location = () => {
  const location = useLocation();
  const initialSearch = location.state?.search || '';
  const [search, setSearch] = useState(initialSearch);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (search.trim()) {
      const filtered = placesData.filter(place =>
        place.name.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [search]);

  return (
    <div className="location-container">
      <h3 className="location-title">Search for a Location</h3>
      <input
        type="text"
        placeholder="Type a place name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="location-search-input"
      />
      {search && (
        <div className="location-results-box">
{results.length > 0 ? (
  results.map((place, idx) => (
    <a
      key={idx}
      className="location-result"
      href={place.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem', padding: '10px 0' }}
    >
      <img
        src={place.image}
        alt={place.name}
        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
      />
      <div>
        <strong style={{ fontSize: '1.1em' }}>{place.name}</strong>
        <div style={{ fontSize: '0.95em', color: '#555' }}>{place.info}</div>
      </div>
    </a>
  ))
) : (
  <div className="location-no-result">No results found.</div>
)}
        </div>
      )}
    </div>
  );
};

export default Location;