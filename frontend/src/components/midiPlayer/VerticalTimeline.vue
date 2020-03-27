<template lang="pug">
k-stage.vertical-timeline(:config='config' v-resize='resized')
    k-layer
        k-rect(v-for='noteObject, i in noteObjects' :config='noteObject' :key='i')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueResizeDirective from 'vue-resize-directive';

import Konva from 'konva';
import gsap from 'gsap';

import GradientColor from 'gradient-color';

import RandomUtil from '@/utils/RandomUtil';
import ArrayUtil from '../../utils/ArrayUtil';

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

    protected colors = GradientColor(['#E5404C', '#FD743C', '#FD9C3C'], 128);

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

    protected notes = [] as Note[];

    protected mounted(): void {
        for (const i of ArrayUtil.range(100)) {
            this.notes.push({
                time: i * RandomUtil.rand(2000, 3000),
                duration: RandomUtil.rand(100, 200),
                value: RandomUtil.rand(0, 127),
            });
        }

        const timeline = gsap.timeline();
        for (const note of this.notes) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            const object = {
                width: 20,
                height: note.duration,
                offsetX: 10,
                offsetY: note.duration,
                fill: this.colors[RandomUtil.rand(this.colors.length)],
                percent: -1,
                get x(): number {
                    return self.config.width / 2;
                },
                get y(): number {
                    if (this.percent < 0) {
                        // 本当は非表示にしたい
                        return -9999;
                    }

                    if (100 <= this.percent) {
                        const index = self.noteObjects.indexOf(this);
                        if (index !== -1) {
                            self.noteObjects.splice(index, 1);
                        }
                    }

                    return (self.config.height - 32) * (this.percent / 100);
                },
            } as Konva.RectConfig;
            this.noteObjects.push(object);

            timeline.fromTo(
                object,
                5,
                {
                    percent: -1,
                    ease: 'none',
                },
                {
                    percent: 100,
                    ease: 'none',
                },
                note.time / 1000 - 5,
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
