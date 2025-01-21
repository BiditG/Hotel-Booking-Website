import React from 'react';
import { useParams } from 'react-router-dom'; // To access the URL params
import './CityDetail.css'; // You can add your own styles
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Button, Paper, Chip, Divider } from '@mui/material'; // Import Material UI components
function CityDetail() {
  const { cityName } = useParams(); // Get city name from URL

  // Full array of cities with detailed information
  const cities = [
    { 
      name: "Aberdeen", 
      description: "Aberdeen, known as the 'Granite City' because of its grey stone buildings, is one of Scotland's most important port cities. Located on the northeast coast, Aberdeen boasts a rich maritime history and has been a center of the North Sea oil industry. The city is famous for its impressive architecture, including the striking granite buildings that give it its nickname.",
      image: '/Aberdeen.jpg',
      view360: 'https://www.360cities.net/image/aberdeen-harbour-sunset-aberdeen-scotland',
      population: "200,000",
      landmarks: ["Aberdeen Art Gallery", "Royal Aberdeen Golf Club", "University of Aberdeen"],
      bestTimeToVisit: "May to September",
      nearbyAttractions: ["Cairngorms National Park", "Balmoral Castle"]
    },
    { 
      name: "Belfast", 
      description: "Belfast, the capital of Northern Ireland, is a city brimming with history, culture, and modern attractions. Once a key industrial city, Belfast is famous for its shipbuilding heritage, most notably as the birthplace of the Titanic.",
      image: '/Belfast.jpg',
      view360: 'https://www.360cities.net/image/belfast-arthur-square',
      population: "340,000",
      landmarks: ["Titanic Belfast", "Belfast City Hall", "Ulster Museum"],
      bestTimeToVisit: "March to May",
      nearbyAttractions: ["Giant's Causeway", "Cave Hill"]
    },
    { 
      name: "Birmingham", 
      description: "Birmingham, the second-largest city in the UK, is a vibrant and diverse urban center with a rich industrial history. Known as the birthplace of the industrial revolution, Birmingham was at the heart of the UK's manufacturing boom in the 18th and 19th centuries. Today, the city is known for its cultural renaissance, boasting a dynamic arts scene, world-class shopping, and exciting nightlife.",
      image: '/Birmingham.jpg',
      view360: 'https://www.360cities.net/image/view-on-birmingham-from-above',
      population: "1.1 million",
      landmarks: ["Birmingham Museum & Art Gallery", "Cadbury World", "Library of Birmingham"],
      bestTimeToVisit: "May to September",
      nearbyAttractions: ["Bournville", "Sutton Park"]
    },
    { 
      name: "Bristol", 
      description: "Bristol, located on the southwest coast of England, is a hub of creativity and innovation. Famous for its maritime history, Bristol was the home of the iconic SS Great Britain, designed by Isambard Kingdom Brunel, and the city's harborside area remains a major focal point for both locals and tourists.",
      image: '/Bristol.jpg',
      view360: 'https://www.360cities.net/image/concorde-g-boaf-on-display-in-aerospace-bristol-museum-england',
      population: "463,000",
      landmarks: ["Clifton Suspension Bridge", "SS Great Britain", "Bristol Zoo Gardens"],
      bestTimeToVisit: "June to August",
      nearbyAttractions: ["Cheddar Gorge", "Bristol Balloon Fiesta"]
    },
    { 
      name: "Cardiff", 
      description: "Cardiff, the capital of Wales, is a city with a rich blend of history, culture, and modern attractions. The city is home to a number of notable landmarks, including Cardiff Castle, a medieval fortress situated in the heart of the city, and the stunning Principality Stadium.",
      image: '/Cardiff.jpg',
      view360: 'https://www.360cities.net/image/drone-view-flying-over-radyr-weir-cardiff-wales-uk-31-08-24',
      population: "364,000",
      landmarks: ["Cardiff Castle", "Principality Stadium", "National Museum Cardiff"],
      bestTimeToVisit: "March to May",
      nearbyAttractions: ["Bute Park", "Cardiff Bay"]
    },
    { 
      name: "Edinburgh", 
      description: "Edinburgh, the capital of Scotland, is a city of stunning contrasts, blending ancient history with modern vibrancy. The city's Old Town is a maze of narrow alleys and cobbled streets, with the imposing Edinburgh Castle perched on an extinct volcano.",
      image: '/Edinburgh.jpg',
      view360: 'https://www.360cities.net/image/st-giles-cathedral-edinburgh-1',
      population: "540,000",
      landmarks: ["Edinburgh Castle", "Arthur’s Seat", "Royal Mile"],
      bestTimeToVisit: "May to September",
      nearbyAttractions: ["Royal Botanic Garden", "Palace of Holyroodhouse"]
    },
    { 
      name: "Glasgow", 
      description: "Glasgow, Scotland's largest city, is a vibrant metropolis known for its music, art, and friendly locals. The city is a hub of creativity, with a thriving music scene and a wealth of art galleries.",
      image: '/Glasgow.jpg',
      view360: 'https://www.360cities.net/image/glasgow-bells-bridge-sunset',
      population: "635,000",
      landmarks: ["Kelvingrove Art Gallery", "Glasgow Cathedral", "Riverside Museum"],
      bestTimeToVisit: "March to May",
      nearbyAttractions: ["Loch Lomond", "Clyde Arc Bridge"]
    },
    { 
      name: "London", 
      description: "London, the capital of England and the UK, is one of the most iconic and culturally significant cities in the world. It is a global financial hub and offers an incredible range of attractions, from historical landmarks like Buckingham Palace, Big Ben, and the Tower of London to cutting-edge contemporary architecture like The Shard.",
      image: '/London.jpg',
      view360: 'https://www.360cities.net/image/tower-bridge-london-6',
      population: "8.9 million",
      landmarks: ["Buckingham Palace", "Big Ben", "The British Museum"],
      bestTimeToVisit: "May to September",
      nearbyAttractions: ["Hyde Park", "Camden Market"]
    },
    { 
      name: "Manchester", 
      description: "Manchester is a city in the northwest of England, known for its rich industrial past, particularly in textiles and engineering, and its dynamic, forward-thinking attitude. The city played a pivotal role in the industrial revolution and is home to the world's first railway station.",
      image: '/Manchester.jpg',
      view360: 'https://www.360cities.net/image/aerial-view-over-manchester',
      population: "553,000",
      landmarks: ["Museum of Science and Industry", "Manchester Art Gallery", "Old Trafford"],
      bestTimeToVisit: "April to June",
      nearbyAttractions: ["Peak District", "Tatton Park"]
    },
    { 
      name: "Newcastle", 
      description: "Newcastle upon Tyne, known simply as Newcastle, is a vibrant city in the northeast of England with a strong industrial heritage. The city's iconic Tyne Bridge spans the River Tyne, connecting Newcastle with Gateshead.",
      image: '/Newcastle.jpg',
      view360: 'https://www.360cities.net/image/october-garden-newcastle-wa',
      population: "148,000",
      landmarks: ["Newcastle Castle", "Tyne Bridge", "The Sage Gateshead"],
      bestTimeToVisit: "May to September",
      nearbyAttractions: ["Hadrian's Wall", "Tynemouth"]
    },
    { 
      name: "Nottingham", 
      description: "Nottingham, the legendary home of Robin Hood, is a city steeped in history and rich in culture. The city’s medieval architecture, including Nottingham Castle and the City of Caves, tells the story of its past.",
      image: '/Nottingham.jpg',
      view360: 'https://www.360cities.net/image/nottingham-general-cemetery',
      population: "321,000",
      landmarks: ["Nottingham Castle", "City of Caves", "Old Market Square"],
      bestTimeToVisit: "May to October",
      nearbyAttractions: ["Sherwood Forest", "Wollaton Hall"]
    },
    { 
      name: "Oxford", 
      description: "Oxford, the city of dreaming spires, is famous for being home to the world’s oldest university. The University of Oxford, established in the 12th century, is spread across many colleges, each with its own architectural splendor.",
      image: '/Oxford.jpg',
      view360: 'https://www.360cities.net/image/triceratops-at-the-oxford-university-museum-of-natural-history',
      population: "154,000",
      landmarks: ["Bodleian Library", "Radcliffe Camera", "Christ Church College"],
      bestTimeToVisit: "April to June",
      nearbyAttractions: ["Oxford Botanic Garden", "Ashmolean Museum"]
    },
    { 
      name: "Plymouth", 
      description: "Plymouth, located on the south coast of Devon, is a historic port city with a rich maritime heritage. The city is famous for being the departure point of the Mayflower, the ship that took the Pilgrims to America in 1620.",
      image: '/Plymouth.jpg',
      view360: 'https://www.360cities.net/image/newplymouth',
      population: "262,000",
      landmarks: ["Mayflower Steps", "Royal Citadel", "National Marine Aquarium"],
      bestTimeToVisit: "May to September",
      nearbyAttractions: ["Dartmoor National Park", "Saltram House"]
    },
    { 
      name: "Swansea", 
      description: "Swansea is a coastal city in Wales known for its beautiful beaches, natural scenery, and cultural heritage. The city is home to the renowned Swansea Marina, where visitors can enjoy picturesque views of the coastline.",
      image: '/Swansea.jpg',
      view360: 'https://www.360cities.net/image/maritime-quarter-swansea-bay-wales',
      population: "246,000",
      landmarks: ["Dylan Thomas Centre", "Swansea Marina", "Clyne Gardens"],
      bestTimeToVisit: "May to August",
      nearbyAttractions: ["Gower Peninsula", "Aberdulais Tin Works"]
    },
    { 
      name: "Bournemouth", 
      description: "Bournemouth, located on the south coast of England, is a popular seaside resort known for its long sandy beaches, stunning cliffs, and beautiful parks. The town has a laid-back, relaxed atmosphere, making it a great destination for a beach holiday.",
      image: '/Bournemouth.jpg',
      view360: 'https://www.360cities.net/image/bournemouth-square-england',
      population: "197,000",
      landmarks: ["Bournemouth Gardens", "Bournemouth Pier", "Oceanarium"],
      bestTimeToVisit: "May to September",
      nearbyAttractions: ["Jurassic Coast", "Sandbanks"]
    },
    { 
      name: "Kent", 
      description: "Kent, known as the 'Garden of England', is famous for its lush countryside, picturesque villages, and historic castles. The county is home to a range of natural beauty, from the white cliffs of Dover to the rolling hills of the Weald.",
      image: '/Kent.jpg',
      view360: 'https://www.360cities.net/image/walmer-castle-kent-england',
      population: "1.8 million",
      landmarks: ["Canterbury Cathedral", "Leeds Castle", "Dover Castle"],
      bestTimeToVisit: "May to September",
      nearbyAttractions: ["White Cliffs of Dover", "Broadstairs"]
    },
  ];

  const city = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());

  return (
    <Container maxWidth="md" style={{marginTop: '120px'}}>
      <Box my={4}>
        {city ? (
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
              {city.name}
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardMedia 
                    component="img" 
                    height="250"
                    image={city.image} 
                    alt={city.name} 
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="body1" paragraph>{city.description}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6">Population:</Typography>
                    <Typography variant="body2">{city.population}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6">Landmarks:</Typography>
                    {city.landmarks.map((landmark, index) => (
                      <Chip label={landmark} key={index} sx={{ marginRight: 1, marginTop: 1 }} />
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6">Best Time to Visit:</Typography>
                    <Typography variant="body2">{city.bestTimeToVisit}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6">Nearby Attractions:</Typography>
                    {city.nearbyAttractions.map((attraction, index) => (
                      <Typography variant="body2" key={index}>{attraction}</Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom>360° View of {city.name}</Typography>
                  <iframe
                    src={city.view360}
                    width="100%"
                    height="400"
                    style={{ border: 'none', borderRadius: '8px' }}
                    title={`360 view of ${city.name}`}
                  ></iframe>
                </Box>
              </Grid>
            </Grid>

            <Box mt={3} display="flex" justifyContent="center">
              <Button variant="contained" color="primary" href="/">
                Back to City List
              </Button>
            </Box>
          </Paper>
        ) : (
          <Typography variant="h5" align="center" color="error">
            City not found.
          </Typography>
        )}
      </Box>
    </Container>

  );
}

export default CityDetail;

