import { TableRow, TableCell } from "@/components/ui/table";
import LeadFollowUps from "./LeadFollowUps";
import { Lead } from "@/types/leads";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LeadRowExpandedProps {
  lead: Lead;
  visibleColumns: Record<string, boolean>;
  onFollowUpSubmit: (newFollowUp: any) => void;
}

const LeadRowExpanded = ({ lead, visibleColumns, onFollowUpSubmit }: LeadRowExpandedProps) => {
  const { data: orders } = useQuery({
    queryKey: ['lead-orders', lead.id],
    queryFn: async () => {
      console.log('Fetching orders for lead:', lead.id);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            inventory_item:inventory_items (
              *,
              inventory_type:inventory_types (name)
            )
          )
        `)
        .eq('lead_id', lead.id);

      if (error) throw error;
      return data;
    },
    enabled: !!lead.id
  });

  const { data: bookings } = useQuery({
    queryKey: ['lead-bookings', lead.id],
    queryFn: async () => {
      console.log('Fetching bookings for lead:', lead.id);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          inventory_item:inventory_items (
            *,
            inventory_type:inventory_types (name)
          )
        `)
        .eq('lead_id', lead.id);

      if (error) throw error;
      return data;
    },
    enabled: !!lead.id
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-500",
      confirmed: "bg-green-500/20 text-green-500",
      cancelled: "bg-red-500/20 text-red-500",
      completed: "bg-blue-500/20 text-blue-500"
    };
    return colors[status] || "bg-gray-500/20 text-gray-500";
  };

  return (
    <TableRow>
      <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length + 1}>
        <div className="py-4 space-y-6 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Orders Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders?.length ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), 'PPP')}
                            </div>
                          </div>
                          <Badge className={getStatusBadge(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          Amount: ₹{order.total_amount}
                        </div>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No orders found</div>
                )}
              </CardContent>
            </Card>

            {/* Bookings Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings?.length ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {booking.inventory_item?.inventory_type?.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(booking.start_date), 'PP')} - {format(new Date(booking.end_date), 'PP')}
                            </div>
                          </div>
                          <Badge className={getStatusBadge(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          Amount: ₹{booking.payment_amount}
                        </div>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No bookings found</div>
                )}
              </CardContent>
            </Card>
          </div>

          <LeadFollowUps 
            leadId={lead.id} 
            followUps={lead.followUps} 
            onFollowUpSubmit={onFollowUpSubmit}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LeadRowExpanded;