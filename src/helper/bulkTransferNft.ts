import { ALCHEMY_API_KEY, CONTRACT_ADDRESS } from "@/constants";
import { Alchemy, Network, Wallet, Contract, Utils } from "alchemy-sdk";
import { abi } from "./contractAbi";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const config = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.BASE_MAINNET,
};

const web3 = createAlchemyWeb3(
  "https://base-mainnet.g.alchemy.com/v2/PWhN7bXT8gl_GJedGJxVPL2mHdVllZrs"
);

const alchemy = new Alchemy(config);

// @ts-ignore
const nftContract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

const bulkTransferNft = async (
  addresses: string[],
  privateKey: string,
  address: string
) => {
  try {
    const options = { method: "GET", headers: { accept: "application/json" } };
    const availableTokensToTransferResponse = await fetch(
      `https://base-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}&contractAddresses[]=${CONTRACT_ADDRESS}&withMetadata=false&pageSize=1000`,
      options
    );

    const availableTokensToTransfer = (
      await availableTokensToTransferResponse.json()
    ).ownedNfts;

    console.log(availableTokensToTransfer);

    await Promise.all(
      addresses.map(async (to, idx) => {
        const nonce = await alchemy.core.getTransactionCount(address);
        const tokenID = availableTokensToTransfer[idx].tokenId;

        const transaction = {
          from: address,
          to: CONTRACT_ADDRESS,
          nonce: nonce,
          gas: 500000,
          input: nftContract.methods
            .safeTransferFrom(address, to, tokenID)
            .encodeABI(),
          signer: address,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          transaction,
          privateKey
        );
        console.log(signedTx);
        const txn = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction!
        );

        console.log(txn);

        alert("Transfer Complete");
      })
    );
  } catch (err: any) {
    console.log(err);

    alert("Transfer Error:" + err.message);
  }
};

export default bulkTransferNft;
