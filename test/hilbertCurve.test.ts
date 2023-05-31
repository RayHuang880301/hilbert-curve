import { expect } from "chai";
import { ethers } from "hardhat";
import { MockContract, MockContract__factory } from "../typechain-types";
import { BigNumber, utils } from "ethers";
import { hIndex2xy, xy2hIndex } from "./hilbert-curve";

describe("Hilbert curve", function () {
  let HilbertCurve: MockContract__factory;
  let hilbertCurve: MockContract;
  const MAX_POW_OF_2 = 128;
  beforeEach(async function () {
    // Deploy contract
    HilbertCurve = await ethers.getContractFactory("MockContract");
    hilbertCurve = await HilbertCurve.deploy();
    await hilbertCurve.deployed();
  });
  it("h index to (x,y)", async function () {
    for (let i = 0; i < 1; i++) {
      const randomHIndex = BigNumber.from(utils.randomBytes(16));
      const [x, y] = hIndex2xy(BigNumber.from(randomHIndex), MAX_POW_OF_2);
      const [x2, y2] = await hilbertCurve.hIndex2xy(randomHIndex, MAX_POW_OF_2);
      expect(x).to.equal(x2);
      expect(y).to.equal(y2);
    }
  });
  it("(x,y) to h index", async function () {
    for (let i = 0; i < 10; i++) {
      const randomX = BigNumber.from(utils.randomBytes(16));
      const randomY = BigNumber.from(utils.randomBytes(16));
      const hIndex1 = xy2hIndex(randomX, randomY, MAX_POW_OF_2);
      const hIndex2 = await hilbertCurve.xy2hIndex(
        randomX,
        randomY,
        MAX_POW_OF_2
      );
      expect(hIndex1).to.equal(hIndex2);
    }
  });
});
