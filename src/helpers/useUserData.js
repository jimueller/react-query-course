import { useQuery } from "react-query";

export function useUserData(userId) {
  return useQuery(
    ["users", userId],
    () => {
      if (!userId) {
        throw new Error("UserId required");
      }
      fetch(`/api/users/${userId}`).then((res) => res.json());
    },
    {
      staleTime: 1000 * 60 * 5,
    }
  );
}
