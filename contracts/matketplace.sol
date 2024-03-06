// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract NFTMatketplace {

    mapping(uint => Offer) private offersList;
    uint itemId;

    struct Offer {
        uint offerId;
        address nftAddress;
        uint tokenId;
        address payable seller;
        uint price;
        bool isSold;
    }

    function getOfffer(uint _id) public view returns(Offer memory) {
        return offersList[_id];
    }

    function createOffer(uint tokenId, address nftAddress, uint price) public  {
        require(price > 0, "Price must be more then zero");

        offersList[itemId] = Offer(
            itemId,
            nftAddress,
            tokenId,
            payable(msg.sender),
            price,
            false
        );

        itemId++;

        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);
    }

    function buyNft(uint _id) public payable {
        require(offersList[_id].isSold == false, "Item is already sold");
        require(msg.value == offersList[_id].price, "Wtong amount of funds!");

        offersList[_id].seller.transfer(msg.value);
        IERC721(offersList[_id].nftAddress).transferFrom(address(this), msg.sender, offersList[_id].tokenId);

        offersList[_id].isSold = true;

    }

}
