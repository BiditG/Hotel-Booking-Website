import React from 'react'
import Card from 'react-bootstrap/Card';
import './Explore.css'

function Explore({cities=[]}) {

    const ExploreCards=[];
    

    for (let i=0; i<cities.length; i++){
        const city = cities[i]

      ExploreCards.push(  <Card style={{ width: '18rem',border: "1px groove #007bff" }} key={i} className='cardcon'>
        <Card.Img variant="top" src={city.image} style={{width: '290px', height:'144px'}} />
        <Card.Body>
          <Card.Title>{city.name}</Card.Title>
        </Card.Body>
      </Card>);
    }

  return (
    <>
    <center style={{marginTop:'30px'}} >
    <h2 className='headingexplore'>Explore UK</h2>
    <div className='cards'>{ExploreCards}</div>
    </center>


  </>
);
  
}

export default Explore







