// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CourseMarketplace {
    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    struct Course {
        uint id; //32
        uint price; //32
        bytes32 proof; //32
        address owner; //20
        State state; //1
    }

    mapping(bytes32 => Course) private ownedCourses;
    mapping(uint => bytes32) private ownedCourseHash;
    uint private totalOwnedCourses;
    address public owner;
    error CourseHasOwner();

    constructor(){
        owner=msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }


    function purchaseCourse(bytes16 courseId, bytes32 proof) external payable returns (bytes32) {
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));
        
        if (hasCourseOwnership(courseHash)) {
            revert CourseHasOwner();
        }
        
        uint id = totalOwnedCourses++;
        ownedCourseHash[id] = courseHash;
        ownedCourses[courseHash] = Course({
            id: id,
            price: msg.value,
            proof: proof,
            owner: msg.sender,
            state: State.Purchased
        });
        
        return courseHash;
    }

    function getCourseCount() external view returns (uint) {
        return totalOwnedCourses;
    }

    function getCourseHashAtIndex(uint index) external view returns (bytes32) {
        return ownedCourseHash[index];
    }

    function getCourseByHash(bytes32 courseHash) external view returns (Course memory) {
        return ownedCourses[courseHash];
    }


    function hasCourseOwnership(bytes32 courseHash) private view returns (bool) {
        return ownedCourses[courseHash].owner == msg.sender;
    
    }

    function transferOwnership(address newOwner)public onlyOwner{
        owner=newOwner;
    }

}
