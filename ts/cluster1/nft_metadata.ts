import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://arweave.net/OfaXWm-dwxSixw7RvZbfUagQsAVc6XGaIIGXWahBLNc";
        const metadata = {
            name: "Pinky xyz",
            symbol: "PXYZ",
            description: "Pinky xyz can make your blue day pinky!",
            image,
            attributes: [
                {trait_type: 'Color', value: 'Pink'},
                {trait_type: 'Shape', value: 'Rectangle'},
                {trait_type: 'Size', value: 'Extra Large'},
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your image URI: ", myUri);

        //4. Done
        process.exit(0);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
