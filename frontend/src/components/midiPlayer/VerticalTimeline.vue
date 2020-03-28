<template lang="pug">
k-stage.vertical-timeline(:config='config' v-resize='resized')
    k-layer
        k-rect(v-for='noteObject, i in noteObjects' :config='noteObject' :key='i')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import VueResizeDirective from 'vue-resize-directive';

import Konva from 'konva';
import gsap from 'gsap';

import GradientColor from 'gradient-color';

@Component({
    directives: {
        resize: VueResizeDirective,
    },
})
export default class VerticalTimeline extends Vue {
    @Prop({ type: Array, required: true })
    protected notes!: any[];

    protected config = {
        width: 0,
        height: 0,
    };

    protected colors = GradientColor(
        [
            '#DE6641',
            '#E8AC51',
            '#F2E55C',
            '#39A869',
            '#4784BF',
            '#5D5099',
            '#A55B9A',
        ],
        128,
    );

    protected currentTime = 0;
    protected get center(): {
        x: number;
        y: number;
    } {
        return {
            x: this.config.width / 2,
            y: this.config.height / 2,
        };
    }

    protected noteObjects = [] as Array<Konva.RectConfig>;

    protected mounted(): void {
        const minPerHeight = 5;
        const timeline = gsap.timeline();
        for (const note of this.notes) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            const object = {
                width: 20,
                get height(): number {
                    return (
                        self.config.height *
                        (note.durationTime / (minPerHeight * 1000))
                    );
                },
                offsetX: 10,
                get offsetY(): number {
                    return (
                        self.config.height *
                        (note.durationTime / (minPerHeight * 1000))
                    );
                },
                fill: this.colors[note.noteNumber],
                percent: -1,
                get x(): number {
                    return self.config.width / 2;
                },
                get y(): number {
                    if (this.percent < 0) {
                        // 本当は非表示にしたい
                        return -9999;
                    }

                    // if (100 <= this.percent) {
                    //     const index = self.noteObjects.indexOf(this);
                    //     if (index !== -1) {
                    //         self.noteObjects.splice(index, 1);
                    //     }
                    // }

                    return (self.config.height - 32) * (this.percent / 100);
                },
                scaleX: 1.0,
            } as Konva.RectConfig;
            this.noteObjects.push(object);

            timeline.to(
                object,
                minPerHeight,
                {
                    percent: 100,
                    ease: 'none',
                },
                note.startTime / 1000,
            );
        }

        timeline.seek(-2);
        timeline.play();
    }

    protected resized(): void {
        this.updateConfig();
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

export interface Note {
    time: number;
    duration: number;
    value: number;
}
</script>

<style lang="stylus" scoped>
@require '~@/assets/styles/entry/variable.styl';

.vertical-timeline {
}
</style>
