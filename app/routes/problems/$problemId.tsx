import { LoaderFunction } from "@remix-run/node";
import {
  Outlet,
  Link,
  useLocation,
  useLoaderData,
} from "@remix-run/react";
import { useCallback } from "react";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = ({ params }) => {

  // use problem id from the route to get problem data
  return db.bigProblem.findUnique({
    where: {
      id: params?.problemId,
    },
    include: {
      Solutions: true,
    },
  });
};

const formatter = new Intl.DateTimeFormat('en-US')

/**
 * Displays A Specific Problem using $problemId, has Outlet
 * that is used for rendering the child components
 * - SolutionsByIdPage - problems/$problemId/index.tsx
 * - AddSolution - problems/$problemId/add-solution.tsx
 * 
 * @returns 
 */
export default function ProblemDetailPage() {
  const location = useLocation();
  const bigProblem = useLoaderData();

  const formatDate = useCallback((date:string) => {
    return formatter.format(new Date(date))
  },[]);

  const displayingForm = location.pathname.endsWith("add-solution");

  return (
    <div className="ui container">
      <h2>
        The problem of {`"${bigProblem?.content}"`}&nbsp; was created on{" "}
        {`"${formatDate(bigProblem?.createdAt)}"`}
      </h2>
      <div>
        {!displayingForm ? (
          <div style={{ marginTop: 12 }}>
            <Link to="./add-solution">
              <button className="ui button">ADD SOLUTION</button>
            </Link>
            <Link to="../" style={{ marginLeft: 12 }}>
              <button className="ui button negative">CANCEL</button>
            </Link>
          </div>
        ) : null}
      </div>
      <div
        style={{
          padding: 16,
          margin: 16,
          border: "1px solid grey",
          borderRadius: 8,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
