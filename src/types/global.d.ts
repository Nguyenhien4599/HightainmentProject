// src/types/global.d.ts
declare global {
    type UserID = string | number;
}

export interface IItemOptionFilter {
    name: string;
    id: number;
    displayPriority: number;
}
