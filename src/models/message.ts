export interface Message {
    animation: string
    text: string
    facialExpression: string
    lipsync: Lipsync
    audio: string
}

export interface Lipsync {
    mouthCues: MouthCue[]
}

export interface MouthCue {
    value: string
    start: number
    end: number
}
