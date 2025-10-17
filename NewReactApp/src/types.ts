export interface Contact{
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    title: string;
    status: string;
    imageUrl: string;
}

export interface PaginatedResponse{
    content: Contact[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}


export interface HeadersProps{
    toggleModal: (show: boolean) => void;
    nbOfContacts: number;
}