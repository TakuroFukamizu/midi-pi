<template lang="pug">
#Home.full-height
    q-img.absolute-center.full-height(:src='require("@/assets/imgs/pic/yellow.jpg")' :img-style='{ filter: "brightness(80%)" }')
    .full-height
        .row.full-height
            .col.full-height(v-for='channel in channels')
                vertical-timeline.full-height(:notes='channel')
        .row.full-height.full-width.absolute-center
            .col.full-height(v-for='channel, i in channels')
                q-separator(v-if='i != 0' vertical color='black' opacity='' :key='i')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { QImg, QResponsive, QSeparator } from 'quasar';
import '@/components/midiPlayer/VerticalTimeline.vue';

import ArrayUtil from '@/utils/ArrayUtil';

import TestData from '@/data/testdata';

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

    protected mounted(): void {
        for (const i of ArrayUtil.range(6)) {
            this.channels.push(TestData.timelines.filter(t => t.channel === i));
        }
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
