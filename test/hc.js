function last2bits(x) {
  return x & 3;
}

function hindex2xy(hindex, N) {
  // 1. compute position of node in N=2 curve
  var positions = [
    /* 0: */ [0, 0],
    /* 1: */ [0, 1],
    /* 2: */ [1, 1],
    /* 3: */ [1, 0],
  ];

  var tmp = positions[last2bits(hindex)];
  hindex = hindex >>> 2;

  // 2. iteratively compute coords
  var x = tmp[0];
  var y = tmp[1];

  for (var n = 4; n <= N; n *= 2) {
    var n2 = n / 2; // n2 = length
    switch (last2bits(hindex)) {
      case 0 /* case A: left-bottom */:
        tmp = x;
        x = y;
        y = tmp;
        break;

      case 1 /* case B: left-upper */:
        x = x;
        y = y + n2;
        break;

      case 2 /* case C: right-upper */:
        x = x + n2;
        y = y + n2;
        break;

      case 3 /* case D: right-bottom */:
        tmp = y;
        y = n2 - 1 - x;
        x = n2 - 1 - tmp;
        x = x + n2;
        break;
    }

    hindex = hindex >>> 2;
  }
  return [x, y];
}

// test
// console.log(hindex2xy(33, 8));

function xy2hindex(x, y, N) {
  var hindex = 0;
  for (var n = N; n > 1; n /= 2) {
    var n2 = n / 2; // n2 = length
    if (x >= n2) {
      if (y >= n2) {
        // case C: right-upper
        hindex = hindex * 4 + 2;
        x = x - n2;
        y = y - n2;
      } else {
        // case D: right-bottom
        hindex = hindex * 4 + 3;
        var tmp = y;
        x = x - n2;
        y = n2 - 1 - x;
        x = n2 - 1 - tmp;
      }
    } else {
      if (y >= n2) {
        // case B: left-upper
        hindex = hindex * 4 + 1;
        y = y - n2;
      } else {
        // case A: left-bottom
        hindex = hindex * 4 + 0;
        var tmp = x;
        x = y;
        y = tmp;
      }
    }
    console.log({
      n,
      n2,
      x,
      y,
    });
  }
  return hindex;
}

console.log(xy2hindex(5, 0, 32));

function test() {
  var N = 16;
  var NN = N * N;
  for (var i = 0; i < NN; i++) {
    var xy = hindex2xy(i, N);
    var hindex = xy2hindex(xy[0], xy[1], N);
    var isEq = hindex === i;
    console.log({
      i,
      xy,
      hindex,
      isEq,
    });
  }
}

// test();
