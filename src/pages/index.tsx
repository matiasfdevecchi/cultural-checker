import Step1 from "@/components/Step1";
import { useState } from "react";
import Step2 from "@/components/Step2";
import { AssistanceResponse } from "@/client-assistance/core/domain/Action";
import { Question, questions } from "@/data/questions";
import Notification from "@/components/Notification";

export default function Home() {
  const [result, setResult] = useState<AssistanceResponse>();
  const [error, setError] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const question = questions[questionIndex];

  const handleSubmit = async (
    id: Question["id"],
    question: string,
    audioBlob: Blob | null
  ) => {
    if (!audioBlob) return;

    try {
      setError(false);
      setIsLoading(true);
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.wav");
      formData.append("id", id);
      formData.append("question", question);

      const response = await fetch("/api/analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error analyzing audio");
      }

      const data = await response.json();

      console.log(data);

      setResult(data);
    } catch (error: any) {
      console.error("Error during audio analysis:", error.message);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setResult(undefined);
    setQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  const handleTryAgain = () => {
    setResult(undefined);
  };

  const handleSelectQuestion = (id: Question['id']) => {
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    setQuestionIndex(questions.indexOf(question));
  }

  return (
    <div
      className={`items-center justify-items-center`}
    >
      {error && <Notification message="Ha ocurrido un error, vuelve a intentarlo." type="error" onClose={() => setError(false)} />}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {
          result ? (
            <Step2
              onNext={handleNext}
              onTryAgain={handleTryAgain}
              result={result}
            />
          ) : (
            <Step1 question={question} onSelectQuestion={handleSelectQuestion} onSubmit={handleSubmit} isLoading={isLoading} />
          )
        }
      </main>
    </div>
  );
}
