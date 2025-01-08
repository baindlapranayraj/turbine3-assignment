import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import "dotenv/config";
import prompt from "prompt-sync";
import bs58 from "bs58";

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`Your new Keypair is: `,keypair);

console.log(`Your new Publickey is ${keypair.publicKey}`);
console.log(`Your new Private key is:`, keypair.secretKey);

// 1.3 Import/Export to Phantom

const promptInput = prompt();
console.log(" ++++++++++++ Welcome to Typecript CLI ++++++++++++ ");

while (true) {
  console.log(
    "1.If you want to input your public key this will convert to bytes"
  );
  console.log("2.If you want to input your Unit8Array");
  console.log("3.If you want to break");

  const value = promptInput("Enter the number: ");

  if (Number(value.trim()) == 1) {
    const publickey = promptInput("Paste your publickey hear: ");
    const byteArray = bs58_to_byte(publickey.trim());
    console.log(`The Unit8Array of your publickey is: `, byteArray);
    continue;
  } else if (Number(value.trim()) == 2) {
    const jsonPrivateKey = JSON.parse(
      promptInput("Paste your private key hear: ")
    );
    const byteArray = byte_to_bs58(jsonPrivateKey);
    console.log(`The base encode of your array is: `, byteArray);
    continue;
  } else if (Number(value.trim()) == 3) {
    break;
  } else {
    console.log("Enter Valid Number");
  }
}

function bs58_to_byte(input: string) {
  return bs58.decode(input);
}

function byte_to_bs58(input: number[]) {
  return bs58.encode(input);
}
