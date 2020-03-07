import React, { Component } from 'react';
import {Col, Row} from 'react-bootstrap';

import * as d3 from "d3";

import {dataGrid, trajectories} from "./model";
import styles from "../styles/lotkaVoltera.css";


export default class LotkaVoltera extends Component {

  constructor(props) {
    super(props);

    const width= 600,
      height= 600,
      margin=0,
      padding= 50 ; 

    this.dataGrid = dataGrid();


    //------------------------------------ datascale ------------------------------
    const yScale =  d3.scaleLinear().domain([0,40]).range([height-padding,padding]);
  
  
    const xScale = d3.scaleLinear().domain([0,60]).range([padding,width-padding]);

      //----------------------------- color --------------------------------
    const max_magnitude = this.dataGrid.reduce(function (max_, it) {
      return (!isNaN(it.magnitude) && (max_ > it.magnitude)) ? max_ : it.magnitude;
    }, 0); 

    const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([0,max_magnitude]);

    //-------------------------------------- axes ----------------------------------
    /*const xAxis = d3.axisBottom()
              .scale(xScale)
              .ticks(6);

    const yAxis = d3.axisLeft()
              .scale(yScale)
              .ticks(4);
*/
    this.trajectories = trajectories();



    this.state = {
      width,
      height,
      padding,
      margin,     
      xScale,
      xTicks: xScale.ticks(6),
      yScale,
      yTicks: yScale.ticks(4),
      colorScale
    };
  }

  renderDataPoints = () => {

    const lineStatic = d3.line()
      .curve(d3.curveLinearClosed)
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));
    

    return this.dataGrid.map((i,index) => {
    
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

  getPathInString = () => {
    const numTrjs = this.trajectories.length;
    let path = "";
    for (let i = 0; i < numTrjs-1; ++i) {
      const trajX = this.trajectories[i][0];
      const trajY = this.trajectories[i][1];
      path = `${path}M ${this.state.xScale(this.state.xScale(trajX))} ${this.state.yScale(this.state.yScale(trajY))} L ${this.state.xScale(this.state.xScale(this.trajectories[i+1][0]))} ${this.state.yScale(this.state.yScale(this.trajectories[i+1][1]))} `
     
      //path = `${path}M ${this.state.xScale(this.trajectories[i].x1)} ${this.state.yScale(this.trajectories[i].y[0])} L ${this.state.xScale(this.trajectories[i+1].x1)} ${this.state.yScale(this.trajectories[i+1].y[0])} `
     
    }
    console.log(path)
    return path;
  }

  render() {

    const lineStatic = d3.line()
      .curve(d3.curveLinearClosed)
      .x(d => this.state.xScale(d[0])) // + this.state.xScale(0)
      .y(d => this.state.yScale(d[1]));
      //.attr("transform", `translate(${5},0)`)

      //`translate(${5},0)`
      //"translate(" + (this.state.xScale(d[0]) - this.state.xScale(0)) + "," + (this.state.yScale(d[1]) - this.state.yScale(0)) + ")"

    console.log(this.trajectories.map((tr => {
      return [tr[0],tr[1],this.state.xScale(tr[0]),this.state.yScale(tr[1]), this.state.xScale(0),this.state.yScale(0)];
    })));
    
    return (     
      <Col>
        <div className={styles.SVGContainer}>
          <svg className={styles.vectorspace} width={this.state.width+this.state.margin} height={this.state.height+this.state.margin} padding={this.state.padding}>
            <g className={styles.datapoints}>
              {this.renderDataPoints()}
              {/* curve*/
                 
              }
            </g>
            <g>
              <path d={lineStatic(this.trajectories)} stroke="red" fill="none"></path>
              {/*<path d={this.getPathInString()} stroke="red"></path>*/}

            </g>
          {/*-------------------------------- X Axis -----------------------*/}
            <g className={`chart-axis chart-axis--x ${styles.axis}`}
               transform={`translate(0,${this.state.height-this.state.padding+5})`}>
                <line
                  x1={this.state.padding}
                  x2={this.state.width-this.state.padding}
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
                  x1={this.state.padding-5}
                  x2={this.state.padding-5}
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
                  x="12"
                  y={this.state.yScale(Ytick) + 4}
                >
                  {Ytick}
                </text>
              ))}
              {this.state.yTicks.map((Ytick) => (
                <line
                  key={Ytick}
                  x1={this.state.padding-12}
                  x2={this.state.padding-5}
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
