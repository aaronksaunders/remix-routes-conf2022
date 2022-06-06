import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData, useParams, useSubmit } from "@remix-run/react";
import { useCallback } from "react";
import { db } from "~/utils/db.server";

/**
 *
 * @param param0
 * @returns
 */
export const loader: LoaderFunction = ({ params }) => {
  // we get the id
  return db.solution.findMany({
    where: {
      bigProblemId: params?.problemId,
    },
    orderBy: {
      votes: "desc",
    },
  });
};

/**
 *
 * @param param0
 * @returns
 */
export const action: ActionFunction = async ({ request }) => {
  // get the form data from the request
  const form = await request.formData();
  const solutionId = form.get("solutionId") as string;
  const votes = parseInt(form.get("votes") as string);

  // add the new solution to the database
  await db.solution.update({
    where: {
      id: solutionId,
    },
    data: {
      votes: votes + 1,
    },
  });

  return null;
};

const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

/**
 * 
 * Displays All Solutions to a Specific Problem,
 * using $problemId and renders in the Outlet provided
 * by the component ProblemDetailPage - $problemId.tsx
 * 
 * @returns 
 */
export default function SolutionsByIdPage() {
  const solutions = useLoaderData();

  const formatDate = useCallback((date: string) => {
    return formatter.format(new Date(date));
  }, []);

  return (
    <>
      <h3>Number of Solutions: {solutions?.length}</h3>

      <div className="ui items">
        {solutions?.length !== 0 ? (
          solutions?.map((solution: any) => (
            <div
              className="ui item"
              style={{
                marginBottom: 8,
                border: "1px solid grey",
                padding: 8,
              }}
              key={solution.id}
            >
              <div className="ui container">
                <div className="ui  left floated">
                  <h5>{solution?.content}</h5>
                  <div>
                    {`Votes: ${solution?.votes} as of ${formatDate(
                      solution?.updatedAt
                    )}`}
                  </div>
                </div>
                <Form method="post">
                  <input type="hidden" value={solution.id} name="solutionId" />
                  <input
                    type="hidden"
                    value={solution?.votes || 0}
                    name="votes"
                  />
                  <button
                    className="ui center right floated tiny button "
                    type="submit"
                  >
                    VOTE
                  </button>
                </Form>
              </div>
            </div>
          ))
        ) : (
          <p>Click button above to add a solution to the problem</p>
        )}
      </div>
    </>
  );
}
