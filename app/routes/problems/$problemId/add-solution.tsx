import { ActionFunction, redirect } from "@remix-run/node";
import { useParams, useTransition, Form, Link } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({
  request,
  params: { problemId },
}) => {
  // get the form data from the request
  const form = await request.formData();

  // add the new solution to the database
  await db.solution.create({
    data: {
      // use id pass in as params
      bigProblemId: problemId as string,
      content: form.get("solution") as string,
    },
  });

  // go back to the page listing all the solutions
  return redirect(`/problems/${form.get("problemId") as string}`);
};

/**
 * 
 * Create A New Solution For a Specific Problem using 
 * $problemId and renders in the Outlet provided by 
 * component ProblemDetailPage - $problemId.tsx
 * 
 * @returns 
 */
export default function AddSolution() {
  const { state } = useTransition();
  const busy = state === "submitting";

  return (
    <div>
      <Form method="post">
        <textarea rows={3} name="solution" style={{ width: 450 }} />
        <div>
          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={busy} className="ui button">
              {busy ? "Creating..." : "ADD NEW SOLUTION"}
            </button>
            <Link to="../" style={{ marginLeft: 12 }}>
              <button
                type="button"
                disabled={busy}
                className="ui button negative"
              >
                CANCEL
              </button>
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
