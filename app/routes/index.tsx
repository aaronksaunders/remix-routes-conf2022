import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  // get the form data from the request
  const form = await request.formData();

  // add the new problem to the database
  await db.bigProblem.create({
    data: {
      // use id pass in as params
      content: form.get("content") as string,
    },
  });

  // go back to the page listing all the problem
  return null;
};

export const loader: LoaderFunction = () => {
  return db.bigProblem.findMany({
    include: {
      _count: {
        select: {
          Solutions: true,
        },
      },
    },
  });
};

export default function ProblemHomePage() {
  // get the data from the loader to display
  const problems = useLoaderData();

  // get ref to the form I am submitting
  const formRef = useRef<any>();

  // clear the form when the loaderData changed
  useEffect(()=>{
     formRef?.current.reset();
  },[problems]);

  return (
    <div className="ui container">
      <h1>Big Big Problems</h1>
      <div className="ui segment">
        <Form method="post" ref={formRef}>
          <div
            className="ui input huge"
            style={{ width: "100%", margin: 8, padding: 12 }}
          >
            <input type="text" name="content" placeholder="Whats a BIG BIG Problem..."/>
            <button
              type="submit"
              className="ui button"
              style={{ marginLeft: 8 }}
            >
              ADD PROBLEM
            </button>
          </div>
        </Form>
      </div>
      <>
        {problems?.map((problem: any) => (
          <Link to={`/problems/${problem?.id}`} key={problem?.id}>
            <div className="ui message" style={{ marginBottom: 8 }}>
              <div className="header" style={{ marginBottom: 4 }}>
                {problem.content}
              </div>
              <div>
                {problem._count.Solutions === 0
                  ? "No Solutions Provided At This Time"
                  : `There Are Currently ${problem._count.Solutions} Solutions
                Provided`}
              </div>
            </div>
          </Link>
        ))}
      </>
    </div>
  );
}
