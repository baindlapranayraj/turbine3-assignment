import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import "dotenv/config";

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log("The Public key is: ", keypair.publicKey.toBase58());

const connection = new Connection(clusterApiUrl("devnet")); // Connected to devnet

const airdrop_sol = async (connection: Connection, publicKey: PublicKey) => {
  console.log("Requesting Airdrop.....");
  const trx = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
  console.log("Transaction is successfull ✅");
  console.log(getExplorerLink("transaction", trx, "devnet"));
};

airdrop_sol(connection, keypair.publicKey);
