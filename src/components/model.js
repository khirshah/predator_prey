// import _ from 'lodash';
import * as d3 from 'd3';
import lodash from 'lodash';

const odex = require('odex');


// -------------------------------------- MODEL -----------------------------------------------------------

/*
x′ =  ax  − αxy
y′ = −cy + γxy
*/

const dX_dt = (X, modelParams) => {
  const {
    preyGrowthRate, preyDeathRate, predatorGrowthRate, predatorDeathRate,
  } = modelParams;
  return [preyGrowthRate * X[0] - preyDeathRate * X[0] * X[1],
    predatorGrowthRate * X[0] * X[1] - predatorDeathRate * X[1]];
};


const LotkaVolterra = (a, b, c, d) => function (x, y) {
  return [
    a * y[0] - b * y[0] * y[1],
    c * y[0] * y[1] - d * y[1],
  ];
};

const trajectory = (time, modelParams) => {
  const {
    preyGrowthRate, preyDeathRate, predatorGrowthRate, predatorDeathRate,
  } = modelParams;
  const timeArray = lodash.range([time.start], time.stop, [time.step]);
  const s = new odex.Solver(2);
  const trj = [];

  timeArray.map((t) => {
    const X = s.solve(LotkaVolterra(preyGrowthRate, preyDeathRate, predatorGrowthRate, predatorDeathRate), 0, [2, 1], t).y;
    trj.push([X[0], X[1]]);
  });

  return trj;
};

const trajectory2 = (time, modelParams) => {
  const trjs2 = [];
  const timeArray = lodash.range([time.start], time.stop, [time.step]);
  let initValues = [2, 1];
  for (let t of timeArray) {
    let X = dX_dt(initValues, modelParams);
    let X1 = [parseFloat(initValues[0])+0.5*0.1*parseFloat(initValues[0]),parseFloat(initValues[1])+0.5*0.1*parseFloat(initValues[1])];
    let X2 = dX_dt(X1, modelParams);
    let X3 = [parseFloat(initValues[0])+0.1*parseFloat(X1[0]),parseFloat(initValues[1])+0.1*parseFloat(X1[1])];
    initValues = X3; 
    trjs2.push([X3[0], X3[1]]);
  }

  console.log(trjs2);
};

const hypot = (values) => Math.sqrt(values[0] * values[0] + values[1] * values[1]);


const vectorSpace = (xRange, yRange, xStep, yStep, modelParams) => {
  const xScale = lodash.range([xRange[0]], xRange[1] + xStep, [xStep]);
  const yScale = lodash.range([yRange[0]], yRange[1] + yStep, [yStep]);

  const vectorSpace = xScale.map((xp) => {
    const column = yScale.map((yp) => {
      // compute growth rate????????
      const dataPoint = { x: xp, y: yp, modellValues: dX_dt([xp, yp], modelParams) };

      // Norm of the growth rate
      let M = hypot(dataPoint.modellValues);
      // Avoid zero division errors
      M = M == 0.0 ? 1 : M;
      // Normalize each arrow
      dataPoint.modellValues[0] /= M * 10;
      dataPoint.modellValues[1] /= M * 10;
      dataPoint.magnitude = M;

      return dataPoint;
    });

    return column;
  });

  return vectorSpace.flat(1);
};

export { trajectory, vectorSpace };
