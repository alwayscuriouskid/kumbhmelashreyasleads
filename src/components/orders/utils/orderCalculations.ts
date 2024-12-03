export const calculateOrderAmounts = (subtotal: number) => {
  const gstRate = 0.18; // 18% GST
  const gstAmount = subtotal * gstRate;
  const totalWithGst = subtotal + gstAmount;

  return {
    subtotal,
    gstAmount,
    totalWithGst,
    details: `Subtotal: ₹${subtotal.toFixed(2)}, GST (18%): ₹${gstAmount.toFixed(2)}, Total: ₹${totalWithGst.toFixed(2)}`
  };
};