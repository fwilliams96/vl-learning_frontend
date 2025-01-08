import { DescriptionData, DescriptionResult } from "@/models/description";
import { useState } from "react";

const backendUrl = "http://localhost:8000";

export const useDescription = () => {
  const [description, setDescription] = useState<DescriptionData | null>(null);
  const [result, setResult] = useState<DescriptionResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const generateDescription = async () => {
    setLoading(true);

    const data = await fetch(`${backendUrl}/description`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const description = await data.json();
    setDescription(description);
    setLoading(false);
  };

  const sendUserDescription = async (description_id: string, content: string, format: string) => {
    setLoading(true);

    const data = await fetch(`${backendUrl}/description/${description_id}/result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
