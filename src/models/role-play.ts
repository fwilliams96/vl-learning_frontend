import { RolePlayMessage } from "./role-play-message";

export interface RolePlayData {
    id: string;
    messages: RolePlayMessage[];
    type: RolePlayType;
    is_over: boolean;
    creation_date: string;
    evaluation?: RolePlayEvaluation;
}

export enum RolePlayType {
    JOB_INTERVIEW = 'JOB_INTERVIEW',
    BUY_SUPERMARKET = 'BUY_SUPEMARKET',
    CHECKIN_AIRPORT = 'CHECKIN_AIRPORT',
    ORDER_FOOD_RESTAURANT = 'ORDER_FOOD_RESTAURANT',
    CHECKIN_ACCOMMODATION = 'CHECKIN_ACCOMMODATION',
    DOCTOR_VISIT = 'DOCTOR_VISIT',
    TRAVEL_AGENCY = 'TRAVEL_AGENCY',
    PARENTS_SCHOOL_MEETING = 'PARENTS_SCHOOL_MEETING',
    PARTYING_WITH_STRANGERS = 'PARTYING_WITH_STRANGERS',
    URGENCY_CALL_POLICE = 'URGENCY_CALL_POLICE'
}

export interface RolePlayEvaluation {
    score: number;
    feedback: string;
}