import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

const token_decimals = 1000000n;

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("9fZDajxYKx1imnMUAMAWrpTyiH1ELiifwDLJo9i7V4qp");

// Recipient address
const to = new PublicKey("7NMkatoB4FiVU3YQzPXeN7FyXCt9CUT8ruXDtoW3opzT");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        let fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);

        // Get the token account of the toWallet address, and if it does not exist, create it
        let toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);

        // Transfer the new token to the "toTokenAccount" we just created
        let tx_hash = await transfer(connection, keypair, fromTokenAccount.address, toTokenAccount.address, keypair.publicKey, 10n * token_decimals);

        console.log("Transaction hash is: ", tx_hash);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();