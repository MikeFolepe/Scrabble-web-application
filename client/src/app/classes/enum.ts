export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

export enum PlacingStrategy {
    LessSix,
    SevenToTwelve,
    ThirteenToEighteen,
}

// TODO: MessageType au lieu de TypeMessage
export enum TypeMessage {
    System,
    Opponent,
    Player,
    Error,
}

export enum Direction {
    Forwards,
    Backwards,
}
