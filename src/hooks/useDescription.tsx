import { DescriptionData, DescriptionResult } from "@/models/description";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const useDescription = () => {
  const [description, setDescription] = useState<DescriptionData | null>(null);
  const [result, setResult] = useState<DescriptionResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const generateDescription = async (token: string) => {
    setLoading(true);

    const data = await fetch(`${API_URL}/description`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const description = await data.json();
    setDescription(description);
    setLoading(false);
  };

  const sendUserDescription = async (description_id: string, content: string, format: string, token: string) => {
    setLoading(true);

    const data = await fetch(`${API_URL}/description/${description_id}/result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ "content": content, "format": format }),
    });
    const result = await data.json();

    setResult(result);
    setLoading(false);
  };

  return {
    generateDescription,
    sendUserDescription,
    description,
    result,
    loading,
  };
};
