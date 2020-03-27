<template lang="pug">
#Home.q-layout-padding.full-height
    .main-pane.full-height
        .row.full-height
            .col.full-height(v-for='i in ArrayUtil.range(6)')
                vertical-timeline.full-height
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import '@/components/midiPlayer/VerticalTimeline.vue';

import ArrayUtil from '@/utils/ArrayUtil';

@Component
export default class Home extends Vue {
    protected ArrayUtil = ArrayUtil;
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
    }
}
</style>
