import React from "react";
import { Container, Card, Accordion } from "react-bootstrap";
import "./Contact.css";

function Contact() {
  return (
    
    <>
      <br />
      <br />
      <br />
      <br />
      <Container style={{ padding: "20px" }}>
        <h3>Call Us</h3>
        <br />
        <p>
          Our agents are available to speak with you around the clock to provide
          you with information about us and our locations throughout the world
          as well as help you with your questions, reservations, and requests.
          On this page, you will find the contact information for our World
          Hotels, further down the page, our RESERVATIONS AGENTS.
          <br />
          <br />
          We look forward to hearing from you! In order to manage your request
          or question correctly, WH will process your personal data accordingly.
          Read our privacy policy here. To speak with one of our RESERVATIONS
          AGENTS, don’t hesitate to give us a call using the following telephone
          numbers.
        </p>

        <br />
        <br />

        <Card
          style={{ backgroundColor: "whitesmoke" }}
          className="numberscontainer"
        >
          <Card.Body>
            <p className="contactparagraph">
              To speak with a member of our WH DISCOVERY team regarding your
              account, please feel free to contact us from Monday - Friday
              between 08:00am and 09:00pm or on weekends between the hours of
              08:00am - 05:00pm
            </p>
          </Card.Body>
        </Card>
        <br />
        <br />

        <Card>
          <Accordion style={{ backgroundColor: "whitesmoke" }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>View all help numbers</Accordion.Header>
              <Accordion.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
                <div className="numbercontainer">
                  <div className="number1">
                    <p>
                      <strong>Argentina</strong>: +54 11 68419937
                      <br />
                      <br />
                      <strong>Austria*</strong>: +43 12 67 59 72
                      <br />
                      <br />
                      <strong>Belgium*</strong>: +32 258 80 062
                      <br />
                      <br />
                      <strong>Chile</strong>: +56 2 2760 9024
                      <br />
                      <br />
                      <strong>Colombia</strong>: +57 13819596
                      <br />
                      <br />
                      <strong>Denmark</strong>: +45 32443059
                      <br />
                      <br />
                      <strong>Czech Republic</strong>: +42 0 228 880 714
                      <br />
                      <br />
                      <strong>Finland</strong>: +358942704179
                      <br />
                      <br />
                      <strong>France*</strong>: +33 0185850689
                      <br />
                      <br />
                      <strong>Germany*</strong>: +0049 (0) 30 22380233
                      <br />
                      <br />
                      <strong>Hungary</strong>: +36 18154346
                      <br />
                      <br />
                      <strong>Ireland</strong>: +353 (0) 1 233 2014
                      <br />
                    </p>
                  </div>
                  <div className="number2">
                    <p>
                      <strong>Italy*</strong>: +39 02 87368144
                      <br />
                      <br />
                      <strong>Luxemburgo</strong>: +352 27772097
                      <br />
                      <br />
                      <strong>Mexico</strong>: +52 55 95968237
                      <br />
                      <br />
                      <strong>Poland</strong>: +48 222441252
                      <br />
                      <br />
                      <strong>Portugal</strong>: +351 215 551 026
                      <br />
                      <br />
                      <strong>Romania</strong>: +40 317801218
                      <br />
                      <br />
                      <strong>Slovakia</strong>: +42 1233456575
                      <br />
                      <br />
                      <strong>Spain*</strong>: +34 913 984 96
                      <br />
                      <br />
                      <strong>Switzerland*</strong>: +49 30 2238 8599
                      <br />
                      <br />
                      <strong>The Netherlands*</strong>: +31 (0)20 70 18 042
                      <br />
                      <br />
                      <strong>Thailand</strong>: +66 (0) 2 365 9109
                      <br />
                      <br />
                      <strong>United Kingdom*</strong>: +44 (0)203 49 98 271
                      <br />
                      <br />
                      <strong>United States of America</strong>: +1 212 219 7607
                      <br />
                      <br />
                      <strong>Uruguay</strong>: +598 (0)2 9160001
                    </p>
                  </div>
                </div>
                <br />
                <p style={{ padding: "20px" }}>
                  *Call charges may vary depending on network operator or mobile
                  network provider. **From 0.03 to 0.15€/min from a landline.
                  Ask your telephone provider for exact call charges. Call
                  charges may vary depending on network operator or mobile
                  network provider. ***Please note that you may need to dial an
                  International Direct Dialing prefix (IDD) to make a call from
                  a country to another country. Call charges may vary dependent
                  upon network operator or mobile network provider and may
                  include long distance charges. For most countries, the IDD
                  code is 00. From US, use 011. ****No additional charges from a
                  landline. Call charges may vary depending on mobile network
                  provider. If calling from outside your own country, roaming
                  costs may be charged (international calls from cell phones).
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Rservation by mail</Accordion.Header>
              <Accordion.Body className="anchortag">
                <br />
                To book a maximum of 9 rooms, please contact our Reservations
                Office <br />
                <br />
                <strong>AUSTRIA</strong>:{" "}
                <a href="mailto:reservierungen.at@worldhotels.com">
                  reservierungen.at@worldhotels.com
                </a>
                <br />
                <br />
                <strong>BELGIUM</strong>:{" "}
                <a href="mailto:reservations@worldhotels.com">
                  reservations@worldhotels.com
                </a>
                <br />
                <br />
                <strong>FRANCE</strong>:{" "}
                <a href="mailto:reservations@worldhotels.com">
                  reservations@worldhotels.com
                </a>
                <br />
                <br />
                <strong>GERMANY</strong>:{" "}
                <a href="mailto:reservierungen@worldhotels.com">
                  reservierungen@worldhotels.com
                </a>
                <br />
                <br />
                <strong>ITALY</strong>:{" "}
                <a href="mailto:prenotazioni@worldhotels.com">
                  prenotazioni@worldhotels.com
                </a>
                <br />
                <br />
                <strong>LATIN AMERICA</strong>:{" "}
                <a href="mailto:reservas.ame@worldhotels.com">
                  reservas.ame@worldhotels.com
                </a>
                <br />
                <br />
                <strong>SPAIN</strong>:{" "}
                <a href="mailto:reservas@worldhotels.com">
                  reservas@worldhotels.com
                </a>
                <br />
                <br />
                <strong>THE NETHERLANDS</strong>:{" "}
                <a href="mailto:reserveringen@worldhotels.com">
                  reserveringen@worldhotels.com
                </a>
                <br />
                <br />
                <strong>UNITED KINGDOM</strong>:{" "}
                <a href="mailto:bookings@worldhotels.com">
                  bookings@worldhotels.com
                </a>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card>
      </Container>
    </>
  );
}

export default Contact;
