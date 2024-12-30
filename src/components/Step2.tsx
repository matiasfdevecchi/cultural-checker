import React, { FC } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AssistanceResponse } from "@/client-assistance/core/domain/Action";

const Step2: FC<{
  result: AssistanceResponse;
  onNext: () => void;
  onTryAgain: () => void;
}> = ({
  result: { greenFlags, redFlags, question, response, result },
  onNext,
  onTryAgain,
}) => {
    return (
      <Card className="max-w-xl mx-auto p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-200 text-lg mb-6 text-center">
            <span className="font-semibold">You responded:</span> <br />
            <em>"{response}"</em>
          </p>
          <p
            className={`${result.toLowerCase().includes("no")
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
              } text-xl font-bold text-center mb-6`}
          >
            Your response is: <strong>{result}</strong>
          </p>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 p-6">
            {greenFlags.length > 0 && (
              <>
                <h3 className="text-green-600 dark:text-green-400 font-bold mt-6 mb-3">Green Flags</h3>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-200 space-y-2">
                  {greenFlags.map((flag, i) => (
                    <li key={i}>{flag}</li>
                  ))}
                </ul>
              </>
            )}
            {redFlags.length > 0 && (
              <>
                <h3 className="text-red-600 dark:text-red-400 font-bold mb-3">Red Flags</h3>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-200 space-y-2">
                  {redFlags.map((flag, i) => (
                    <li key={i}>{flag}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <Button className="mt-6 w-full bg-indigo-800 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white" onClick={onNext}>
            Next
          </Button>
          <Button
            className="mt-4 w-full dark:bg-gray-600 dark:hover:bg-gray-500"
            variant="secondary"
            onClick={onTryAgain}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  };

export default Step2;
