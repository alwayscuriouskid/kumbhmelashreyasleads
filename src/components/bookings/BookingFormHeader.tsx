import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const BookingFormHeader = ({ title }: { title: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
  </Card>
);