import React, { useState, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import * as d3 from "d3";
import { vectorSpace, trajectory } from "./model";
import ControlPanel from "./ControlPanel";
import styles from "../styles/lotkaVoltera.css";
import parameterData from "../data/parameters.json";

const Axes = ({ properties }) => {
  const {
    xScale,
    yScale,
    xTicks,
    yTicks,
    padding,
    width,
    height
  } = properties;

  return (
    <g>
      <g className={`chart-axis chart-axis--x ${styles.axis}`}
         transform={`translate(0,${height-padding+5})`}>
        <line x1={padding} x2={width-padding} y1="5" y2="5" />
        {xTicks.map((Xtick) => (
          <text key={Xtick} x={xScale(Xtick)-10} y="27">{Xtick}</text>
        ))}
        {xTicks.map((Xtick) => (
          <line key={Xtick} x1={xScale(Xtick)} x2={xScale(Xtick)} y1={5} y2={12} />
        ))}
      </g>
      <g className={`chart-axis chart-axis--y ${styles.axis}`}>
        <line x1={padding-5} x2={padding-5} y1={padding} y2={width-padding} />
        <text className="chart-unit" transform="rotate(-90)" x="0" y="0" color="black">
          number of foxes
        </text>
        {yTicks.map((Ytick) => (
          <text key={Ytick} x="12" y={yScale(Ytick) + 4}>{Ytick}</text>
        ))}
        {yTicks.map((Ytick) => (
          <line key={Ytick} x1={padding-12} x2={padding-5} y1={yScale(Ytick)} y2={yScale(Ytick)} />
        ))}
      </g>
    </g>
  );
};

const LotkaVoltera = () => {
  // Constants
  const width = 600;
  const height = 600;
  const margin = 0;
  const padding = 50;
  const xRange = [0, 3];
  const yRange = [0, 3];
  const xStep = 0.2;
  const yStep = 0.2;
  const time = { start: 1, stop: 9.5, step: 0.1 };

  const initialParams = {
    preyGrowthRate: 2/3,
    preyDeathRate: 4/3,
    predatorGrowthRate: 1,
    predatorDeathRate: 1
  };

  // Scales and data setup
  const yScale = d3.scaleLinear().domain(xRange).range([height - padding, padding]);
  const xScale = d3.scaleLinear().domain(yRange).range([padding, width - padding]);
  const xTicks = xScale.ticks(4);
  const yTicks = yScale.ticks(4);

  // State
  const [modelParams, setModelParams] = useState(initialParams);
  const [trajectoryData, setTrajectoryData] = useState(() => trajectory(time, initialParams));
  const [vectorSpaceData, setVectorSpaceData] = useState(() => vectorSpace(xRange, yRange, xStep, yStep, initialParams));

  // Color scale
  const colorScale = useMemo(() => {
    const maxMagnitude = vectorSpaceData.reduce((max_, it) =>
      (!isNaN(it.magnitude) && (max_ > it.magnitude)) ? max_ : it.magnitude, 0);
    return d3.scaleSequential(d3.interpolateTurbo).domain([0, maxMagnitude]);
  }, [vectorSpaceData]);

  const handleParameterChange = (parameter, value) => {
    const newParams = { ...modelParams, [parameter]: value };
    setModelParams(newParams);
    setTrajectoryData(trajectory(time, newParams));
    setVectorSpaceData(vectorSpace(xRange, yRange, xStep, yStep, newParams));
  };

  const resetParams = () => {
    setModelParams(initialParams);
    setTrajectoryData(trajectory(time, initialParams));
    setVectorSpaceData(vectorSpace(xRange, yRange, xStep, yStep, initialParams));
  };

  const renderDataPoints = (vectorSpace) => {
    return vectorSpace.map((i, index) => {
      if (!isNaN(i.magnitude)) {
        const nullX = xScale(0);
        const nullY = yScale(0);
        const x = xScale(i.x);
        const y = yScale(i.y);
        const modellX = xScale(i.modellValues[0]);
        const modellY = yScale(i.modellValues[1]);
        const magnitude = colorScale(i.magnitude);

        return (
          <g key={index}>
            <path
              d={`M ${x} ${y} L ${modellX + x - nullX} ${modellY + y - nullY}`}
              stroke={magnitude}
              strokeWidth="1"
            />
            <circle r="1.5" cx={x} cy={y} fill={magnitude} />
          </g>
        );
      }
    });
  };

  const lineStatic = d3.line()
    .curve(d3.curveLinearClosed)
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));

  return (
    <div className={styles.container}>
        <ControlPanel
          parameterData={parameterData.parameters}
          parameterValues={modelParams}
          onchange={handleParameterChange}
          onresetbuttonclick={resetParams}
        />
      <div className={styles.SVGContainer}>
        <svg
          className={styles.vectorspace}
          viewBox={`0 0 ${width + margin} ${height + margin}`}
          preserveAspectRatio="xMidYMid meet"
          padding={padding}
        >
          <g className={styles.datapoints}>
            {renderDataPoints(vectorSpaceData)}
          </g>
          <g>
            <path d={lineStatic(trajectoryData)} stroke="red" fill="none" />
          </g>
          <Axes properties={{
            xScale,
            yScale,
            xTicks,
            yTicks,
            padding,
            margin,
            width,
            height
          }}/>
        </svg>
      </div>
    </div>
  );
};

export default LotkaVoltera;