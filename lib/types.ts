export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export interface Plan {
    title: string;
    description: string;
    price: string;
    pricePeriod: string;
    details: string;
    features: { icon: React.ElementType; text: string }[];
    buttonText: string;
    buttonVariant: ButtonVariant;
    popular: boolean;
}