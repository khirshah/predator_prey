import React, { Component } from 'react';

import { render } from 'react-dom'
import ReactDOMServer from 'react-dom/server';
import { ReactSVG } from 'react-svg'

import {Col, Row} from 'react-bootstrap';

import * as d3 from "d3";
//var odex = require('odex');

import dataGrid from "./model";

import styles from "../styles/lotkaVoltera.css"


export default class LotkaVoltera extends Component {

  constructor(props) {

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

    super(props);
    
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
        <div id="SVGContainer">
          <svg id="vectorspace" width={this.state.width+this.state.margin} height={this.state.height+this.state.margin} padding={this.state.padding}>
            <g id="datapoints">
            {this.renderDataPoints()}
            {/*<g className="chart-axis chart-axis--x" transform={`translate(0,${this.state.xScale(0)})`}></g>*/}
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
            {this.state.xTicks.map((d) => (
              <text key={d}
                    x={this.state.xScale(d)}
                    y="20">
                {d}
              </text>
            ))}

            </g>
            <g className={`chart-axis chart-axis--y  ${styles.axis}`}>
              <text className="chart-unit"
                    transform="rotate(-90)"
                    x="60" y="40">
                {"text"}
              </text>


            {this.state.yTicks.map((d) => (
              <text className="tick"
                    key={d}
                    x="0"
                    y={this.state.yScale(d) + 4}>
                {d}
              </text>
            ))}
          </g>
          </svg>
        </div>
      </Col>
    )
  }
}