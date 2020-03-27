<template lang="pug">
#Home.full-height
    q-img.absolute-center.full-height(:src='require("@/assets/imgs/pic/yellow.jpg")')
    .full-height
        .row.full-height
            .col.full-height(v-for='i in ArrayUtil.range(6)')
                vertical-timeline.full-height
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { QImg, QResponsive } from 'quasar';
import '@/components/midiPlayer/VerticalTimeline.vue';

import ArrayUtil from '@/utils/ArrayUtil';

@Component({
    components: {
        QImg,
        QResponsive,
    },
})
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
        max-height: 100vh;
    }
}
</style>
