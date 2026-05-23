import React from 'react'
import {  Button, Card, Col, Row, Stack } from 'react-bootstrap';
import { useRouter } from 'next/router';

const Mission = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/foodItems');
  };


  return (
  
    <Row md={1} className="g-4">
    <Col>
      <Card>
        <Card.Body>
        <Stack direction="vertical" gap={3}>
        <Stack direction="horizontal" gap={20}>
        <Card.Title className="mx-4 font-extrabold">
            Welcome to Dvilla Local Food Store!
          </Card.Title>         
           </Stack>
          <Card.Text className='mx-4 font-extrabold'>
          Our mission is to connect you with the freshest and most nutritious organic food sourced directly from local farms. By choosing local, you're not only enjoying higher-quality produce but also supporting sustainable farming practices and reducing your carbon footprint. Our store offers a wide variety of local organic fruits, vegetables, and other products that contribute to a healthier lifestyle and a more sustainable environment. We invite you to explore our selection and experience the benefits of local, organic food. Together, we can make a positive impact on our community and the planet.
          </Card.Text>
          <Button
            className="hover:scale-105 transition-transform duration-200"
            variant="success"
            onClick={handleClick}
          >
            Go to Local Food Store
          </Button>          </Stack>
        </Card.Body>
      </Card>
    </Col>
  </Row>
  )
}

export default Mission