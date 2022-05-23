import { ethers } from "ethers";

const connectToMetamask = async()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return [provider,accounts,signer];
}

export {connectToMetamask};