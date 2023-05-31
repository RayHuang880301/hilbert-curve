// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../HilbertCurve.sol";

contract MockContract {
    
    function hIndex2xy(uint256 hIndex, uint256 n) external pure returns (uint256 x, uint256 y) {
        return HilbertCurve.hIndex2xy(hIndex, n);
    }

    function xy2hIndex(uint256 x, uint256 y, uint256 n) external pure returns (uint256 hIndex) {
        return HilbertCurve.xy2hIndex(x, y, n);
    }

    function getLeadNodes(uint256 hIndex, uint256 n) external pure returns (uint256[] memory leadNodes) {
        return HilbertCurve.getLeadNodes(hIndex, n);
    }

    function getNodeClass(uint256 hIndex, uint256 n) external pure returns (uint256 nodeClass) {
        return HilbertCurve.getNodeClass(hIndex, n);
    }
}
