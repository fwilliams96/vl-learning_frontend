import { ListeningData } from "@/models/listening";
import { useState } from "react";

const backendUrl = "http://localhost:8000";

export const useListening = () => {
  const [listening, setListening] = useState<ListeningData | null>(null);
  const [loading, setLoading] = useState(false);
  
  const generateListening = async (num_sentences: number) => {
    setLoading(true);

    const data = await fetch(`${backendUrl}/listening?num_sentences=${num_sentences}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const result = await data.json();
    setListening(result);
    setLoading(false);
  };

  const getListening = async (listening_id: string) => {
    setLoading(true);

    const data = await fetch(`${backendUrl}/listening/${listening_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const result = await data.json();

    setListening(result);
    setLoading(false);
  };

  const closeListening = async (listening_id: string, user_listening: ListeningData) => {
    setLoading(true);

    const data = await fetch(`${backendUrl}/listening/${listening_id}/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user_listening),
    });
    const result = await data.json();

    //setResult(result);
    setLoading(false);
  };

  return {
    generateListening,
    getListening,
    closeListening,
    listening,
    loading,
  };
};
