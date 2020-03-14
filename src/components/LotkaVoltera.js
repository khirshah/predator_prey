import React, { Component } from 'react';
import {Col, Row} from 'react-bootstrap';

import * as d3 from "d3";

import {dataGrid, trajectory} from "./model";
import ControlPanel from "./controlPanel";
import styles from "../styles/lotkaVoltera.css";


export default class LotkaVoltera extends Component {

  constructor(props) {
    super(props);
    //------------------------------------ graph properties ------------------------------
    this.width = 600;
    this.height = 600;
    this.margin = 0;
    this.padding = 50; 

    const xRange = [0,3];
    const yRange = [0,3];
    const xStep = 0.2;
    const yStep = 0.2;

    //-------------------------------------- parameters ---------------------------------
    this.time = {
      start: 1,
      stop: 9.5,
      step: 0.1
    }

    this.modelParams = {
      preyGrowthRate: 2/3,
      preyDeathRate: 4/3,
      predatorGrowthRate: 1,
      predatorDeathRate:1
    } 

    //---------------------------------- vector data ---------------------------------
    this.dataGrid = dataGrid(xRange, yRange, xStep, yStep,this.modelParams);
    //--------------------------------- trajectory ---------------------------------

    this.trajectory = trajectory(this.time,this.modelParams);

    //------------------------------------ datascale -------------------------------------
    const yScale =  d3.scaleLinear().domain(xRange).range([this.height - this.padding,this.padding]);
    const xScale = d3.scaleLinear().domain(yRange).range([this.padding, this.width - this.padding]);

    //------------------------------------ color -----------------------------------------
    const max_magnitude = this.dataGrid.reduce(function (max_, it) {
      return (!isNaN(it.magnitude) && (max_ > it.magnitude)) ? max_ : it.magnitude;
    }, 0); 

    const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([0,max_magnitude]);

    //------------------------------------ STATE -----------------------------------------
    this.state = {
      modelParams: {...this.modelParams},
      trajectory: this.trajectory,   
      xScale,
      xTicks: xScale.ticks(4),
      yScale,
      yTicks: yScale.ticks(4),
      colorScale
    };
  }

  handleParameterChange = (parameter, value) => {
    const { modelParams } = this.state;
    modelParams[parameter] = value
    this.setState({
      modelParams: modelParams
    });

  }

  getTrajectory = (params) => {
    const traj = trajectory(this.time,params);
    this.setState({
      trajectory: traj
    })
  }

  resetParams = () => {
    let { modelParams } = this.state;
    modelParams = { ...this.modelParams };
    this.setState({
      modelParams: modelParams
    })
    this.getTrajectory(modelParams);
  }

  setParams = () => {
    this.getTrajectory(this.state.modelParams);
  }

  renderDataPoints = () => {
    return this.dataGrid.map((i,index) => {
      if (!isNaN(i.magnitude)) {

        const nullX = this.state.xScale(0);
        const nullY = this.state.yScale(0);
        const x = this.state.xScale(i.x);
        const y = this.state.yScale(i.y);
        const modellX = this.state.xScale(i.modellValues[0]);
        const modellY = this.state.yScale(i.modellValues[1]);
        const magnitude = this.state.colorScale(i.magnitude)

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
      .x(d => this.state.xScale(d[0]))
      .y(d => this.state.yScale(d[1]));

    return (     
      <Row>
        <ControlPanel 
          onchange={this.handleParameterChange.bind(this)}
          onshowbuttonclick={this.setParams}
          onresetbuttonclick={this.resetParams}
        />
        <Col className={styles.SVGContainer}>
          <svg 
            className={styles.vectorspace}
            width={this.width+this.margin}
            height={this.height+this.margin}
            padding={this.padding}
          >
            <g className={styles.datapoints}>
              {this.renderDataPoints()}
            </g>
            <g>
              <path d={lineStatic(this.state.trajectory)} stroke="red" fill="none"></path>
            </g>
            {/*-------------------------------- X Axis -----------------------*/}
            <g className={`chart-axis chart-axis--x ${styles.axis}`}
               transform={`translate(0,${this.height-this.padding+5})`}>
                <line
                  x1={this.padding}
                  x2={this.width-this.padding}
                  y1="5"
                  y2="5"
                > 
                </line>
              {this.state.xTicks.map((Xtick) => (
                  <text 
                    key={Xtick}
                    x={this.state.xScale(Xtick)-10}
                    y="27"
                  >
                    {Xtick}
                  </text>
              ))}
              {this.state.xTicks.map((Xtick) => (
                  <line
                    key={Xtick}
                    x1={this.state.xScale(Xtick)}
                    x2={this.state.xScale(Xtick)}
                    y1={5}
                    y2={12}
                  > 
                  </line>              
              ))}
            </g>
            {/*-------------------------------- Y Axis -----------------------*/}
              <g className={`chart-axis chart-axis--y  ${styles.axis}`}>
                <line
                  x1={this.padding-5}
                  x2={this.padding-5}
                  y1={this.padding}
                  y2={this.width-this.padding}
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

              {this.state.yTicks.map((Ytick) => (
                <text 
                  className="tick"
                  key={Ytick}
                  x="12"
                  y={this.state.yScale(Ytick) + 4}
                >
                  {Ytick}
                </text>
              ))}
              {this.state.yTicks.map((Ytick) => (
                <line
                  key={Ytick}
                  x1={this.padding-12}
                  x2={this.padding-5}
                  y1={this.state.yScale(Ytick)}
                  y2={this.state.yScale(Ytick)}
                > 
                </line> 
              ))}
            </g>
          </svg>
        </Col>
      </Row>
    )
  }
}
