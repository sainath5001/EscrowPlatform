// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public admin;
    
    struct EscrowDeal {
        address payer;
        address payee;
        uint256 amount;
        bool isCompleted;
    }

    mapping(uint256 => EscrowDeal) public deals;
    uint256 public dealCount;

    event FundsDeposited(uint256 dealId, address payer, address payee, uint256 amount);
    event PaymentReleased(uint256 dealId, address payee);
    event RefundIssued(uint256 dealId, address payer);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function depositFunds(address _payee) external payable {
        require(msg.value > 0, "Must send some ether");

        dealCount++;
        deals[dealCount] = EscrowDeal(msg.sender, _payee, msg.value, false);
        emit FundsDeposited(dealCount, msg.sender, _payee, msg.value);
    }

    function releasePayment(uint256 _dealId) external onlyAdmin {
        EscrowDeal storage deal = deals[_dealId];
        require(!deal.isCompleted, "Payment already released");
        require(deal.amount > 0, "No funds to release");

        deal.isCompleted = true;
        payable(deal.payee).transfer(deal.amount);
        emit PaymentReleased(_dealId, deal.payee);
    }

    function refund(uint256 _dealId) external onlyAdmin {
        EscrowDeal storage deal = deals[_dealId];
        require(!deal.isCompleted, "Payment already released");

        deal.isCompleted = true;
        payable(deal.payer).transfer(deal.amount);
        emit RefundIssued(_dealId, deal.payer);
    }
}


//Escrow contract deployed at: 0xf2b166260a727C0a2C716421Ec8Bf81961DC44b7