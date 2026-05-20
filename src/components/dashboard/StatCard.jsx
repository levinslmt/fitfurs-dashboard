import { Card, CardContent } from "../ui/card";

function StatCard({ title, value }) {
  return (
    <Card className="shadow-sm rounded-2xl">
      <CardContent className="p-6">
        <p className="text-slate-500 text-sm">
          {title}
        </p>

        <h2 className="text-4xl font-bold mt-2">
          {value}
        </h2>
      </CardContent>
    </Card>
  );
}

export default StatCard;