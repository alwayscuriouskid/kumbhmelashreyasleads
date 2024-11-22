import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDetailedInventoryAnalytics } from "@/hooks/useDetailedInventoryAnalytics";
import { formatDate } from "@/lib/utils";

export const DetailedInventoryAnalyticsTable = () => {
  const { data: analytics, isLoading } = useDetailedInventoryAnalytics();

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Price Info</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Booking Stats</TableHead>
            <TableHead>Order Stats</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analytics?.map((item) => (
            <TableRow key={item.item_id}>
              <TableCell>{item.type_name}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{item.zone_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.sector_name}
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.sku || "N/A"}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>Current: ${item.current_price}</div>
                  <div className="text-sm text-muted-foreground">
                    Min: ${item.min_price}
                  </div>
                  {item.ltc && (
                    <div className="text-sm text-muted-foreground">
                      LTC: ${item.ltc}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>Qty: {item.quantity}</div>
                  {item.dimensions && (
                    <div className="text-sm text-muted-foreground">
                      Dim: {item.dimensions}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                    ${
                      item.status === "available"
                        ? "bg-green-100 text-green-800"
                        : item.status === "booked"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {item.status}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>Total: {item.total_bookings}</div>
                  <div className="text-sm text-muted-foreground">
                    Confirmed: {item.confirmed_bookings}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>Orders: {item.times_ordered}</div>
                  <div className="text-sm text-muted-foreground">
                    Revenue: ${item.total_revenue}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {formatDate(new Date(item.updated_at))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};