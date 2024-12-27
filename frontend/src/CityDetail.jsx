import React from 'react';
import { useParams } from 'react-router-dom'; // To access the URL params
import './CityDetail.css'; // You can add your own styles
import { Container } from 'react-bootstrap';

function CityDetail() {
  const { cityName } = useParams(); // Get city name from URL

  // For simplicity, assume you have an array of cities with details
  const cities = [
    { 
      name: "Aberdeen", 
      description: "Aberdeen, known as the 'Granite City' because of its grey stone buildings, is one of Scotland's most important port cities. Located on the northeast coast, Aberdeen boasts a rich maritime history and has been a center of the North Sea oil industry. The city is famous for its impressive architecture, including the striking granite buildings that give it its nickname. The University of Aberdeen, one of the oldest universities in the UK, is a major cultural and educational hub. Visitors can enjoy the long, sandy beaches, the stunning views from the cliffs of the coastline, and the nearby Cairngorms National Park, a popular destination for outdoor activities like hiking and skiing.", 
      image: '/Aberdeen.jpg',
      view360: 'https://360-view-link.com/aberdeen' // Replace with actual 360 view link
    },
    { 
      name: "Belfast", 
      description: "Belfast, the capital of Northern Ireland, is a city brimming with history, culture, and modern attractions. Once a key industrial city, Belfast is famous for its shipbuilding heritage, most notably as the birthplace of the Titanic. The Titanic Quarter is home to the Titanic Belfast museum, a world-class visitor attraction. Belfast's city center is full of Victorian and Edwardian architecture, while the nearby hills offer spectacular views. The city's cultural scene is thriving, with a mix of theaters, music venues, and festivals. Key attractions include the Ulster Museum, the Botanic Gardens, and the stunning murals in the Falls and Shankill neighborhoods that tell the story of Belfast’s political past.", 
      image: '/Belfast.jpg',
      view360: 'https://360-view-link.com/belfast' // Replace with actual 360 view link
    },
    { 
      name: "Birmingham", 
      description: "Birmingham, the second-largest city in the UK, is a vibrant and diverse urban center with a rich industrial history. Known as the birthplace of the industrial revolution, Birmingham was at the heart of the UK's manufacturing boom in the 18th and 19th centuries. Today, the city is known for its cultural renaissance, boasting a dynamic arts scene, world-class shopping, and exciting nightlife. Key attractions include the Birmingham Museum and Art Gallery, home to impressive works by Pre-Raphaelite painters, and Symphony Hall, one of the best concert halls in the world. Birmingham’s iconic canals, which were once used for transporting goods, now line the city with beautiful waterfront views, shops, and restaurants.", 
      image: '/Birmingham.jpg',
      view360: 'https://360-view-link.com/birmingham' // Replace with actual 360 view link
    },
    { 
      name: "Bristol", 
      description: "Bristol, located on the southwest coast of England, is a hub of creativity and innovation. Famous for its maritime history, Bristol was the home of the iconic SS Great Britain, designed by Isambard Kingdom Brunel, and the city's harborside area remains a major focal point for both locals and tourists. Known for its vibrant arts scene, Bristol is also the birthplace of the elusive street artist Banksy. The city hosts numerous festivals throughout the year, such as the Bristol International Balloon Fiesta. Visitors can also explore the Clifton Suspension Bridge, a remarkable feat of engineering, and the nearby Bristol Zoo Gardens, which are among the oldest in the world.", 
      image: '/Bristol.jpg',
      view360: 'https://360-view-link.com/bristol' // Replace with actual 360 view link
    },
    { 
      name: "Cardiff", 
      description: "Cardiff, the capital of Wales, is a city with a rich blend of history, culture, and modern attractions. The city is home to a number of notable landmarks, including Cardiff Castle, a medieval fortress situated in the heart of the city, and the stunning Principality Stadium, which hosts major sporting events and concerts. Cardiff Bay, once an industrial hub, has been redeveloped into a thriving area with a range of cultural venues, restaurants, and bars. The National Museum Cardiff offers world-class art exhibitions, and the Wales Millennium Centre hosts a variety of performances, from opera to contemporary dance. Cardiff also boasts some beautiful parks and green spaces, including Bute Park, which is perfect for a relaxing stroll.", 
      image: '/Cardiff.jpg',
      view360: 'https://360-view-link.com/cardiff' // Replace with actual 360 view link
    },
    { 
      name: "Edinburgh", 
      description: "Edinburgh, the capital of Scotland, is a city of stunning contrasts, blending ancient history with modern vibrancy. The city's Old Town is a maze of narrow alleys and cobbled streets, with the imposing Edinburgh Castle perched on an extinct volcano. Visitors can walk along the Royal Mile, a historic street leading from the castle to the Palace of Holyroodhouse, the Queen's official residence in Scotland. Edinburgh is also famous for its festivals, especially the Edinburgh Festival Fringe, the largest arts festival in the world. The city’s cultural life is rich, with the National Gallery of Scotland and the Scottish National Museum showcasing world-renowned art and history. Arthur’s Seat, an extinct volcano, offers panoramic views of the city.", 
      image: '/Edinburgh.jpg',
      view360: 'https://360-view-link.com/edinburgh' // Replace with actual 360 view link
    },
    { 
      name: "Glasgow", 
      description: "Glasgow, Scotland's largest city, is a vibrant metropolis known for its music, art, and friendly locals. The city is a hub of creativity, with a thriving music scene and a wealth of art galleries, including the Kelvingrove Art Gallery and Museum and the Gallery of Modern Art. Glasgow is famous for its architectural diversity, blending Victorian, Edwardian, and contemporary styles. Key landmarks include the Glasgow Cathedral, which dates back to the 12th century, and the Glasgow Science Centre, an interactive museum perfect for families. The city is also home to two of Scotland’s top football teams, Celtic and Rangers, making it a sporting hotspot.", 
      image: '/Glasgow.jpg',
      view360: 'https://360-view-link.com/glasgow' // Replace with actual 360 view link
    },
    { 
      name: "London", 
      description: "London, the capital of England and the UK, is one of the most iconic and culturally significant cities in the world. It is a global financial hub and offers an incredible range of attractions, from historical landmarks like Buckingham Palace, Big Ben, and the Tower of London to cutting-edge contemporary architecture like The Shard. The British Museum, with its world-renowned collection of historical artifacts, and the National Gallery, home to masterpieces by Van Gogh and Rembrandt, make London a haven for art lovers. The West End is the place for world-class theater, while Covent Garden and Oxford Street provide some of the best shopping in the world. London’s diverse neighborhoods offer something for everyone, from the vibrant Camden Market to the chic boutiques of Notting Hill.", 
      image: '/London.jpg',
      view360: 'https://360-view-link.com/london' // Replace with actual 360 view link
    },
    { 
      name: "Manchester", 
      description: "Manchester is a city in the northwest of England, known for its rich industrial past, particularly in textiles and engineering, and its dynamic, forward-thinking attitude. The city played a pivotal role in the industrial revolution and is home to the world's first railway station. Today, Manchester is a cultural powerhouse with an impressive music scene, world-class football teams, and a bustling arts scene. Key attractions include the Museum of Science and Industry, the Manchester Art Gallery, and the National Football Museum. Manchester is also a sporting city, home to both Manchester United and Manchester City football clubs.", 
      image: '/Manchester.jpeg',
      view360: 'https://360-view-link.com/manchester' // Replace with actual 360 view link
    },
    { 
      name: "Newcastle", 
      description: "Newcastle upon Tyne, known simply as Newcastle, is a vibrant city in the northeast of England with a strong industrial heritage. The city's iconic Tyne Bridge spans the River Tyne, connecting Newcastle with Gateshead. The city has a thriving cultural scene, with a wealth of theaters, galleries, and live music venues. Key attractions include the BALTIC Centre for Contemporary Art, Newcastle Castle, and the vibrant Quayside area. Visitors can explore the city’s history at the Newcastle Castle or take in the spectacular views from the top of the Sage Gateshead, a world-class concert hall.", 
      image: '/Newcastle.jpg',
      view360: 'https://360-view-link.com/newcastle' // Replace with actual 360 view link
    },
    { 
      name: "Norwich", 
      description: "Norwich is a historic city in East Anglia with a stunning medieval center. The city's Norwich Castle is a must-see, offering visitors a glimpse into the city’s past, while Norwich Cathedral, with its impressive Norman architecture, is one of the finest in the UK. The city is famous for its independent shops, charming market squares, and vibrant arts scene, with many galleries and theaters to explore. The nearby Norfolk Broads, a network of rivers and lakes, is a popular destination for boat tours and wildlife watching. Norwich is also known for its thriving food scene, with excellent restaurants and local food markets.", 
      image: '/Norwich.jpg',
      view360: 'https://360-view-link.com/norwich' // Replace with actual 360 view link
    },
    { 
      name: "Nottingham", 
      description: "Nottingham, the legendary home of Robin Hood, is a city steeped in history and rich in culture. The city’s medieval architecture, including Nottingham Castle and the City of Caves, tells the story of its past, while the modern side of the city boasts excellent shopping, dining, and entertainment options. Nottingham is famous for its literary history and is a UNESCO City of Literature. Visitors can explore the lively Market Square, the oldest public library in the UK, and the National Justice Museum, which offers insight into the city's history of law and order. The city is also home to two major universities, giving it a youthful, vibrant atmosphere.", 
      image: '/Nottingham.jpg',
      view360: 'https://360-view-link.com/nottingham' // Replace with actual 360 view link
    },
    { 
      name: "Oxford", 
      description: "Oxford, the city of dreaming spires, is famous for being home to the world’s oldest university. The University of Oxford, established in the 12th century, is spread across many colleges, each with its own architectural splendor. The city is full of beautiful buildings, serene courtyards, and world-class libraries. Visitors can explore the Bodleian Library, the Ashmolean Museum, and the famous Radcliffe Camera. Oxford is also known for its green spaces, including the University Parks and Christ Church Meadow. The city is a great place for literature enthusiasts, with many authors, including J.R.R. Tolkien and C.S. Lewis, having studied here.", 
      image: '/Oxford.jpg',
      view360: 'https://360-view-link.com/oxford' // Replace with actual 360 view link
    },
    { 
      name: "Plymouth", 
      description: "Plymouth, located on the south coast of Devon, is a historic port city with a rich maritime heritage. The city is famous for being the departure point of the Mayflower, the ship that took the Pilgrims to America in 1620. Visitors can explore the Mayflower Steps and learn about the city’s connection to this important moment in history at the Mayflower Museum. Plymouth Hoe, a large public space by the sea, offers stunning views over Plymouth Sound. The city is also home to the National Marine Aquarium, and the nearby Dartmoor National Park offers scenic landscapes and outdoor adventures.", 
      image: '/Plymouth.jpg',
      view360: 'https://360-view-link.com/plymouth' // Replace with actual 360 view link
    },
    { 
      name: "Swansea", 
      description: "Swansea is a coastal city in Wales known for its beautiful beaches, natural scenery, and cultural heritage. The city is home to the renowned Swansea Marina, where visitors can enjoy picturesque views of the coastline. Swansea is also famous for being the birthplace of poet Dylan Thomas, and visitors can explore his childhood home and museum. The city has a rich industrial past, particularly in copper and coal, but today it is a vibrant cultural center with excellent shopping, dining, and entertainment options. The Gower Peninsula, a designated Area of Outstanding Natural Beauty, is just a short drive away, offering stunning beaches and outdoor activities.", 
      image: '/Swansea.jpg',
      view360: 'https://360-view-link.com/swansea' // Replace with actual 360 view link
    },
    { 
      name: "Bournemouth", 
      description: "Bournemouth, located on the south coast of England, is a popular seaside resort known for its long sandy beaches, stunning cliffs, and beautiful parks. The town has a laid-back, relaxed atmosphere, making it a great destination for a beach holiday. Visitors can explore the stunning Bournemouth Gardens, the Victorian pier, and the Oceanarium, which is home to a wide variety of marine life. The surrounding area is perfect for outdoor activities, including hiking along the Jurassic Coast, a UNESCO World Heritage site, or enjoying water sports such as surfing and paddleboarding.", 
      image: '/Bourne.jpg',
      view360: 'https://360-view-link.com/bournemouth' // Replace with actual 360 view link
    },
    { 
      name: "Kent", 
      description: "Kent, known as the 'Garden of England', is famous for its lush countryside, picturesque villages, and historic castles. The county is home to a range of natural beauty, from the white cliffs of Dover to the rolling hills of the Weald. Visitors can explore the iconic Canterbury Cathedral, a UNESCO World Heritage site, or visit the beautiful Leeds Castle, known for its picturesque moat. The town of Maidstone offers a blend of history and modern attractions, while the nearby coastal areas offer excellent opportunities for outdoor activities such as hiking, cycling, and bird watching.", 
      image: '/Kent.jpg',
      view360: 'https://360-view-link.com/kent' // Replace with actual 360 view link
    },
  ];
  
  const city = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());

  return (
    <Container>
    <div className="city-detail">
      {city ? (
        <>
          <h1>{city.name}</h1>
          <img src={city.image} alt={city.name} className="city-image" />
          <p>{city.description}</p>

          <h3>360° View of {city.name}</h3>
          <iframe
            src={city.view360}
            width="100%"
            height="600px"
            title={`360 view of ${city.name}`}
          ></iframe>
        </>
      ) : (
        <p>City not found.</p>
      )}
    </div>
    </Container>
  );
}

export default CityDetail;
