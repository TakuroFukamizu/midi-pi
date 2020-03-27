<template lang="pug">
k-stage.vertical-timeline(:config='config' v-resize='resized')
    k-layer
        k-circle(v-for='circle, i in circles' :config='circle' :key='i')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueResizeDirective from 'vue-resize-directive';

import Konva from 'konva';
import gsap from 'gsap';

import GradientColor from 'gradient-color';

import RandomUtil from '@/utils/RandomUtil';

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

    protected get center(): {
        x: number;
        y: number;
    } {
        return {
            x: this.config.width / 2,
            y: this.config.height / 2,
        };
    }

    protected circles = [] as Array<
        Konva.CircleConfig & {
            percent: number;
        }
    >;

    protected mounted(): void {
        setInterval(() => {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            const circle = {
                radius: 20,
                fill: this.colors[RandomUtil.rand(this.colors.length)],
                percent: 0,
                get x(): number {
                    return self.config.width / 2;
                },
                get y(): number {
                    if (100 <= this.percent) {
                        const index = self.circles.indexOf(this);
                        if (index !== -1) {
                            self.circles.splice(self.circles.indexOf(this), 1);
                        }
                    }
                    return self.config.height * (this.percent / 100);
                },
            };
            this.circles.push(circle);
            gsap.to(circle, 3, { percent: 100, ease: 'none' });
        }, 100);
    }

    protected resized(): void {
        this.updateConfig();

        for (const circle of this.circles) {
            circle.x = this.center.x;
            circle.y = this.config.height * circle.percent;
        }
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
