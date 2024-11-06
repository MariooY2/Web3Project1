// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CourseMarketplace {
    

    struct Course {
        uint id; //32
        uint price; //32
        address owner; //20
        
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


    function purchaseCourse(bytes16 courseId) external payable returns (bytes32) {
        require(msg.value >= 0.1 ether," you sent less than 0.1 ether");
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));
        
        if (hasCourseOwnership(courseHash)) {
            revert CourseHasOwner();
        }
        
        uint id = totalOwnedCourses++;
        ownedCourseHash[id] = courseHash;
        ownedCourses[courseHash] = Course({
            id: id,
            price: msg.value,
            owner: msg.sender
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
    function withdraw(uint Amount) external onlyOwner  { 
        uint balance = address(this).balance;
        require(balance >= Amount, "Amount > Balance cannot withdraw");
        payable(msg.sender).transfer(Amount);
    }

    function sellCourse(bytes32 courseHash) external {
    uint AmountInEth = 1;  // Set amount in Ether
    uint AmountInWei = AmountInEth * 0.1 ether; // Convert Ether to Wei
    
    require(hasCourseOwnership(courseHash), "You don't have ownership of this course");
    require(address(this).balance >= AmountInWei, "Insufficient contract balance");

    // Update state before transferring funds
    delete ownedCourses[courseHash];

    // Transfer funds in Wei to the course owner
    (bool success, ) = payable(msg.sender).call{value: AmountInWei}("");
    require(success, "Transfer failed");
}

}
