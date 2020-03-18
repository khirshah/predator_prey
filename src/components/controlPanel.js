import React, { Component } from 'react';
import { Col, Row, InputGroup, FormControl, Button } from 'react-bootstrap';

import styles from "../styles/controlPanel.css";

export default class ControlPanel extends Component {

  renderInputFields = () => {
    return (
      this.props.parameterData.map(d => {
        return (<InputField key={d.name} parameterData={d} onchange={this.props.onchange}/>)
      })
    )
  }

  render() {
    return (
      <Col className={styles.controlPanel}>
        <Row className={styles.parameters}>
          {this.renderInputFields()}
          <Button className={styles.button} variant="outline-dark" onClick={this.props.onshowbuttonclick}>Show</Button>{' '}
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
      const value = this.props.parameterData.value;
      return (
          <InputGroup className={`${styles.parameter} mb-3`}>
            <InputGroup.Prepend>
              <InputGroup.Text className={styles.inputText}>{label}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              className={styles.paramInput}
              defaultValue={value}
              onChange={(event) => this.props.onchange(name,event.target.value)}
              aria-label={name}
            />
          </InputGroup>
    )
  }
}
