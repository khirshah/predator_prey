import React, { Component } from 'react';
import { Col, Row, InputGroup, FormControl, Button } from 'react-bootstrap';
import Slider from '@mui/material/Slider';

import styles from "../styles/controlPanel.css";

export default class ControlPanel extends Component {

  renderInputFields = () => {
    const { parameterData, parameterValues } = this.props;
    return (
      parameterData.map(d => {
        return (
          <div key={d.name}>
            <InputField parameterData={d} parameterValue={parameterValues[d.name]} onchange={this.props.onchange}/>
          </div>
          )
      })
    )
  }

  render() {
    return (
      <Col className={styles.controlPanel}>
        <Row className={styles.parameters}>
          {this.renderInputFields()}
          <Button className={styles.button} variant="outline-dark" onClick={this.props.onresetbuttonclick}>Reset</Button>{' '}
        </Row>
      </Col>
      )
  }
}


class InputField extends Component {
  render () {
      const name = this.props.parameterData.name;
      const label = this.props.parameterData.label;
      const value = this.props.parameterValue;
      return (
        <>
          <InputGroup className={`${styles.parameter} mb-3`}>
            <InputGroup.Text className={styles.inputText}>{label}</InputGroup.Text>
            <FormControl
              className={styles.paramInput}
              value={value}
              onChange={(event) => this.props.onchange(name,event.target.value)}
              aria-label={name}
            />
            <Slider
              min={0}
              max={1.9}
              value={parseFloat(value)} // MUI Slider expects a number
              onChange={(event, newValue) => this.props.onchange(name, newValue)}
              step={0.1} // Assuming a step, react-toolbox might have had a default
              aria-labelledby={label} // For accessibility, using label
            />
          </InputGroup>
        </>
    )
  }
}
