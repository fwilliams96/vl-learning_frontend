import { useAuth } from "@/contexts/AuthContext";
import { ListeningData } from "@/models/listening";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const useListening = () => {
  const [listening, setListening] = useState<ListeningData | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  
  const generateListening = async (num_sentences: number) => {
    setLoading(true);

    const data = await fetch(`${API_URL}/listening?num_sentences=${num_sentences}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const result = await data.json();
    setListening(result);
    setLoading(false);
  };

  const getListening = async (listening_id: string) => {
    setLoading(true);

    const data = await fetch(`${API_URL}/listening/${listening_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const result = await data.json();

    setListening(result);
    setLoading(false);
  };

  const closeListening = async (listening_id: string, user_listening: ListeningData) => {
    setLoading(true);

    const data = await fetch(`${API_URL}/listening/${listening_id}/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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
