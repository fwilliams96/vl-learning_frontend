import { ChatMessage } from "./chat-message"

export interface ChatData {
    id: string | undefined
    messages: ChatMessage[]
    creation_date: string
    participants: string[]
    is_over: boolean
}