export enum ChatMessageType {
    SPEECH = 'SPEECH',
    TEXT = 'TEXT'
}

export enum ChatMessageOrigin {
    AGENT = 'AGENT',
    USER = 'USER'
}

export interface ChatMessage {
    id?: string | undefined
    type: ChatMessageType
    text: string
    sender_id?: string | undefined
    chat_id?: string
    sent_date?: string
    origin: ChatMessageOrigin
}