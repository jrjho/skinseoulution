export interface DetectFaceResult {
    age: number;
    skinHealth: string;
    glass: string;
}

export interface AnaylzeSkinResult {
    pores: string;
    wrinkles: string;
    blackheads: string;
    acne: string;
    eye_pouch: string;
    dark_circle: string;
    skin_spot: string;
    left_eyelids:string;
    right_eyelids:string;
    mole:string;
}

export interface Procedure {
    procedure_id: number;
    location:string;
    procedure_tag: string;
    procedure_name: string;
    partner_name: string;
    image: string;
    url: string;
    current_price: string;
    usual_price: string;
    average_price: string;
}