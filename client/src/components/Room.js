import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function Room({ room, fromdate, todate }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="row bs">
            <div className="col-md-4">
                <img
                    src={process.env.PUBLIC_URL + "/" + room.imageurls[0]}
                    className="smallimg"
                    alt="room"
                />
            </div>

            <div className="col-md-7">
                <h5>{room.name}</h5>
                <p><strong>Max Count:</strong> {room.maxcount}</p>
                <p><strong>Phone Number:</strong> {room.phonenumber}</p>
                <p><strong>Type:</strong> {room.type}</p>
                <p><strong>Rent Per Day:</strong> ₹{room.rentperday}</p>

                <div className="button-container">
                    {fromdate && todate && (
                        <Link to={`/book/${room._id}/${fromdate}/${todate}`}>
                            <button className="custom-btn">Book Now</button>
                        </Link>
                    )}
                    <button className="custom-btn" onClick={handleShow}>
                        View Details
                    </button>
                </div>
            </div>

            {/* Modal */}
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{room.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel>
                        {room.imageurls.map((url, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100 bigimg"
                                    src={process.env.PUBLIC_URL + "/" + url}
                                    alt={`Slide ${index}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <p className="mt-3">{room.description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Room;
