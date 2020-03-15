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
              <InputGroup.Text className={styles.inputText}>prey growth rate</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              className={styles.paramInput}
              placeholder={2/3}
              onChange={(event) => this.props.onchange("preyGrowthRate",event.target.value)}
              aria-label="preyGrowthRate"
              defaultValue="123"
            />
          </InputGroup>
          <InputGroup className={`${styles.parameter} mb-3`}>
            <InputGroup.Prepend>
              <InputGroup.Text className={styles.inputText}>prey death rate</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl 
              className={styles.paramInput}
              placeholder={4/3}
              onChange={(event) => this.props.onchange("preyDeathRate",event.target.value)}
              aria-label="preyDeathRate"
            />
          </InputGroup>
          <InputGroup className={`${styles.parameter} mb-3`}>
            <InputGroup.Prepend>
              <InputGroup.Text className={styles.inputText}>predator growth rate</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              className={styles.paramInput}
              placeholder={1}
              onChange={(event) => this.props.onchange("predatorGrowthRate",event.target.value)}
              aria-label="predatorGrowthRate"
            />
          </InputGroup>
          <InputGroup className={`${styles.parameter} mb-3`}>
            <InputGroup.Prepend>
              <InputGroup.Text className={styles.inputText}>predator death rate</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              className={styles.paramInput}
              placeholder={1}
              onChange={(event) => this.props.onchange("predatorDeathRate",event.target.value)}
              aria-label="predatorDeathRate"
            />
          </InputGroup>
          <Button className={styles.button} variant="outline-dark" onClick={this.props.onshowbuttonclick}>Show</Button>{' '}
          <Button className={styles.button} variant="outline-dark" onClick={this.props.onresetbuttonclick}>Reset</Button>{' '}
        </Row>
      </Col>
      )
  }
}


/*
class InputField extends Component {
  render () {
      return (
        <InputGroup className={`${styles.parameter} mb-3`}>
          <InputGroup.Prepend>
            <InputGroup.Text className={styles.inputText}>prey growth rate</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            className={styles.paramInput}
            placeholder={2/3}
            onChange={(event) => this.props.onchange("preyGrowthRate",event.target.value)}
            aria-label="preyGrowthRate"
          />
        </InputGroup>
    )
  }
}
*/