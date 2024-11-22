import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DetailedLeadMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['detailed-lead-metrics'],
    queryFn: async () => {
      console.log("Fetching detailed lead metrics");
      
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*');

      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }

      const totalLeads = leads?.length || 0;
      const activeLeads = leads?.filter(lead => 
        !['closed', 'lost'].includes(lead.status)
      ).length || 0;
      
      const avgResponseTime = leads?.reduce((sum, lead) => {
        const created = new Date(lead.created_at);
        const updated = new Date(lead.updated_at);
        return sum + (updated.getTime() - created.getTime());
      }, 0) / (leads?.length || 1);

      const conversionRate = leads?.filter(lead => 
        lead.status === 'conclusion'
      ).length / totalLeads * 100 || 0;

      const avgBudget = leads?.reduce((sum, lead) => {
        const budget = parseFloat(lead.budget?.replace(/[^0-9.-]+/g, "") || "0");
        return sum + budget;
      }, 0) / totalLeads || 0;

      const requirementTypes = leads?.reduce((acc, lead) => {
        Object.keys(lead.requirement).forEach(type => {
          if (lead.requirement[type]) {
            acc[type] = (acc[type] || 0) + 1;
          }
        });
        return acc;
      }, {} as Record<string, number>);

      return {
        totalLeads,
        activeLeads,
        avgResponseTime,
        conversionRate,
        avgBudget,
        requirementTypes
      };
    }
  });

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active Lead Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((metrics?.activeLeads || 0) / (metrics?.totalLeads || 1) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics?.activeLeads} active out of {metrics?.totalLeads} total leads
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((metrics?.avgResponseTime || 0) / (1000 * 60 * 60))}h
          </div>
          <p className="text-xs text-muted-foreground">
            Average time to first response
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Avg. Budget Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{(metrics?.avgBudget || 0).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Average budget per lead
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Popular Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {metrics?.requirementTypes && Object.entries(metrics.requirementTypes)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="flex justify-between items-center p-2 rounded-lg border">
                  <span className="text-sm capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-bold">{count}</span>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedLeadMetrics;