export const formatCurrency = (amount) => {
    // Check if the amount is a valid number, otherwise return 0
    const value = typeof amount === 'number' ? amount : 0;
    
    // Return the formatted currency string
    return value.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    });
};