// ---------------------------------- IMPORT ------------------------------------------
// --------------------------- React and Bootstrap --------------------------------
import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// --------------------------  styles ---------------------------------------------
import styles from '../styles/app.css';

// --------------------------  components -----------------------------------------
// import Fig1 from './fig1.js';
import LotkaVoltera from './LotkaVoltera';

// --------------------------------- COMPONENT ----------------------------------------

class App extends Component {
  render() {
    return (
      <Container fluid className={styles.App}>
        <Row className="justify-content-center"><h1> Predator prey model </h1></Row>
        <Row>
          <Col md={12}>
            <LotkaVoltera />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
