import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import './Currency.css';
import { ModalTitle } from 'react-bootstrap';

function Currency() {
  const [show, setShow] = useState(false);  

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} className='Currencybutton'>
        Currency
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Currency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <button>UK pound</button>
          <button> Nepal RS</button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Currency;
