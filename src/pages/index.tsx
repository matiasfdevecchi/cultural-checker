import { Geist, Geist_Mono } from "next/font/google";
import Step1 from "@/components/Step1";
import { useState } from "react";
import Step2 from "@/components/Step2";
import { AssistanceResponse } from "@/client-assistance/core/domain/Action";
import { Question, questions } from "@/data/questions";
import DarkModeButton from "@/components/DarkModeButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [result, setResult] = useState<AssistanceResponse>();
  const [error, setError] = useState(false);
  const [question, setQuestion] = useState<Question>(questions[0]);

  const handleSubmit = async (id: Question['id'], question: string, audioBlob: Blob | null) => {
    if (!audioBlob) return;

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.wav");
      formData.append("id", id)
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

      setResult(data);
    } catch (error: any) {
      console.error("Error during audio analysis:", error.message);
      setError(true);
    }
  };


  const handleNext = () => {
    setResult(undefined);
  };

  const handleTryAgain = () => {
    setResult(undefined);
  };

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <DarkModeButton />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {
          error && (
            <div className="text-red-500 text-lg text-center">
              An error occurred while analyzing the audio. Please try again.
            </div>
          )
        }
        {!error && (result ? (
          <Step2
            onNext={handleNext}
            onTryAgain={handleTryAgain}
            result={result}
          />
        ) : (
          <Step1 question={question} onSubmit={handleSubmit} />
        ))}
      </main>
    </div>
  );
}
