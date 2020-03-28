export interface TimelineItemInterface {
    startTime: number; // 開始位置(ms, 再生開始位置からの相対時間)
    endTime: number; // 終了位置(ms, 再生開始位置からの相対時間)
    durationTime: number; // 長さ(ms)
    kind: string; // コマンド種類
}

export interface TimelineNoteItemInterface extends TimelineItemInterface {
    channel: number;
    noteNumber: number;
    velocity: number;
}
