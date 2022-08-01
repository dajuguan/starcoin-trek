import { utils, bcs, encoding, } from "@starcoin/starcoin"
import { starcoinProvider } from "../app";
import { arrayify, hexlify } from '@ethersproject/bytes'

const nodeUrlMap = {
    '251': "https://barnard-seed.starcoin.org",
    '254': "http://localhost:9851"
}

export async function getResource(address,contractaddr, functionId) {
    const resourceType = `${contractaddr}::${functionId}`
    console.log(address,resourceType)
    const resource = await starcoinProvider.getResource(address, resourceType)
    console.log(resource)
    return resource
}

export async function executeFunction(address, functionName, strTypeArgs = [], args = []) {

    const functionId = `${address}::${functionName}`;
    console.log(functionId)
    const tyArgs = utils.tx.encodeStructTypeTags(strTypeArgs);
    if (args.length > 0) {
        args[0] = (function () {
            const se = new bcs.BcsSerializer();
            se.serializeU64(BigInt(args[0].toString(10)));
            return hexlify(se.getBytes());
        })();
    }
    args = args.map(arg => arrayify(arg))
    const nodeUrl = nodeUrlMap[window.starcoin.networkVersion]
    console.log("nodeUrl:", nodeUrl)
    const scriptFunction = utils.tx.encodeScriptFunction(functionId, tyArgs, args,nodeUrl);

    const payloadInHex = (() => {
        const se = new bcs.BcsSerializer();
        scriptFunction.serialize(se);
        return hexlify(se.getBytes());
    })();

    const txParams = {
        data: payloadInHex,
    };

    const transactionHash = await starcoinProvider
        .getSigner()
        .sendUncheckedTransaction(txParams);
    return transactionHash
}




