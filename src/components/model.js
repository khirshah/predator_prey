//import _ from 'lodash';
import * as d3 from "d3";
import lodash from "lodash";
const odex = require("odex");


//-------------------------------------- MODEL -----------------------------------------------------------
/*

du/dt = au - buv
dv/dt = -cv + dbu*v

with the following notations:

    u: number of preys (for example, rabbits)

    v: number of predators (for example, foxes

*/

//a: the natural growing rate of rabbits, when there's no fox
const rabbitGrowthRate = 2/3;
//b: the natural dying rate of rabbits, due to predation
const rabbitDeathRate = 4/3;
//c: the natural dying rate of fox, when there's no rabbit
const foxDeathRate = 1;
//d: the factor describing how many caught rabbits let create a new fox
const predationRate = 1;


function dX_dt(X, t=0) {
  return [ rabbitGrowthRate * X[0] - rabbitDeathRate*X[0]*X[1],
          predationRate*rabbitDeathRate * X[0]*X[1]- foxDeathRate*X[1]]
};

//Population equillibrium
// when the growth rate is equal to 0. This gives two fixed points:
const X_f0 = [0,0];
const X_f1 = [ foxDeathRate/(predationRate*rabbitDeathRate), rabbitGrowthRate/rabbitDeathRate];

//dX_dt(X_f0) == [0,0] => true
//dX_dt(X_f1) ==[0,0] => true

function d2X_dt2(X, t=0){
    //Return the Jacobian matrix evaluated in X.
    return [[rabbitGrowthRate -rabbitDeathRate*X[1],-rabbitDeathRate*X[0]],
            [rabbitDeathRate*predationRate*X[1] ,-foxDeathRate +rabbitDeathRate*predationRate*X[0]]]
}

//near X_f0, which represents the extinction of both species, we have:
const A_f0 = d2X_dt2(X_f0)          


const LotkaVolterra = function(a, b, c, d) {
  return function(x, y) {
    return [
      a * y[0] - b * y[0] * y[1],
      c * y[0] * y[1] - d * y[1]
    ];
  };
};


/* 
must supply initial data for both of them. 
To find the state of the rabbits and wolves at time 6, 
if the state at time zero is {y0 = 1, y1 = 1}:
//console.log(s.solve(LotkaVolterra(0.6, 0.75, 1, 1), 0, [1, 1], 6).y);
*/


var trajectories = () => {

  const timeArray = lodash.range([1], 9.5, [0.1]);
  const s = new odex.Solver(2);
  const trjs = [];
  
  timeArray.map(t => {
  const X = s.solve(LotkaVolterra(rabbitGrowthRate,rabbitDeathRate, predationRate, foxDeathRate), 0, [2, 1], t).y
    trjs.push([X[0],X[1]]);    
  })

  return trjs;
}


function hypot(values) {
  return Math.sqrt(values[0]*values[0] + values[1]*values[1]);
};


const dataGrid = () => {

  const xScale = lodash.range([0], 3.2, [0.2]);
  const yScale = lodash.range([0], 3.2, [0.2]);

  const dataGrid = xScale.map(xp => {

    let column = yScale.map(yp => {

      //compute growth rate????????
      let dataPoint = {x:xp, y:yp, modellValues: dX_dt([xp,yp])};

      //Norm of the growth rate
      let M = hypot(dataPoint.modellValues);
      //Avoid zero division errors 
      M = M == 0.0 ? 1 : M;
      //Normalize each arrow
      dataPoint.modellValues[0] /= M*10;
      dataPoint.modellValues[1] /= M*10;
      dataPoint.magnitude = M;

      return dataPoint
    });
    
    return column;
  });

  return dataGrid.flat(1);
};

export {trajectories,dataGrid};