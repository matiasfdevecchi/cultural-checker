import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Question } from "@/data/questions";
import Select from "react-select";
import { companyOptions, roleOptions } from "@/data/selects";

const Step1: React.FC<{ 
  question: Question;
  onSubmit: (id: Question['id'], question: string, audioBlob: Blob | null) => void;
}> = ({
  question,
  onSubmit,
}) => {
  const [company, setCompany] = useState<{ value: string; label: string }>(companyOptions[0]);
  const [role, setRole] = useState<{value: string; label: string;}>(roleOptions[0]);

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
            return prev; // Detener si se alcanza la duración total
          }
          return prev + 1;
        });
      }, 1000);

      audioPlayerRef.current.onended = () => {
        setReproducing(false);
        setReproduced(0); // Reiniciar el contador cuando el audio termine
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
    <Card className="max-w-lg mx-auto p-6">
      <CardHeader>
        <CardTitle className="text-center">Silver.dev&apos;s BEHAVE</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-lg mb-4">
          Get instant feedback from answering classical behavioral questions
          with Silver.dev&apos;s themed auto-response. Great for practicing
          English & Storytelling.
        </p>
        <p className="text-gray-700 text-lg mb-2 font-bold">
          Question: "{question.text}"
        </p>
        <label className="block text-gray-700 text-lg mb-2">Company</label>
        <Select
          options={companyOptions}
          value={company}
          onChange={(value) => setCompany(value as { value: string; label: string })}
          className="mb-2"
        />
        <label className="block text-gray-700 text-lg mb-2">Role</label>
        <Select
          options={roleOptions}
          value={role}
          onChange={(value) => setRole(value as { value: string; label: string })}
          className="mb-2"
        />
        <div className="flex items-center justify-between w-full p-4 border rounded-lg mt-6">
          <div className="flex items-center">
            <div className="w-[36px] h-[36px] flex justify-center items-center">
              {!isActive && recorded ? (
                <div
                  className="w-[36px] h-[36px] bg-indigo-800 rounded-full flex items-center justify-center cursor-pointer"
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
                  className={`bg-red-500`}
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
            <span className="text-lg font-bold text-gray-800 ml-4">
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
          className="mt-8 w-full"
          onClick={() => {
            if (reproducing) {
              handleStop();
            }
            onSubmit(question.id, questionToText(), audioBlob);
          }}
          disabled={!recorded}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};

export default Step1;
