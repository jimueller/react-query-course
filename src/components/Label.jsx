import { useLabelsData } from "../helpers/useLabelsData";

export function Label({ label }) {
  const labelsQuery = useLabelsData();
  if (labelsQuery.isLoading) return null;
  const labelObj = Array.isArray(labelsQuery.data)
    ? labelsQuery.data.find((queryLabel) => queryLabel.id === label)
    : null;
  if (!labelObj) return null;
  return <span className={`label ${labelObj.color}`}>{labelObj.name}</span>;
}
