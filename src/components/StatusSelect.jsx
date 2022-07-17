import { possibleStatus } from "../helpers/defaultData";

export function StatusSelect({ value, onChange }) {
  return (
    <select value={value} onChange={onChange} className="status-select">
      <option value="">Select a status to filter</option>
      {possibleStatus.map((ps) => (
        <option key={ps.id} value={ps.id}>
          {ps.label}
        </option>
      ))}
    </select>
  );
}
