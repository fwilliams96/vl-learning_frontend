export enum RolePlayMessageType {
    SPEECH = 'SPEECH',
    TEXT = 'TEXT'
}

export enum RolePlayMessageOrigin {
    AGENT = 'AGENT',
    USER = 'USER'
}

export interface RolePlayMessage {
    id?: string | undefined
    type: RolePlayMessageType
    text: string
    sender_id?: string | undefined
    chat_id?: string
    sent_date?: string
    origin: RolePlayMessageOrigin
}