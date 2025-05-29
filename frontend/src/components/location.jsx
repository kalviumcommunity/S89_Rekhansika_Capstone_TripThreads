import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate} from 'react-router-dom';
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
  {
    name: "Ujjain",
    info: "Ujjain, located on the eastern bank of the Shipra River in Madhya Pradesh, is one of the seven sacred cities (Sapta Puri) in Hinduism. The city is renowned for the Mahakaleshwar Jyotirlinga temple, one of the twelve Jyotirlingas of Lord Shiva. Ujjain also hosts the Kumbh Mela every 12 years, attracting millions of pilgrims.",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/mahakal%20mandir-ujjain-madhya-pradesh-hero?qlt=82&ts=1726670823380",
    link: "https://en.wikipedia.org/wiki/Ujjain"
  },
  {
    name: "Dwarka",
    info: "Dwarka, situated in Gujarat, is one of the four sacred Char Dham pilgrimage sites. It is believed to be the ancient kingdom of Lord Krishna. The city is home to the Dwarkadhish Temple, dedicated to Krishna, and the nearby Bet Dwarka island, which holds religious significance.",
    image: "https://static.wixstatic.com/media/2d34e5_593655e641794c5c80c09b1b2ec2addf~mv2.jpg/v1/fill/w_480,h_320,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2d34e5_593655e641794c5c80c09b1b2ec2addf~mv2.jpg",
    link: "https://en.wikipedia.org/wiki/Dwarka"
  },
  {
    name: "Somnath",
    info: "The Somnath Temple, located in Prabhas Patan near Veraval in Gujarat, is one of the twelve Jyotirlinga shrines of Lord Shiva. The temple has been destroyed and rebuilt several times in history and stands as a symbol of resilience and faith.",
    image: "https://travelsetu.com/apps/uploads/new_destinations_photos/destination/2023/12/19/455542bf5b64210ffde80b23e558b869_1000x1000.jpeg",
    link: "https://en.wikipedia.org/wiki/Somnath_temple"
  },
  {
    name: "Nageshwar",
    info: "Nageshwar Temple, situated near Dwarka in Gujarat, is one of the twelve Jyotirlinga shrines mentioned in the Shiva Purana. The temple is known for its 25-meter tall statue of Lord Shiva and attracts devotees from all over the country.",
    image: "https://cdn1.prayagsamagam.com/media/2023/01/28141528/Nageshwar-Jyotirlinga.webp",
    link: "https://en.wikipedia.org/wiki/Nageshvara_Jyotirlinga"
  },
  {
    name: "Kedarnath",
    info: "Kedarnath Temple, located in the Garhwal Himalayan range near the Mandakini river in Uttarakhand, is one of the most revered temples dedicated to Lord Shiva. It is one of the twelve Jyotirlingas and part of the Char Dham pilgrimage. The temple is accessible via a trek and is open only during specific months due to extreme weather conditions.",
    image: "https://vl-prod-static.b-cdn.net/system/images/000/585/647/35917b5d6ddd048dd625dcf90451dfc3/original/c1enmy9sl545mfhf9cbms5ohxpb4_9npxlqitpx2vbkq4wu0cwbk78kpq_195917423_101319552145871_1309255429352043870_n.jpeg?1745828427",
    link: "https://en.wikipedia.org/wiki/Kedarnath_Temple"
  },
  {
    name: "Tirupati",
    info: "Tirupati, located in Andhra Pradesh, is home to the Sri Venkateswara Swamy Temple, one of the most visited pilgrimage centers in the world. The temple, dedicated to Lord Venkateswara (a form of Vishnu), is situated on the Tirumala hills and is known for its elaborate rituals and festivals.",
    image: "https://www.livechennai.com/businesslistings/News_photo/Tirupathi-080722.jpg",
    link: "https://en.wikipedia.org/wiki/Venkateswara_Temple,_Tirumala"
  },
  {
    name: "Arunachalam",
    info: "Arunachalam, also known as Tiruvannamalai, is a town in Tamil Nadu famous for the Arunachalesvara Temple dedicated to Lord Shiva. The temple is one of the Pancha Bhoota Stalas, representing the element of fire. The town is also known for the sacred Arunachala hill and the practice of Girivalam (circumambulation).",
    image: "https://static.wixstatic.com/media/d37a82_54721a3ab37041aa8ad3962f85aa220d~mv2.jpg/v1/fill/w_568,h_694,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/d37a82_54721a3ab37041aa8ad3962f85aa220d~mv2.jpg",
    link: "https://en.wikipedia.org/wiki/Arunachalesvara_Temple"
  },
  {
    name: "Badrinath",
    info: "Badrinath, located in Uttarakhand, is one of the Char Dham and Chota Char Dham pilgrimage sites. The town is home to the Badrinath Temple, dedicated to Lord Vishnu. The temple is situated along the Alaknanda River and is surrounded by the Nar and Narayana mountain ranges.",
    image: "https://www.chardham-pilgrimage-tour.com/assets/images/badrinath-banner3.webp",
    link: "https://en.wikipedia.org/wiki/Badrinath_Temple"
  },
  {
    name: "Gangotri",
    info: "Gangotri, situated in Uttarakhand, is the origin of the River Ganges. The Gangotri Temple, dedicated to Goddess Ganga, is one of the Char Dham pilgrimage sites. The temple is located at an altitude of 3,100 meters and is surrounded by the majestic Himalayas.",
    image: "https://gmvnonline.com/uploads/images/destinations/Uttarkashi/Gangotri/gangotri-temple.jpg",
    link: "https://en.wikipedia.org/wiki/Gangotri"
  },
  {
    name: "Yamunotri",
    info: "Yamunotri, located in Uttarakhand, is the source of the Yamuna River. The Yamunotri Temple, dedicated to Goddess Yamuna, is one of the Char Dham pilgrimage sites. The temple is situated at an altitude of 3,293 meters and is accessible via a trek through the Himalayas.",
    image: "https://www.chardham-pilgrimage-tour.com/assets/images/yamunotri-banner3.webp",
    link: "https://en.wikipedia.org/wiki/Yamunotri"
  },
  {
    name: "Varanasi",
    info: "Varanasi, also known as Kashi or Benares, is one of the oldest continuously inhabited cities in the world. Located on the banks of the Ganges in Uttar Pradesh, it is a major cultural and religious hub for Hindus. The city is famous for its ghats, temples, and the Kashi Vishwanath Temple dedicated to Lord Shiva.",
    image: "https://www.travelanddestinations.com/wp-content/uploads/2021/07/Varanasi-waterfront.jpg",
    link: "https://en.wikipedia.org/wiki/Varanasi"
  },
  {
    name: "Puri",
    info: "Puri, situated in Odisha, is renowned for the Jagannath Temple, one of the Char Dham pilgrimage sites. The temple is dedicated to Lord Jagannath (a form of Vishnu) and is famous for the annual Rath Yatra (Chariot Festival). Puri also boasts beautiful beaches along the Bay of Bengal.",
    image: "https://www.livemint.com/lm-img/img/2023/06/07/1600x900/Jagannath_Puri_1686126569128_1686126569264.jpg",
    link: "https://en.wikipedia.org/wiki/Puri"
  },
  {
    name: "Shirdi",
    info: "Shirdi, located in Maharashtra, is the abode of the revered saint Sai Baba. The Shirdi Sai Baba Temple attracts millions of devotees annually. Sai Baba is known for his teachings on love, forgiveness, and helping others, transcending the boundaries of religion.",
    image: "https://blog.irctctourism.com/wp-content/uploads/2023/04/Sai-Baba-Shirdi-tour.jpg",
    link: "https://en.wikipedia.org/wiki/Shirdi"
  },
  {
    name: "Manali",
    info: "Manali, nestled in the Kullu Valley of Himachal Pradesh, is a popular hill station known for its scenic beauty, adventure sports, and cultural heritage. Surrounded by snow-capped mountains and lush forests, it serves as a gateway to the Lahaul and Spiti valleys.",
    image: "https://www.justahotels.com/wp-content/uploads/2023/07/Manali-Travel-Guide.jpg",
    link: "https://en.wikipedia.org/wiki/Manali,_Himachal_Pradesh"
  },
  {
    name: "Munnar",
    info: "Munnar, located in Kerala's Western Ghats, is a hill station renowned for its tea plantations, rolling hills, and biodiversity. The region is home to the endangered Nilgiri Tahr and offers attractions like Eravikulam National Park and Anamudi Peak.",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/top-station-munnar-kerala-1-attr-hero?qlt=82&ts=1726672844426",
    link: "https://en.wikipedia.org/wiki/Munnar"
  },
  {
    name: "Ladakh",
    info: "Ladakh, a region in the northernmost part of India, is known for its stark landscapes, Buddhist monasteries, and unique culture. Popular destinations include Leh, Pangong Lake, Nubra Valley, and the ancient monasteries of Hemis and Thiksey.",
    image: "https://www.captureatrip.com/_next/image?url=https%3A%2F%2Fcaptureatrip-cms-storage.s3.ap-south-1.amazonaws.com%2Fleh_ladkh_in_may_c853e05678.webp&w=3840&q=50",
    link: "https://en.wikipedia.org/wiki/Ladakh"
  },
  {
    name: "Pondicherry",
    info: "Pondicherry, now known as Puducherry, is a coastal town in southern India that was a French colonial settlement until 1954. The city is known for its French Quarter, colonial architecture, beaches, and the spiritual community of Auroville.",
    image: "https://d3sftlgbtusmnv.cloudfront.net/blog/wp-content/uploads/2024/11/Things-To-Do-In-Pondicherry-At-Night-Cover-Image-840x425.jpg",
    link: "https://en.wikipedia.org/wiki/Pondicherry"
  },
  {
    name: "Gokarna",
    info: "Gokarna, located in Karnataka, is a small coastal town known for its pristine beaches and sacred temples. It is a popular pilgrimage site with the Mahabaleshwar Temple and has gained popularity among travelers seeking a quieter alternative to Goa.",
    image: "https://karnatakatourism.org/wp-content/uploads/2020/06/Gokarna5.jpg",
    link: "https://en.wikipedia.org/wiki/Gokarna,_India"
  },
  // Add more places as needed
];

const Location = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialSearch = location.state?.search || '';
  const [search, setSearch] = useState(initialSearch);
  const [results, setResults] = useState(placesData);

  useEffect(() => {
    if (search.trim()) {
      const filtered = placesData.filter(place =>
        place.name.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(placesData);
    }
  }, [search, placesData]);

    const handleFocus = () => {
    if (location.pathname !== '/location') {
      navigate('/location');
    } 
  };

    return (
    <div className="location-container">
      <h3 className="location-title">Search for a Location</h3>
      <input
        type="text"
        placeholder="Type a place name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="location-search-input"
        onFocus={handleFocus}
      />
      <div className="location-results-box">
        {results.length > 0 ? (
          results.map((place, idx) => (
            <a
              key={idx}
              className="location-result"
              href={place.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '10px 0'
              }}
            >
              <img
                src={place.image}
                alt={place.name}
                loading="lazy"
                style={{
                  width: 320,
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 8,
                  flexShrink: 0
                }}
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
    </div>
  );
};

export default Location;