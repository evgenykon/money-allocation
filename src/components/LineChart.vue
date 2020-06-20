<template>
    <canvas id="canvas" ref="canvas"></canvas>
</template>


<script>

import {Chart} from 'chart.js';

export default {
    props: ['datasets'],
    data: () => ({
        context: null,
        config: {
            type: 'line',
            data: {
                datasets: [],
                /*datasets: [
                    {
                        backgroundColor: 'rdga(22, 22, 22, 0.1)',
                        borderColor: '#ffffff',
                        label: 'First dataset',
                        data: [0, 20, 40, 50]
                    },
                    {
                        label: 'Sec dataset',
                        data: [10, 20, 40, 50]
                    },
                ],*/
                labels: ['January', 'February', 'March', 'April']
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            stepSize: 5
                        }
                    }]
                }
            }
        }
    }),
    mounted() {
        this.config.data.datasets = this.datasets;
        this.context = this.$refs.canvas.getContext('2d');
        console.debug('this.$refs.canvas', this.$refs);
        new Chart(this.context, this.config);
    }
}
</script>
