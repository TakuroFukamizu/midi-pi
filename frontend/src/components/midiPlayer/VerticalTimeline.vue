<template lang="pug">
k-stage.vertical-timeline(:config='config' v-resize='updateConfig')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueResizeDirective from 'vue-resize-directive';

@Component({
    directives: {
        resize: VueResizeDirective,
    },
})
export default class VerticalTimeline extends Vue {
    protected config = {
        width: 0,
        height: 0,
    };

    protected updateConfig(): void {
        if (this.$el == null) {
            return;
        }

        this.config = {
            width: this.$el.clientWidth,
            height: this.$el.clientHeight,
        };
    }
}
Vue.component('VerticalTimeline', VerticalTimeline);
</script>

<style lang="stylus" scoped>
@require '~@/assets/styles/entry/variable.styl';

.vertical-timeline {
}
</style>
