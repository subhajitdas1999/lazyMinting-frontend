//this is for at the time of off chain NFT selling to get the signature

import { ethers } from "ethers";
import { TypedDataUtils } from "ethers-eip712";

class LazyMint {
  constructor(contractAddress, signer) {
    this.contractAddress = contractAddress;
    this.signer = signer;

    this.types = {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      NFTPackage: [
        { name: "tokenId", type: "uint256" },
        { name: "price", type: "uint256" },
        { name: "tokenURI", type: "string" },
      ],
    };
  }

  async getDomain() {
    const chainId = await this.signer.getChainId();
    const domain = {
      name: "LazyMint",
      version: "1",
      chainId: chainId, //for testing in rinkeby
      verifyingContract: this.contractAddress,
    };

    return domain;
  }

  async getSignature(NFTPackage) {
    const domain = await this.getDomain();
    const typedData = {
      types: this.types,
      primaryType: "NFTPackage",
      domain: domain,
      message: NFTPackage,
    };

    const digest = TypedDataUtils.encodeDigest(typedData);
    const digestHex = ethers.utils.hexlify(digest);
    // console.log(this.signer.address);
    // console.log("My side",digestHex);
    const signature = await this.signer.signMessage(digest);
    return signature;
  }
}

export default LazyMint;
