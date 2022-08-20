import { possibleStatus } from "../helpers/defaultData";

export function StatusSelect({ value, onChange, noEmptyOption = false }) {
  return (
    <select value={value} onChange={onChange} className="status-select">
      {!noEmptyOption && <option value="">Select a status to filter</option>}
      {possibleStatus.map((ps) => (
        <option key={ps.id} value={ps.id}>
          {ps.label}
        </option>
      ))}
    </select>
  );
}
