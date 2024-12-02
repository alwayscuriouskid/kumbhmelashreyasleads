export const useSalesCalculations = () => {
  const calculateProfitLoss = (
    sellingPrice: number,
    quantity: number,
    landingCost: number,
    minPrice: number
  ) => {
    const totalSelling = sellingPrice * quantity;
    const totalLanding = landingCost * quantity;
    const totalMin = minPrice * quantity;

    const vsLanding = ((totalSelling - totalLanding) / totalLanding) * 100;
    const vsMin = ((totalSelling - totalMin) / totalMin) * 100;

    const profitVsLanding = totalSelling - totalLanding;
    const profitVsMin = totalSelling - totalMin;

    return {
      vsLanding: vsLanding.toFixed(2),
      vsMin: vsMin.toFixed(2),
      profitVsLanding,
      profitVsMin,
    };
  };

  return {
    calculateProfitLoss,
  };
};