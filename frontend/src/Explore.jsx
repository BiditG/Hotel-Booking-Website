import React from 'react'
import Card from 'react-bootstrap/Card';
import './Explore.css'

function Explore({cities=[]}) {

    const ExploreCards=[];
    

    for (let i=0; i<cities.length; i++){
        const city = cities[i]

      ExploreCards.push(  <Card style={{ width: '18rem' }} key={i} className='cardcon'>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>{city.name}</Card.Title>
        </Card.Body>
      </Card>);
    }

  return (
    <>
    <center>
    <h2 style={{fontSize:'30px'}}>Explore UK</h2>
    <div className='cards'>{ExploreCards}</div>
    </center>


  </>
);
  
}

export default Explore