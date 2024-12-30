import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Question } from "@/data/questions";
import Select from "react-select";
import { companyOptions, roleOptions } from "@/data/selects";

const customClassNames = {
  control: (state: any) =>
    `p-2 rounded border ${state.isFocused
      ? "border-blue-500 ring-2 ring-blue-400 dark:border-blue-300 dark:ring-blue-300"
      : "border-gray-300 dark:border-gray-300"
    } bg-white dark:bg-transparent text-gray-800 dark:text-white`,
  menu: () => "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200",
  option: (state: any) =>
    `p-2 cursor-pointer ${state.isFocused
      ? "bg-blue-100 dark:bg-blue-500 text-gray-900 dark:text-gray-100"
      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    }`,
};

const ThemedSelect = (props: any) => {
  return (
    <Select
      {...props}
      classNames={{
        control: customClassNames.control,
        menu: customClassNames.menu,
        option: customClassNames.option,
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 4,
        colors: {
        },
      })}
    />
  );
};

const Step1: React.FC<{
  question: Question;
  onSubmit: (id: Question['id'], question: string, audioBlob: Blob | null) => void;
  isLoading: boolean;
}> = ({
  question,
  onSubmit,
  isLoading,
}) => {
    const [company, setCompany] = useState<{ value: string; label: string }>(companyOptions[0]);
    const [role, setRole] = useState<{ value: string; label: string; }>(roleOptions[0]);

    const questionToText = () => {
      let q = question.text;

      if (question.tags?.includes("company")) {
        q += ` at ${company.value}`;
      }

      if (question.tags?.includes("role")) {
        q += ` as a ${role.value}`;
      }

      return q;
    }

    const [isActive, setIsActive] = useState<boolean>(false);
    const [reproduced, setReproduced] = useState<number>(0);
    const [counter, setCounter] = useState<number>(0);
    const [recorded, setRecorded] = useState<boolean>(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [reproducing, setReproducing] = useState<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioURLRef = useRef<string | null>(null);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
    const reproducingTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
      let timer: NodeJS.Timeout | undefined;
      if (isActive) {
        setCounter(0);
        timer = setInterval(() => {
          setCounter((prev) => prev + 1);
        }, 1000);
      } else {
        clearInterval(timer);
      }
      return () => clearInterval(timer);
    }, [isActive]);

    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        setAudioBlob(event.data);
        setRecorded(true);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsActive(true);
    };

    const stopRecording = () => {
      mediaRecorderRef.current?.stop();
      setIsActive(false);
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    };

    const handlePlay = () => {
      if (audioURLRef.current) {
        audioPlayerRef.current = new Audio(audioURLRef.current);
        audioPlayerRef.current.play();
        setReproducing(true);

        const duration = audioPlayerRef.current.duration;
        setReproduced(0);

        reproducingTimerRef.current = setInterval(() => {
          setReproduced((prev) => {
            if (prev >= Math.floor(duration)) {
              clearInterval(reproducingTimerRef.current);
              return prev;
            }
            return prev + 1;
          });
        }, 1000);

        audioPlayerRef.current.onended = () => {
          setReproducing(false);
          setReproduced(0);
          clearInterval(reproducingTimerRef.current);
        };
      }
    };

    const handleStop = () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      }
      clearInterval(reproducingTimerRef.current);
      setReproducing(false);
      setReproduced(0);
    };

    const deleteRecording = () => {
      setAudioBlob(null);
      setRecorded(false);
      setReproduced(0);
      audioURLRef.current = null;
    };

    useEffect(() => {
      if (audioBlob) {
        audioURLRef.current = URL.createObjectURL(audioBlob);
      }
    }, [audioBlob]);

    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Silver.dev&apos;s BEHAVE</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-200 text-lg mb-4">
            Get instant feedback from answering classical behavioral questions
            with Silver.dev&apos;s themed auto-response. Great for practicing
            English & Storytelling.
          </p>
          <p className="text-gray-700 dark:text-gray-200 text-lg mb-2 font-bold">
            Question: "{question.text}"
          </p>
          {
            question.tags?.includes("company") && (
              <>
                <label className="block text-gray-700 dark:text-gray-200 text-lg mb-2">
                  Company
                </label>
                <ThemedSelect
                  options={companyOptions}
                  value={company}
                  onChange={(value: { value: string; label: string }) => setCompany(value)}
                  className="mb-2"
                />
              </>
            )
          }
          {
            question.tags?.includes("role") && (
              <>
                <label className="block text-gray-700 dark:text-gray-200 text-lg mb-2">
                  Role
                </label>
                <ThemedSelect
                  options={roleOptions}
                  value={role}
                  onChange={(value: { value: string; label: string }) => setRole(value)}
                  className="mb-2"
                />
              </>
            )
          }
          <div className="flex items-center justify-between w-full p-4 border rounded-lg mt-6 border-gray-300 dark:border-gray-300">
            <div className="flex items-center">
              <div className="w-[36px] h-[36px] flex justify-center items-center">
                {!isActive && recorded ? (
                  <div
                    className="w-[36px] h-[36px] bg-indigo-800 dark:bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={reproducing ? handleStop : handlePlay}
                  >
                    {reproducing ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
                        viewBox="0 0 24 24"
                        className="w-6 h-6"
                      >
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
                        viewBox="-1 0 24 24"
                        className="w-6 h-6"
                      >
                        <path d="M5.25 5.25l13.5 6.75-13.5 6.75V5.25z" />
                      </svg>
                    )}
                  </div>
                ) : (
                  <motion.div
                    className="bg-red-500"
                    onClick={() => {
                      isActive ? stopRecording() : startRecording();
                    }}
                    initial={false}
                    animate={{
                      borderRadius: isActive ? "6px" : "50%",
                      width: isActive ? "24px" : "36px",
                      height: isActive ? "24px" : "36px",
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                )}
              </div>
              <span className="text-lg font-bold text-gray-800 dark:text-gray-200 ml-4">
                {recorded ? `${formatTime(reproduced)}/` : ""}
                {formatTime(counter)}
              </span>
            </div>
            {recorded && (
              <Button variant="destructive" onClick={deleteRecording}>
                Delete
              </Button>
            )}
          </div>
          <Button
            className="mt-8 w-full bg-indigo-800 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white"
            onClick={() => {
              if (isLoading) return;
              if (reproducing) {
                handleStop();
              }
              onSubmit(question.id, questionToText(), audioBlob);
            }}
            disabled={!recorded}
          >
            {
              !isLoading && "Submit"
            }
            {
              isLoading && <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white dark:text-black animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
              </svg>
            }
          </Button>
        </CardContent>
      </Card>
    );
  };

export default Step1;
