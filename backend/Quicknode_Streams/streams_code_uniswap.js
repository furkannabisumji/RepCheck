function main(data) {
    try {
     var block = data.streamData.block;
     var receipts = data.streamData.receipts;
     var transactions = data.streamData.block.transactions;
 
     const USDC_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'.toLowerCase();
     const WBTC_ADDRESS = '0x29f2D40B0605204364af54EC677bD022dA425d03'.toLowerCase();
     const WETH_ADDRESS = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'.toLowerCase();
     
 
     const FUNCTION_SIGNATURE = '0x3593564c';
     const THRESHOLD = 0.0005; 
 
     // Filter transactions that match the conditions
     var filteredList = transactions.filter(tx => {
         let tokenOutAddress;
         if (tx.input && tx.input.startsWith(FUNCTION_SIGNATURE)) {
             // Check for USDC address in input slice
             tokenOutAddress = '0x' + tx.input.slice(1506, 1546).toLowerCase();
             if (tokenOutAddress === USDC_ADDRESS) {
                 return true;
             }
 
             // Check for WETH address in input slice
             tokenOutAddress = '0x' + tx.input.slice(1290, 1330).toLowerCase();
             if (tokenOutAddress === WETH_ADDRESS) {
                 return true;
             }
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
                 if (Math.abs(amount0USDC) >= THRESHOLD) {
                     return {
                         block: Number(block.number),
                         transactionHash: tx.hash,
                         amount0Wei: amount0Wei,
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
     // Handle any errors that occur in the try block
     return {
         error: e.message
     };
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
 }