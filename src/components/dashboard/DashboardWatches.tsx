import { api } from "@/utils/api";

const DashboardWatches = () => {
  const { data: watches } = api.Watches.getAll.useQuery();

  return <div>DashboardWatches</div>;
};

export default DashboardWatches;
