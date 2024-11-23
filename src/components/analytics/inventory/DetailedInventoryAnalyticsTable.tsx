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
import { Badge } from "@/components/ui/badge";

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
            <TableHead>Total Quantity</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Reserved</TableHead>
            <TableHead>Sold</TableHead>
            <TableHead>In Maintenance</TableHead>
            <TableHead>Price Info</TableHead>
            <TableHead>Status</TableHead>
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
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.available_quantity}</TableCell>
              <TableCell>
                {item.quantity - item.available_quantity}
              </TableCell>
              <TableCell>
                {item.sold_quantity || 0}
              </TableCell>
              <TableCell>
                {item.maintenance_quantity || 0}
              </TableCell>
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
                <Badge
                  variant={
                    item.status === "available"
                      ? "default"
                      : item.status === "reserved"
                      ? "secondary"
                      : item.status === "maintenance"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {item.status}
                </Badge>
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