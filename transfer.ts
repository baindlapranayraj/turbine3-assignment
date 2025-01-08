import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const keypair = getKeypairFromEnvironment("SECRET_KEY");

const connection = new Connection(clusterApiUrl("devnet"));
const to = new PublicKey("12r4uFpQHVvVfX3qpAxHhddExdGMecFSZYPcVhxRPZNm");
const transaction = new Transaction();

const tranfer_sol = async (to: PublicKey, from: PublicKey, lamp: number) => {
  try {
    console.log("Making Transaction");
    const trx = transaction.add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: to,
        lamports: lamp,
      })
    );
    trx.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;
    transaction.feePayer = from;

    const response = await sendAndConfirmTransaction(connection, trx, [
      keypair,
    ]);
    console.log(
      `Hears your Explorer Link ==> ${getExplorerLink("transaction", response, "devnet")}`
    );
  } catch (error) {
    console.error(`Oops, something went wrong from tranfer_sol: ${error}`);
  }
};

const transfer_all_sol = async (to: PublicKey, from: PublicKey) => {
  try {
    const balance = await getBalance(connection, keypair.publicKey);
    if (balance == null) {
      console.log("Balance is null");
      return;
    } else if (balance == 0) {
      console.log(`you have ${balance} lamports bro cannot move forward`);
      return;
    }

    const trx = transaction.add(
      SystemProgram.transfer({
        toPubkey: to,
        fromPubkey: from,
        lamports: balance,
      })
    );

    trx.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;
    trx.feePayer = from;

    // calculating the fees
    const fee =
      (await connection.getFeeForMessage(trx.compileMessage(), "confirmed"))
        .value || 0;

    trx.instructions.pop();
    transaction.add(
      SystemProgram.transfer({
        toPubkey: to,
        fromPubkey: from,
        lamports: balance - fee,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);

    console.log(`Success! Check out your TX here:
        https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (error) {
    console.error(`Oops, something went wrong from transfer_all_sol: ${error}`);
  }
};

async function getBalance(connection: Connection, publicKey: PublicKey) {
  try {
    console.log("Checking Balance....");
    const balance = await connection.getBalance(publicKey, "confirmed");
    console.log("Your Balance is: ", balance);
    return balance;
  } catch (error) {
    console.log("Oops Something went wrong!!: ", error);
    return null;
  }
}
// tranfer_sol(to, keypair.publicKey, LAMPORTS_PER_SOL / 10);
transfer_all_sol(to, keypair.publicKey);

// getBalance(connection,keypair.publicKey)
