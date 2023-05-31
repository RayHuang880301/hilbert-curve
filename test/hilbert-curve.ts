import { BigNumber } from "ethers";

function _last2bits(x: BigNumber) {
  return Number(x.and(3));
}

/**
 *
 * @param hIndex h index
 * @param n power of 2
 * @returns [x, y] coordinates
 */
export const hIndex2xy = (hIndex: BigNumber, n: number) => {
  const N = BigNumber.from(2).pow(n);
  // 1. compute position of node in N=2 curve
  let positions = [
    /* 0: */ [0, 0],
    /* 1: */ [0, 1],
    /* 2: */ [1, 1],
    /* 3: */ [1, 0],
  ];

  var p = positions[_last2bits(hIndex)];
  hIndex = hIndex.shr(2);
  // 2. iteratively compute coords
  let x: BigNumber = BigNumber.from(p[0]);
  let y: BigNumber = BigNumber.from(p[1]);

  let tmp: BigNumber;
  let s: BigNumber;
  for (s = BigNumber.from(4); s.lte(N); s = s.mul(2)) {
    let s2 = s.div(2); // s2 = length
    switch (_last2bits(hIndex)) {
      case 0 /* case A: left-bottom */:
        tmp = x;
        x = y;
        y = tmp;
        break;

      case 1 /* case B: left-upper */:
        x = x;
        // y = y + s2;
        y = BigNumber.from(y).add(s2);
        break;

      case 2 /* case C: right-upper */:
        // x = x + s2;
        x = BigNumber.from(x).add(s2);
        // y = y + s2;
        y = BigNumber.from(y).add(s2);
        break;

      case 3 /* case D: right-bottom */:
        tmp = y;
        // y = s2 - 1 - x;
        y = BigNumber.from(s2).sub(1).sub(x);
        // x = s2 - 1 - tmp;
        x = BigNumber.from(s2).sub(1).sub(tmp);
        // x = x + s2;
        x = BigNumber.from(x).add(s2);
        break;
    }

    hIndex = hIndex.shr(2);
  }
  return [x, y];
};

// test
// console.log(hIndex2xy(BigNumber.from(21639), 16));

export function xy2hIndex(x: BigNumber, y: BigNumber, n: number) {
  let hIndex = BigNumber.from(0);
  let N = BigNumber.from(2).pow(n);
  let s: BigNumber;
  // for (var s = N; s > 1; s /= 2) {
  for (s = N; s.gt(1); s = s.div(2)) {
    let s2 = s.div(2); // s2 = length
    if (x.gte(s2)) {
      if (y.gte(s2)) {
        // case C: right-upper
        // hIndex = hIndex * 4 + 2;
        hIndex = BigNumber.from(hIndex).mul(4).add(2);
        // x = x - s2;
        x = BigNumber.from(x).sub(s2);
        // y = y - s2;
        y = BigNumber.from(y).sub(s2);
      } else {
        // case D: right-bottom
        // hIndex = hIndex * 4 + 3;
        hIndex = BigNumber.from(hIndex).mul(4).add(3);
        var tmp = y;
        // x = x - s2;
        x = BigNumber.from(x).sub(s2);
        // y = s2 - 1 - x;
        y = BigNumber.from(s2).sub(1).sub(x);
        // x = s2 - 1 - tmp;
        x = BigNumber.from(s2).sub(1).sub(tmp);
      }
    } else {
      if (y.gte(s2)) {
        // case B: left-upper
        // hIndex = hIndex * 4 + 1;
        hIndex = BigNumber.from(hIndex).mul(4).add(1);
        // y = y - s2;
        y = BigNumber.from(y).sub(s2);
      } else {
        // case A: left-bottom
        // hIndex = hIndex * 4 + 0;
        hIndex = BigNumber.from(hIndex).mul(4);
        var tmp = x;
        x = y;
        y = tmp;
      }
    }
  }
  return hIndex;
}

// console.log(xy2hIndex(5, 0, 8));

// function test() {
//   var N = 16;
//   var NN = N * N;
//   for (var i = 0; i < NN; i++) {
//     var xy = hIndex2xy(i, N);
//     var hIndex = xy2hIndex(xy[0], xy[1], N);
//     var isEq = hIndex === i;
//     console.log({
//       i,
//       xy,
//       hIndex,
//       isEq,
//     });
//   }
// }
