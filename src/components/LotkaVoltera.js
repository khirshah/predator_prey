import React, { Component } from 'react';
import {Col, Row} from 'react-bootstrap';

import * as d3 from "d3";

import dataGrid from "./model";
import styles from "../styles/lotkaVoltera.css";


export default class LotkaVoltera extends Component {

  constructor(props) {
    super(props);

    const width= 600,
      height= 600,
      margin=100,
      padding= 50 ; 

    //------------------------------------ datascale ------------------------------
    const yScale =  d3.scaleLinear().domain([0,40]).range([height-padding,padding]);
  
  
    const xScale = d3.scaleLinear().domain([0,60]).range([padding,width-padding]);

      //----------------------------- color --------------------------------
    const max_magnitude = dataGrid.reduce(function (max_, it) {
      return (!isNaN(it.magnitude) && (max_ > it.magnitude)) ? max_ : it.magnitude;
    }, 0); 

    const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([0,max_magnitude]);

    //-------------------------------------- axes ----------------------------------
    const xAxis = d3.axisBottom()
              .scale(xScale)
              .ticks(6);

    const yAxis = d3.axisLeft()
              .scale(yScale)
              .ticks(4);

    this.state = {
      width,
      height,
      padding,
      margin,     
      xScale,
      xTicks: xScale.ticks(6),
      yScale,
      yTicks: yScale.ticks(4),
      colorScale,
      xAxis,
      yAxis
    };
  }

  renderDataPoints = () => {
    return dataGrid.map((i,index) => {
    
      if (!isNaN(i.magnitude)) {

          return (
            <g key={index} >
              <path 
                d={`M ${this.state.xScale(0)} ${this.state.yScale(0)} L ${this.state.xScale(i.modellValues[0])} ${this.state.yScale(i.modellValues[1])}`}
                stroke={this.state.colorScale(i.magnitude)}
                strokeWidth="1"
                transform= {`translate(${this.state.xScale(i.x) - this.state.xScale(0)}, ${this.state.yScale(i.y) - this.state.yScale(0)})`}
              />
              <circle 
                r="1.5" 
                cx={this.state.xScale(0)} 
                cy={this.state.yScale(0)}
                fill={this.state.colorScale(i.magnitude)}
                transform= {`translate(${this.state.xScale(i.x) - this.state.xScale(0)}, ${this.state.yScale(i.y) - this.state.yScale(0)})`}
              > 
              </circle>
            </g>
          )
        }

      })

    }

  render() {
    
    return (     
      <Col>
        <div className={styles.SVGContainer}>
          <svg className={styles.vectorspace} width={this.state.width+this.state.margin} height={this.state.height+this.state.margin} padding={this.state.padding}>
            <g className={styles.datapoints}>
              {this.renderDataPoints()}
            </g>
            <g className={`chart-axis chart-axis--x ${styles.axis}`}
               transform={`translate(0,${this.state.height-this.state.padding+5})`}>
                <line
                  x1={this.state.padding}
                  x2={this.state.width-this.state.padding}
                  y1={0}
                  y2={0}
                > 
                </line>
              {this.state.xTicks.map((Xtick) => (
                  <text 
                    key={Xtick}
                    x={this.state.xScale(Xtick)-10}
                    y="20"
                  >
                    {Xtick}
                  </text>
              ))}
              {this.state.xTicks.map((Xtick) => (
                  <line
                    key={Xtick}
                    x1={this.state.xScale(Xtick)}
                    x2={this.state.xScale(Xtick)}
                    y1={0}
                    y2={7}
                  > 
                  </line>              
              ))}
              </g>
              <g className={`chart-axis chart-axis--y  ${styles.axis}`}>
                <line
                  x1={this.state.padding}
                  x2={this.state.padding}
                  y1={this.state.padding}
                  y2={this.state.width-this.state.padding}
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
                  x="0"
                  y={this.state.yScale(Ytick) + 4}
                >
                  {Ytick}
                </text>
              ))}
              {this.state.yTicks.map((Ytick) => (
                <line
                  key={Ytick}
                  x1={this.state.padding}
                  x2={this.state.padding-7}
                  y1={this.state.yScale(Ytick)}
                  y2={this.state.yScale(Ytick)}
                > 
                </line> 
              ))}
            </g>
          </svg>
        </div>
      </Col>
    )
  }
}
