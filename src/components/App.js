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
        <div className={styles.header}><h1> Predator prey model </h1></div>
        <LotkaVoltera />
      </Container>
    );
  }
}

export default App;
