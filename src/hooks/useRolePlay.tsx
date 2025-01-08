import { Message } from "@/models/message";
import { RolePlayData, RolePlayEvaluation, RolePlayType } from "@/models/role-play";
import { useEffect, useState } from "react";

const backendUrl = "http://localhost:8000";

export const useRolePlay = () => {
  const [rolePlay, setRolePlay] = useState<RolePlayData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [evaluation, setEvaluation] = useState<RolePlayEvaluation | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRolePlay = async (type: RolePlayType) => {
    setLoading(true);

    const data = await fetch(`${backendUrl}/role-play`, {
      method: "POST",
      body: JSON.stringify(
        { 
          "type": type.toString()
        }
      ),
      headers: {
        "Content-Type": "application/json",
      }
    });

    const rolePlay = await data.json();
    setRolePlay(rolePlay);
    setLoading(false);
  };

  const chat = async (message: string, rolePlayId: string) => {
    setLoading(true);

    //const messages = await getMockMessages();
    const data = await fetch(`${backendUrl}/role-play/${rolePlayId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "content": message }),
    });
    const messages = await data.json();

    setMessages((prevMessages) => [...prevMessages, ...messages]);
    setLoading(false);
  };

  const getRolePlayEvaluation = async (rolePlayId: string) => {
    setLoading(true);

    const data = await fetch(`${backendUrl}/role-play/${rolePlayId}/evaluation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const evaluation = await data.json();
    setEvaluation(evaluation);
    setLoading(false);
  };
  
  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return {
    generateRolePlay,
    chat,
    getRolePlayEvaluation,
    rolePlay,
    message,
    evaluation,
    loading,
  };
};
