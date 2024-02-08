// ---------------------------------- IMPORT ------------------------------------------
// --------------------------- React and Bootstrap --------------------------------
import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

// --------------------------  styles ---------------------------------------------
import styles from '../styles/app.css';

// --------------------------  components -----------------------------------------
// import Fig1 from './fig1.js';
import LotkaVoltera from './LotkaVoltera';

// --------------------------------- COMPONENT ----------------------------------------

class App extends Component {
  render() {
    return (
      <Container className={styles.App}>
        <Row className="justify-content-center"><h1> Predator prey model </h1></Row>
        <Row>
          <LotkaVoltera />
        </Row>
      </Container>
    );
  }
}

export default App;
