interface IItems {
    name: string;
    link: string;
}

export interface IMainMenu {
    name: string;
    link: string;
    items: IItems[];
}
