import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider, utils } from "@coral-xyz/anchor";
import { Turbin3Prereq, IDL } from "./programs/Turbin3_prereq";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair = getKeypairFromEnvironment("WALLET_KEY");
const connection = new Connection(clusterApiUrl("devnet"));

const github = Buffer.from("baindlapranayraj");
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});
// Create our program
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];

const [enrollment_pda, _bump] = PublicKey.findProgramAddressSync(
  enrollment_seeds,
  program.programId
);

(async () => {
  try {
    const txhash = await program.methods
      .complete(github)
      .accountsPartial({
        signer: keypair.publicKey,
      })
      .signers([keypair])
      .rpc();

    console.log(`Success! Check out your TX here:
            https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.log(`Error from invoke function ${e}`);
  }
})();
