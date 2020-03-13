import React, { Component } from 'react';
import { Col, Row, InputGroup, FormControl, Button } from 'react-bootstrap';

import styles from "../styles/controlPanel.css";

export default class ControlPanel extends Component {

  render() {
    return (
      <Col className={styles.controlPanel}>
        <Row className={styles.parameters}>
          <InputGroup className={`${styles.parameter} mb-3`}>
            <InputGroup.Prepend>
              <InputGroup.Text className={styles.inputText}>preyGrowthRate</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              className={styles.paramInput}
              placeholder={2/3}
              aria-label="preyGrowthRate"
            />
          </InputGroup>
          <InputGroup className={`${styles.parameter} mb-3`}>
            <InputGroup.Prepend>
              <InputGroup.Text className={styles.inputText}>preyDeathRate</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl 
              className={styles.paramInput}
              placeholder={4/3}
              aria-label="preyDeathRate"
            />
          </InputGroup>
          <InputGroup className={`${styles.parameter} mb-3`}>
            <InputGroup.Prepend>
              <InputGroup.Text className={styles.inputText}>predatorGrowthRate</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              className={styles.paramInput}
              placeholder={1}
              aria-label="predatorGrowthRate"
            />
          </InputGroup>
          <InputGroup className={`${styles.parameter} mb-3`}>
            <InputGroup.Prepend>
              <InputGroup.Text className={styles.inputText}>predatorDeathRate</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              className={styles.paramInput}
              placeholder={1}
              aria-label="predatorDeathRate"
            />
          </InputGroup>
          <Button className={styles.button} variant="outline-dark">Show</Button>{' '}
          <Button className={styles.button} variant="outline-dark">Reset</Button>{' '}
        </Row>
      </Col>
      )
  }
}

