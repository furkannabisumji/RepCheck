function main(data) {
    try {
        var transactions = data.streamData;

        const AAVE_V3_POOL_ADDRESS = '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951'.toLowerCase();
        const BORROW_FUNCTION_SIGNATURE = '0xa415bcad'; // Function signature for borrow()
        const SUPPLY_FUNCTION_SIGNATURE = '0x02c205f0'; // Function signature for supply()
        const REPAY_FUNCTION_SIGNATURE = '0xee3e210b'; // Function signature for repay()

        let borrowers = [];
        let suppliers = [];
        let repayers = [];

        // Filter transactions
        var filteredList = transactions.filter(tx => {
            return tx.to && 
                tx.to.toLowerCase() === AAVE_V3_POOL_ADDRESS &&
                (tx.input.startsWith(BORROW_FUNCTION_SIGNATURE) ||
                 tx.input.startsWith(SUPPLY_FUNCTION_SIGNATURE) ||
                 tx.input.startsWith(REPAY_FUNCTION_SIGNATURE));
        });

        // Extract borrower addresses for BORROW_FUNCTION_SIGNATURE
        borrowers = filteredList
            .filter(tx => tx.input.startsWith(BORROW_FUNCTION_SIGNATURE)) // Filter borrow transactions
            .map(tx => {
                return {
                    block: parseInt(tx.blockNumber, 16), // Convert hex blockNumber to decimal
                    transactionHash: tx.hash,
                    borrower: tx.from,
                };
            });

        // Extract supplier addresses for SUPPLY_FUNCTION_SIGNATURE
        suppliers = filteredList
            .filter(tx => tx.input.startsWith(SUPPLY_FUNCTION_SIGNATURE)) // Filter supply transactions
            .map(tx => {
                return {
                    block: parseInt(tx.blockNumber, 16), // Convert hex blockNumber to decimal
                    transactionHash: tx.hash,
                    borrower: tx.from,
                };
            });

        // Extract repayer addresses for REPAY_FUNCTION_SIGNATURE
        repayers = filteredList
            .filter(tx => tx.input.startsWith(REPAY_FUNCTION_SIGNATURE)) // Filter repay transactions
            .map(tx => {
                return {
                    block: parseInt(tx.blockNumber, 16), // Convert hex blockNumber to decimal
                    transactionHash: tx.hash,
                    borrower: tx.from,
                };
            });

        // Check if borrowers, suppliers, or repayers arrays are empty
        if (borrowers.length === 0 && suppliers.length === 0 && repayers.length === 0) {
            return {
                block: parseInt(transactions[0].blockNumber, 16), // Convert hex blockNumber to decimal
                message: "No relevant transactions found in this block"
            };
        }

        return {
            borrowers,
            suppliers,
            repayers
        };

    } catch (e) {
        return {
            error: e.message
        };
    }
}
