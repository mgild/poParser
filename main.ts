import { PublicKey, Connection } from "@solana/web3.js";
import BN = require("bn.js");

async function loadZeroCopyAggregator(
  con: Connection,
  pubkey: PublicKey
): Promise<any> {
  let buf =
    (await con.getAccountInfo(pubkey))?.data.slice(1) ?? Buffer.from("");
  const parent = new PublicKey(buf.slice(0, 32));
  buf = buf.slice(32);
  const numSuccess = buf.readInt32LE(0);
  buf = buf.slice(4);
  const numError = buf.readInt32LE(0);
  buf = buf.slice(4);
  const result = buf.readDoubleLE(0);
  buf = buf.slice(8);
  const roundOpenSlot = buf.readBigUInt64LE(0);
  buf = buf.slice(8);
  const roundOpenTimestamp = buf.readBigInt64LE(0);
  buf = buf.slice(8);
  const minResponse = buf.readDoubleLE(0);
  buf = buf.slice(8);
  const maxResponse = buf.readDoubleLE(0);
  buf = buf.slice(8);
  const decimalMantissa = new BN(buf.slice(0, 16), "le");
  buf = buf.slice(16);
  const decimalScale = buf.readBigUInt64LE(0);
  buf = buf.slice(8);
  return {
    parent,
    result: {
      numSuccess,
      numError,
      result,
      roundOpenSlot,
      roundOpenTimestamp,
      minResponse,
      maxResponse,
      decimal: {
        mantissa: decimalMantissa,
        scale: decimalScale,
      },
    },
  };
}

async function main() {
  const connection = new Connection("https://api.devnet.solana.com");
  const pubkey = new PublicKey("9csVZ3xrp1MtisJMUchkWQJbYtuwbzsDqf9gYpCdyQ5C");
  console.log(await loadZeroCopyAggregator(connection, pubkey));
}

main().then(
  () => {
    process.exit();
  },
  (err) => {
    console.error("Node failure.");
    console.error(err);
    process.exit(-1);
  }
);
