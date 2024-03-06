const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function () {

    let acc1, acc2;
    let marketplaceAddress;
    let nftAddress;
    let nft;
    let marketplace;
    let listPrice = ethers.parseEther("0.01", "ether");
  
    beforeEach(async function () {

        [acc1, acc2] = await ethers.getSigners();
        
        const NFTMatketplace = await ethers.getContractFactory("NFTMatketplace");
        marketplace = await NFTMatketplace.deploy();
        await marketplace.waitForDeployment();
        marketplaceAddress = await marketplace.getAddress();
    
        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy();
        await nft.waitForDeployment();
        nftAddress = await nft.getAddress();
    
      });
  
    it("Should be possible to sell NFT", async function () {
      await nft.safeMint(acc1.address, "META_DATA_URI");
      await nft.approve(marketplaceAddress, 0);
      await marketplace.createOffer(0, nftAddress, listPrice); 
  
    });
  
    it("Should allow to buy NFT", async function () {
  
      await nft.safeMint(acc1.address, "META_DATA_URI");
      await nft.approve(marketplaceAddress, 0);
      await marketplace.createOffer(0, nftAddress, listPrice); 
  
      await expect(
        await marketplace
          .connect(acc2)
          .buyNft(0, { value: listPrice })
      )
  
      item = await marketplace.getOfffer(0);
  
      expect(item.isSold).to.equal(true);

    });
  
    it("Should revert if wrong amount", async function () {
  
      await nft.safeMint(acc1.address, "META_DATA_URI");
      await nft.approve(marketplaceAddress, 0);
      await marketplace.createOffer(0, nftAddress, listPrice); 
  
      await expect(
          marketplace.connect(acc2).buyNft(0, { value:  ethers.parseEther("0.02", "ether")})
      ).to.be.revertedWith(
        "Wtong amount of funds!"
      );
  
      item = await marketplace.getOfffer(0);
  
      expect(item.isSold).to.equal(false);
    });

    it("Should not allow to already solded NFT", async function () {
  
      await nft.safeMint(acc1.address, "META_DATA_URI");
      await nft.approve(marketplaceAddress, 0);
      await marketplace.createOffer(0, nftAddress, listPrice); 
  
      await expect(
        await marketplace
          .connect(acc2)
          .buyNft(0, { value: listPrice })
      )
  
      item = await marketplace.getOfffer(0);
  
      expect(item.isSold).to.equal(true);

      await expect(
        marketplace.connect(acc2).buyNft(0, { value:  ethers.parseEther("0.01", "ether")})
      ).to.be.revertedWith(
      "Item is already sold"
      );
    });
  });