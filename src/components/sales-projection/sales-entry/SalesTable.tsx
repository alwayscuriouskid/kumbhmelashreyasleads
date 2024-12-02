import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SalesTableProps {
  salesEntries: any[];
  calculateProfitLoss: (
    sellingPrice: number,
    quantity: number,
    landingCost: number,
    minPrice: number
  ) => {
    vsLanding: string;
    vsMin: string;
    profitVsLanding: number;
    profitVsMin: number;
  };
}

export const SalesTable = ({ salesEntries, calculateProfitLoss }: SalesTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Inventory Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>P/L vs Landing</TableHead>
            <TableHead>Amount vs Landing</TableHead>
            <TableHead>P/L vs Min</TableHead>
            <TableHead>Amount vs Min</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesEntries?.map((entry) => {
            const profitLoss = calculateProfitLoss(
              entry.selling_price,
              entry.quantity_sold,
              entry.sales_projection_inventory.landing_cost,
              entry.sales_projection_inventory.minimum_price
            );

            return (
              <TableRow key={entry.id}>
                <TableCell>
                  {new Date(entry.sale_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{entry.sales_projection_inventory.name}</TableCell>
                <TableCell>{entry.quantity_sold}</TableCell>
                <TableCell>₹{entry.selling_price}</TableCell>
                <TableCell>{entry.team_location}</TableCell>
                <TableCell
                  className={
                    parseFloat(profitLoss.vsLanding) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {profitLoss.vsLanding}%
                </TableCell>
                <TableCell
                  className={
                    profitLoss.profitVsLanding >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  ₹{profitLoss.profitVsLanding.toFixed(2)}
                </TableCell>
                <TableCell
                  className={
                    parseFloat(profitLoss.vsMin) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {profitLoss.vsMin}%
                </TableCell>
                <TableCell
                  className={
                    profitLoss.profitVsMin >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  ₹{profitLoss.profitVsMin.toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};