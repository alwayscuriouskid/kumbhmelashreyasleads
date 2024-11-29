import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DetailedLeadMetricsProps {
  data?: any[];
}

const DetailedLeadMetrics = ({ data = [] }: DetailedLeadMetricsProps) => {
  console.log("Rendering DetailedLeadMetrics with data:", data);

  const totalLeads = data.length;
  const activeLeads = data.filter(lead => lead.status === 'active').length;
  const avgBudget = data.reduce((sum, lead) => {
    const budget = parseFloat(lead.budget) || 0;
    return sum + budget;
  }, 0) / (totalLeads || 1);

  const requirementTypes = data.reduce((acc: Record<string, number>, lead) => {
    const requirements = lead.requirement || {};
    Object.entries(requirements).forEach(([type, value]) => {
      if (typeof value === 'number' && value > 0) {
        acc[type] = (acc[type] || 0) + 1;
      }
    });
    return acc;
  }, {});

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active Lead Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((activeLeads / totalLeads) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {activeLeads} active out of {totalLeads} total leads
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Avg. Budget Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{avgBudget.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Average budget per lead
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Requirements Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(requirementTypes)
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