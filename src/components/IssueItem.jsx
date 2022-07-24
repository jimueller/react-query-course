import { GoComment, GoIssueClosed, GoIssueOpened } from "react-icons/go";
import { Link } from "react-router-dom";
import { relativeDate } from "../helpers/relativeDate";
import { useUserData } from "../helpers/useUserData";
import { Label } from "./Label";
import { useQueryClient } from "react-query";
import fetchWithError from "../helpers/fetchWithError";

export function IssueItem({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status,
}) {
  const queryClient = useQueryClient();
  const createdByUser = useUserData(createdBy);
  const assignedUser = useUserData(assignee);

  return (
    <li
      onMouseEnter={() => {
        queryClient.prefetchQuery(["issues", number.toString()], () => {
          return fetchWithError(`/api/issues/${number}`);
        });
        queryClient.prefetchQuery(
          ["issues", number.toString(), "comments"],
          () => {
            return fetchWithError(`/api/issues/${number}/comments`);
          }
        );
      }}
    >
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed style={{ color: "red" }} />
        ) : (
          <GoIssueOpened style={{ color: "green" }} />
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issue/${number}`}>{title}</Link>
          {labels.map((label) => (
            <Label key={label} label={label} />
          ))}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)}
          {createdByUser.isSuccess ? ` by ${createdByUser.data.name}` : ""}
        </small>
      </div>
      {assignee ? (
        <img
          src={
            assignedUser.isSuccess ? assignedUser.data.profilePictureUrl : ""
          }
          className="assigned-to"
          alt={`Assigned to user ${
            assignedUser.isSuccess ? assignedUser.data.name : ""
          } avatar`}
        />
      ) : null}
      <span className="comment-count">
        {commentCount > 0 ? (
          <>
            <GoComment />
            {commentCount}
          </>
        ) : null}
      </span>
    </li>
  );
}
