import { useState } from "react";
import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";
import fetchWithError from "../helpers/fetchWithError";

export default function IssuesList({ labels, status }) {
  const issuesQuery = useQuery(["issues", { labels, status }], ({ cancel }) => {
    const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
    return fetchWithError(`/api/issues?status=${status}&${labelsString}`, {
      cancel,
    });
  });

  const [searchValue, setSearchValue] = useState("");

  const searchQuery = useQuery(
    ["search", "issues", searchValue],
    ({ signal }) => {
      return fetch(`/api/search/issues?q=${encodeURIComponent(searchValue)}`, {
        signal,
      }).then((res) => res.json());
    },
    {
      enabled: searchValue.length > 0,
    }
  );

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSearchValue(event.target.elements.search.value);
        }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="search"
          name="search"
          id="search"
          onChange={(event) => {
            if (event.target.value.length === 0) {
              setSearchValue("");
            }
          }}
        />
      </form>
      <h2>Issues List</h2>
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : issuesQuery.isError ? (
        <p>{issuesQuery.error.message}</p>
      ) : searchQuery.fetchStatus === "idle" && searchQuery.isLoading ? (
        <ul className="issues-list">
          {issuesQuery.data.map((issue) => (
            <IssueItem
              key={issue.id}
              title={issue.title}
              number={issue.number}
              assignee={issue.assignee}
              commentCount={issue.comments.length}
              createdBy={issue.createdBy}
              createdDate={issue.createdDate}
              labels={issue.labels}
              status={issue.status}
            />
          ))}
        </ul>
      ) : (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchQuery.data.count} Results</p>
              <ul className="issues-list">
                {searchQuery.data.items.map((issue) => (
                  <IssueItem
                    key={issue.id}
                    commentCount={issue.comments.length}
                    {...issue}
                  />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
