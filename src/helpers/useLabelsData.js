import { useQuery } from "react-query";
import { defaultLabels } from "./defaultData";

export function useLabelsData() {
  return useQuery(
    ["labels"],
    () => fetch("/api/labels").then((res) => res.json()),
    { staleTime: 1000 * 60 * 60, placeholderData: defaultLabels }
  );
}
