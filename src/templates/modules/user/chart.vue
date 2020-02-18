<!--
Copyright 2020 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<template>
    <section class="dmt">
        <canvas ref="chart"></canvas>
    </section>
</template>

<script>
    const { Chart } = require('chart.js');

    module.exports = {
        name: 'UserChart',
        props: {
            posts: Array,
        },
        data() {
            return {
                app: null,
                data: null,
            };
        },
        created() {
            this.$data.app = this.$parent;
        },
        mounted() {
            const byMonth = {};

            // Start at the oldest post
            let date = new Date(this.$props.posts[this.$props.posts.length - 1].attributes['created-at']);
            date.setDate(1);
            date.setHours(0, 0, 0, 0);

            // Stop the newest post
            const end = new Date(this.$props.posts[0].attributes['created-at']);
            end.setDate(1);
            end.setHours(0, 0, 0, 0);

            // Find every month between oldest and newest
            while (date.valueOf() <= end.valueOf()) {
                byMonth[`${date.getFullYear()}-${date.getMonth() + 1}`] = [];
                date.setMonth(date.getMonth() + 1);
            }

            // Group the posts
            this.$props.posts.forEach(post => {
                // Only published posts
                if (post.attributes.state !== 'published') return;

                // Get the year-month key
                const date = new Date(post.attributes['created-at']);
                const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

                // Append (skip if key doesn't exist, which it always should)
                if (!(key in byMonth)) return;
                byMonth[key].push(post);
            });

            // Build the data (most recent 12 months)
            const keys = Object.keys(byMonth).reverse().slice(0, 12).reverse();
            new Chart(this.$refs.chart, {
                type: 'line',
                data: {
                    labels: keys,
                    datasets: [
                        {
                            label: 'Total contributions',
                            backgroundColor: '#0069ff',
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            fill: false,
                            data: keys.map(key => byMonth[key].length),
                        }
                    ],
                },
                options: {
                    legend: {
                        display: false,
                    },
                },
            });
        },
    };
</script>
