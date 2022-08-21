import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { IssueHeader } from "./IssueHeader";
import { useUserData } from "../helpers/useUserData";
import { relativeDate } from "../helpers/relativeDate";
import IssueStatus from "./IssueStatus";
import IssueAssignment from "./IssueAssignment";
import IssueLabels from "./IssueLabels";

function useIssueData(issueNumber) {
  return useQuery(["issues", issueNumber], ({ cancel }) => {
    return fetch(`/api/issues/${issueNumber}`, { cancel }).then((res) =>
      res.json()
    );
  });
}

function useIssueComments(issueNumber) {
  return useQuery(["issues", issueNumber, "comments"], ({ cancel }) => {
    return fetch(`/api/issues/${issueNumber}/comments`, { cancel }).then(
      (res) => res.json()
    );
  });
}

function Comment({ comment, createdBy, createdDate }) {
  const createdByUser = useUserData(createdBy);

  if (createdByUser.isLoading)
    return (
      <div className="comment">
        <div>
          <div className="comment-header">Loading...</div>
        </div>
      </div>
    );
  return (
    <div className="comment">
      <img src={createdByUser.data.profilePictureUrl} alt="Commenter Avatar" />
      <div>
        <div className="comment-header">
          <span>{createdByUser.data.name}</span> commented{" "}
          <span>{relativeDate(createdDate)}</span>
        </div>
        <div className="comment-body">{comment}</div>
      </div>
    </div>
  );
}

export default function IssueDetails() {
  const { number } = useParams();
  const issueQuery = useIssueData(number);
  const commentsQuery = useIssueComments(number);

  return (
    <div className="issue-details">
      {issueQuery.isLoading ? (
        <p>Loading Issue...</p>
      ) : (
        <IssueHeader {...issueQuery.data} />
      )}
      <main>
        <section>
          {commentsQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            commentsQuery.data?.map((comment) => (
              <Comment key={comment.id} {...comment} />
            ))
          )}
        </section>
        <aside>
          <IssueStatus
            status={issueQuery.data.status}
            issueNumber={issueQuery.data.number.toString()}
          />
          <IssueAssignment
            assignee={issueQuery.data.assignee}
            issueNumber={issueQuery.data.number.toString()}
          />
          <IssueLabels
            labels={issueQuery.data.labels}
            issueNumber={issueQuery.data.number.toString()}
          />
        </aside>
      </main>
    </div>
  );
}
