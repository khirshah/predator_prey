import React from 'react';
import { Col, Row, InputGroup, FormControl, Button } from 'react-bootstrap';
import Slider from '@mui/material/Slider';

import styles from "../styles/controlPanel.module.css";

const InputField = ({ parameterData, parameterValue, onchange }) => {
  const { name, label } = parameterData;

  return (
    <InputGroup className={`${styles.parameter}`}>
      <InputGroup.Text className={styles.inputText}>{label}</InputGroup.Text>
      <FormControl
        className={styles.paramInput}
        value={parameterValue}
        onChange={(event) => onchange(name, event.target.value)}
        aria-label={name}
      />
      <Slider
        min={0}
        max={1.9}
        value={parseFloat(parameterValue)}
        onChange={(event, newValue) => onchange(name, newValue)}
        step={0.1}
        aria-labelledby={label}
        style={{
          color: 'var(--color-lightest)',
        }}
      />
    </InputGroup>
  );
};

const ControlPanel = ({ parameterData, parameterValues, onchange, onresetbuttonclick }) => {
  return (
    <Col className={styles.controlPanel}>
      <Row className={styles.parameters}>
        {parameterData.map(d => (
            <InputField
              key={d.name}
              parameterData={d}
              parameterValue={parameterValues[d.name].toFixed(1)}
              onchange={onchange}
            />
        ))}
        <Button
          className={styles.button}
          variant="outline-light"
          onClick={onresetbuttonclick}
        >
          Reset
        </Button>
      </Row>
    </Col>
  );
};

export default ControlPanel;