function main(data) {
    try {
        var block = data.streamData.block;
        var receipts = data.streamData.receipts;
        var transactions = data.streamData.block.transactions;

        const USDC_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'.toLowerCase();
        const FUNCTION_SIGNATURE = '0x3593564c';
        const THRESHOLD_IN_USDC = 0.005; // Set your threshold here, e.g., 0.50 USDC

        // Filter transactions
        var filteredList = transactions.filter(tx => {
            if (tx.input && tx.input.startsWith(FUNCTION_SIGNATURE)) {
                let tokenOutAddress = '0x' + tx.input.slice(1506, 1546).toLowerCase();
                return tokenOutAddress === USDC_ADDRESS;
            }
            return false;
        });

        // Match filtered transactions with receipts, check logs, and extract data
        var result = filteredList.map(tx => {
            var matchedReceipt = receipts.find(receipt => receipt.transactionHash === tx.hash);
            if (matchedReceipt) {
                var relevantLog = matchedReceipt.logs.find(log =>
                    log.topics &&
                    log.topics[0] === "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
                );

                if (relevantLog) {
                    // Decode amount0 from logData for USDC
                    let amount0Wei = decodeAmount0(relevantLog.data);
                    let amount0USDC = weiToUSDC(amount0Wei);

                    // Only include in result if amount is over the threshold
                    if (Math.abs(amount0USDC) >= THRESHOLD_IN_USDC) {
                        return {
                            block: Number(block.number),
                            transactionHash: tx.hash,
                            amount0Wei: amount0Wei,
                            amount0USDC: amount0USDC,
                            fromUser: matchedReceipt.from
                        };
                    }
                }
            }
            return null;
        }).filter(Boolean); // Remove any null entries

        // Check if the result array is empty
        if (result.length === 0) {
            return {
                block: Number(block.number),
                message: "No transactions met the criteria"
            };
        }

        return {
            result
        };
    } catch (e) {
        return {
            error: e.message
        };
    }
}

function decodeAmount0(logData) {
    // Remove '0x' prefix if present
    logData = logData.startsWith('0x') ? logData.slice(2) : logData;
    // amount0 is the first parameter, so we start at index 0
    let amount0Hex = logData.slice(0, 64);
    // Convert hex to BigInt and then to string
    let amount0 = BigInt('0x' + amount0Hex).toString();
    // If the number is negative (first bit is 1), we need to convert it
    if (amount0Hex[0] >= '8') {
        amount0 = (BigInt(2) ** BigInt(256) - BigInt(amount0)).toString();
        amount0 = '-' + amount0;
    }
    return amount0;
}

function weiToUSDC(weiAmount) {
    // Convert wei to USDC (6 decimal places)
    return Math.abs(parseFloat(weiAmount) / 1e6);
}