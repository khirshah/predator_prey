import React, { Component } from 'react';
import {Col, Row} from 'react-bootstrap';

import * as d3 from "d3";

import {vectorSpace, trajectory} from "./model";
import ControlPanel from "./ControlPanel";
import styles from "../styles/lotkaVoltera.css";
import parameterData from "../data/parameters.json";


export default class LotkaVoltera extends Component {

  constructor(props) {
    super(props);
    //------------------------------------ graph properties ------------------------------
    this.width = 600;
    this.height = 600;
    this.margin = 0;
    this.padding = 50; 

    this.xRange = [0,3];
    this.yRange = [0,3];
    this.xStep = 0.2;
    this.yStep = 0.2;

    //-------------------------------------- parameters ---------------------------------
    this.time = {
      start: 1,
      stop: 9.5,
      step: 0.1
    }

    this.parameterData = parameterData.parameters;

    this.modelParams = {
      preyGrowthRate: 2/3,
      preyDeathRate: 4/3,
      predatorGrowthRate: 1,
      predatorDeathRate:1
    } 

    //---------------------------------- vector data ---------------------------------
    this.vectorSpace = vectorSpace(this.xRange, this.yRange, this.xStep, this.yStep,this.modelParams);

    //--------------------------------- trajectory ---------------------------------
    this.trajectory = trajectory(this.time,this.modelParams);

    //---------------------------------- scale -------------------------------------
    this.yScale =  d3.scaleLinear().domain(this.xRange).range([this.height - this.padding,this.padding]);
    this.xScale = d3.scaleLinear().domain(this.yRange).range([this.padding, this.width - this.padding]);
    this.xTicks = this.xScale.ticks(4);
    this.yTicks = this.yScale.ticks(4);

    //------------------------------------ color -----------------------------------
    const max_magnitude = this.vectorSpace.reduce(function (max_, it) {
      return (!isNaN(it.magnitude) && (max_ > it.magnitude)) ? max_ : it.magnitude;
    }, 0); 

    this.colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([0,max_magnitude]);

    //------------------------------------ STATE -----------------------------------------
    this.state = {
      modelParams: {...this.modelParams},
      trajectory: this.trajectory,
      vectorSpace: [ ...this.vectorSpace ]
    };
  }

  handleParameterChange = (parameter, value) => {
    const { modelParams } = this.state;
    modelParams[parameter] = value
    this.setState({
      modelParams: modelParams
    });
    this.setParams();
  }

  getTrajectory = (params) => {
    const traj = trajectory(this.time,params);
    this.setState({
      trajectory: traj
    })
  }

  getVectorSpace = (params) => {
    const vs = vectorSpace(this.xRange, this.yRange, this.xStep, this.yStep,params);
    this.setState({
      vectorSpace: vs
    })
  }

  resetParams = () => {
    let { modelParams } = this.state;
    modelParams = { ...this.modelParams };
    this.setState({
      modelParams: modelParams
    })
    this.getTrajectory(modelParams);
    this.getVectorSpace(modelParams);
  }

  setParams = () => {
    this.getTrajectory(this.state.modelParams);
    this.getVectorSpace(this.state.modelParams);
  }

  renderDataPoints = (vectorSpace) => {
    return vectorSpace.map((i,index) => {
      if (!isNaN(i.magnitude)) {

        const nullX = this.xScale(0);
        const nullY = this.yScale(0);
        const x = this.xScale(i.x);
        const y = this.yScale(i.y);
        const modellX = this.xScale(i.modellValues[0]);
        const modellY = this.yScale(i.modellValues[1]);
        const magnitude = this.colorScale(i.magnitude)

          return (
            <g key={index} >
              <path 
                d={`M ${x} ${y} L ${modellX + x - nullX} ${modellY + y - nullY}`}
                stroke={magnitude}
                strokeWidth="1"

              />
              <circle 
                r="1.5" 
                cx={x} 
                cy={y}
                fill={magnitude}
              > 
              </circle>
            </g>
          )
        }

      })

    };

  render() {

    const lineStatic = d3.line()
      .curve(d3.curveLinearClosed)
      .x(d => this.xScale(d[0]))
      .y(d => this.yScale(d[1]));

    return (     
      <Row>
        <ControlPanel 
          parameterData={this.parameterData}
          parameterValues={this.state.modelParams}
          onchange={this.handleParameterChange.bind(this)}
          onresetbuttonclick={this.resetParams}
        />
        <Col className={styles.SVGContainer}>
          <svg
            className={styles.vectorspace}
            viewBox={`0 0 ${this.width + this.margin} ${this.height + this.margin}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 'auto' }}
          >
            <g className={styles.datapoints}>
              {this.renderDataPoints(this.state.vectorSpace)}
            </g>
            <g>
              <path d={lineStatic(this.state.trajectory)} stroke="red" fill="none"></path>
            </g>
          <Axes properties={{
            xScale: this.xScale,
            yScale: this.yScale,
            xTicks: this.xTicks,
            yTicks: this.yTicks,
            padding: this.padding,
            margin: this.margin,
            width: this.width,
            height: this.height
          }}/>
          </svg>
        </Col>
      </Row>
    )
  }
}


const Axes = (props) => {

  const {
        xScale,
        yScale,
        xTicks,
        yTicks,
        padding,
        margin,
        width,
        height
        } = props.properties;

  return (
    <g>
     {/*-------------------------------- X Axis -----------------------*/}
      <g className={`chart-axis chart-axis--x ${styles.axis}`}
         transform={`translate(0,${height-padding+5})`}>
          <line
            x1={padding}
            x2={width-padding}
            y1="5"
            y2="5"
          > 
          </line>
        {xTicks.map((Xtick) => (
            <text 
              key={Xtick}
              x={xScale(Xtick)-10}
              y="27"
            >
              {Xtick}
            </text>
        ))}
        {xTicks.map((Xtick) => (
            <line
              key={Xtick}
              x1={xScale(Xtick)}
              x2={xScale(Xtick)}
              y1={5}
              y2={12}
            > 
            </line>              
        ))}
      </g>
      {/*-------------------------------- Y Axis -----------------------*/}
        <g className={`chart-axis chart-axis--y  ${styles.axis}`}>
          <line
            x1={padding-5}
            x2={padding-5}
            y1={padding}
            y2={width-padding}
          > 
          </line>
          <text 
            className="chart-unit"
            transform="rotate(-90)"
            x="0" y="0"
            color="black"
          >
            {"number of foxes"}

          </text>

        {yTicks.map((Ytick) => (
          <text 
            className="tick"
            key={Ytick}
            x="12"
            y={yScale(Ytick) + 4}
          >
            {Ytick}
          </text>
        ))}
        {yTicks.map((Ytick) => (
          <line
            key={Ytick}
            x1={padding-12}
            x2={padding-5}
            y1={yScale(Ytick)}
            y2={yScale(Ytick)}
          > 
          </line> 
        ))}
      </g>
    </g>
  )
}