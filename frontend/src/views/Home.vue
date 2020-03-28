<template lang="pug">
#Home.full-height
    q-img.absolute-center.full-height(:src='require("@/assets/imgs/pic/yellow.jpg")' :img-style='{ filter: "brightness(80%)" }')
    .full-height
        .row.full-height
            .col.full-height(v-for='channel, i in channels')
                vertical-timeline.full-height(:notes='channel' ref='verticalTimelines' key='i')
        .row.full-height.full-width.absolute-center
            .col.full-height(v-for='channel, i in channels')
                q-separator(v-if='i != 0' vertical color='black' opacity='' :key='i')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { QImg, QResponsive, QSeparator } from 'quasar';
import io from 'socket.io-client';
import '@/components/midiPlayer/VerticalTimeline.vue';

import ArrayUtil from '@/utils/ArrayUtil';

import TestData from '@/data/testdata';

import { TimelineNoteItemInterface } from '@/types/socketMessage/timeline';
import {
    NoteItemInterface,
    ControllerItemInterface,
} from '@/types/socketMessage/midiItem';
import { aswait } from '../utils/AsyncTimeout';

@Component({
    components: {
        QImg,
        QResponsive,
        QSeparator,
    },
})
export default class Home extends Vue {
    protected ArrayUtil = ArrayUtil;

    protected channels = [] as any[][];

    protected socket?: SocketIOClient.Socket;

    protected async mounted(): Promise<void> {
        this.socket = io('http://localhost:8080');
        this.socket.on('setnewtitle', (msg: any) => {
            // 新しいMIDIファイルの設定
            const title = msg.title as string; // タイトル(今はファイル名)
            console.log(title);
            // TODO:
        });
        this.socket.on('timeline', (msg: any) => {
            // このMIDIファイル内で演奏予定のMIDI
            const beatsPerMinute: number = msg.beatsPerMinute as number;
            const numOfChannnels: number = msg.numOfChannnels as number;
            const timelines: TimelineNoteItemInterface[] = msg.timelines as TimelineNoteItemInterface[];
            console.log(timelines);
            // TODO:

            if (6 < numOfChannnels) {
                throw new Error('num of channnel is out of range');
            }

            for (const i of ArrayUtil.range(6)) {
                this.channels.push(timelines.filter(t => t.channel === i));
            }
        });
        this.socket.on('playstart', (msg: any) => {
            // 現在のMIDIファイルの演奏開始
            const timelines = this.$refs.verticalTimelines as Vue[];
            for (const timeline of timelines) {
                timeline.$emit('playMidi');
            }
        });
        this.socket.on('playpause', (msg: any) => {
            // 現在のMIDIファイルの演奏一次停止
            // TODO: 次回フェーズに回す
        });
        this.socket.on('playcancel', (msg: any) => {
            // 現在のMIDIファイルの演奏キャンセル
            const timelines = this.$refs.verticalTimelines as Vue[];
            for (const timeline of timelines) {
                timeline.$emit('stopMidi');
            }
        });
        this.socket.on('execnotify', (msg: any) => {
            // 現在演奏したMIDI信号
            const type: string = msg.type;
            let data: NoteItemInterface | ControllerItemInterface;
            switch (type) {
                case 'noteOn':
                case 'noteOff':
                    data = msg as NoteItemInterface;
                    // TODO:
                    break;
                case 'controller':
                    data = msg as ControllerItemInterface;
                    // TODO:
                    break;
            }
        });

        // テスト用
        // for (const i of ArrayUtil.range(6)) {
        //     this.channels.push(TestData.timelines.filter(t => t.channel === i));
        // }

        // await aswait(1000);
        // const timelines = this.$refs.verticalTimelines as Vue[];
        // for (const timeline of timelines) {
        //     timeline.$emit('playMidi');
        // }
    }
}
</script>

<style lang="stylus">
@require '~@/assets/styles/entry/view.styl';

html {
    scroll-view: true;
    // static-view: true;
}

#Home .main-pane {
    main-pane();
}
</style>

<style lang="stylus" scoped>
@require '~@/assets/styles/entry/variable.styl';

#Home {
    .main-pane {
        max-height: 100vh;
    }
}
</style>
