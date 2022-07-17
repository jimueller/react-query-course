import { possibleStatus } from "../helpers/defaultData";
import { useUserData } from "../helpers/useUserData";
import { GoIssueClosed, GoIssueOpened } from "react-icons/go";
import { relativeDate } from "../helpers/relativeDate";

export const IssueHeader = ({
  title,
  number,
  status = "todo",
  createdBy,
  createdDate,
  comments,
}) => {
  const statusObj = possibleStatus.find((s) => s.id === status);
  const createdByUser = useUserData(createdBy);
  return (
    <header>
      <h2>
        {title} <span>#{number}</span>
      </h2>
      <div>
        <span
          className={
            status === "done" || status === "cancelled" ? "closed" : "open"
          }
        >
          {status === "done" || status === "cancelled" ? (
            <GoIssueClosed />
          ) : (
            <GoIssueOpened />
          )}
          {statusObj.label}
        </span>
        <span className="created-by">
          {createdByUser.isLoading
            ? "..."
            : createdByUser.isSuccess
            ? createdByUser.data?.name
            : createdBy}
        </span>{" "}
        opened this issue {relativeDate(createdDate)} &bull; {comments.length}{" "}
        comments
      </div>
    </header>
  );
};
