<script lang="ts">
    import '$lib/donut';
    import {circle, perspective, torus, xyzRot} from "$lib/donut";

    function toAscii(brightness: number) {
        return brightness ? '#' : '-';
    }

    const dim = 70;
    const xDim = dim;
    const yDim = dim;
    const torusZDim = dim;
    const viewGap = dim/1.5;
    const samplingRate = xDim;
    const r1 = xDim / 2;
    const r2 = r1 / 3;

    // init 3d models
    $: circleModel = circle(r2, samplingRate);
    $: torusModel = torus(r1, circleModel, Math.trunc(samplingRate / 1.5));

    // init light values matrix
    $: light = Array(yDim).fill(0)
        .map(_ => Array(xDim).fill(0));

    // rotate the torus
    let xRot = 1 * Math.PI / 180; // rad / 10ms

    $: setTimeout(() => {
        torusModel = xyzRot(torusModel, [xRot, -xRot, xRot]);
        console.log(xRot / Math.PI * 180);
        light = light.map(r => r.map(c => 0));
    }, 10);

    // map torus to screen
    $: torusModel
        .map(p => [p[0], p[1], p[2] + torusZDim])
        .map(p => perspective(p, viewGap))
        .map(p => [p[0] + xDim/2, p[1] + yDim/2, p[2]])
        .map(p => p.map(v => Math.round(v)))
        .filter(p =>
            p.map(v => isFinite(v))
                .reduce((a, b) => a && b))
        .filter(p => p[0] >= 0 && p[0] < xDim)
        .filter(p => p[1] >= 0 && p[1] < yDim)
        .forEach(p => light[p[1]][p[0]] = 1);

    $: pixels = light
        .map((row) => row
            .map(cell => toAscii(cell))
            .join(' '))
        .join('\n');
</script>

<pre>
{pixels}
</pre>

<style>
    :global(html) {
        @apply bg-black text-white text-xs;
    }
</style>
