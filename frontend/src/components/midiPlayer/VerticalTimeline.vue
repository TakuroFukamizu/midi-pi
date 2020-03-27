<template lang="pug">
k-stage.vertical-timeline(:config='config' v-resize='resized')
    k-layer
        k-circle(:config='circles[0]')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueResizeDirective from 'vue-resize-directive';

import Konva from 'konva';

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

    protected get center(): {
        x: number;
        y: number;
    } {
        return {
            x: this.config.width / 2,
            y: this.config.height / 2,
        };
    }

    protected circles = [] as Konva.CircleConfig[];

    protected resized(): void {
        this.updateConfig();

        this.circles = [
            {
                radius: 100,
                fill: 'black',
                x: this.center.x,
                y: this.center.y,
            },
        ];
    }

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
