export interface DescriptionData {
    id: string;
    topic: string;
    finished: boolean;
    image_id: string;
    user_description: UserDescription | undefined;
    result: DescriptionResult | undefined;
    image_url: string;
}

export interface UserDescription {
    description: string;
}

export interface DescriptionResult {
    solution: string;
    rating: number;
    comments: string;
}