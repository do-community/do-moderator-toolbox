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
    <div v-if="app.$data.state === 'home'" class="dmt-queues">
        <a v-for="queue in Object.values(queues)" class="dmt-button" :href="queue.link">{{ queue.text }}</a>
    </div>
</template>

<script>
    const getQueue = href => {
        const elm = document.querySelector(`.moderation-bar li a[href="${href}"]`);
        if (!elm) return;
        return {
            link: href,
            text: elm.textContent,
        };
    };

    const queues = {
        underReview: getQueue('/community/moderation/under_review?moderation=true'),
        flagged: getQueue('/community/moderation/flagged?moderation=true'),
        unansweredQuestions: {
            link: '/community/questions?primary_filter=unanswered',
            text: 'Unanswered Questions',
        },
    };

    const encodeQueryData = data => {
        const ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    };

    const getUnanswered = async () => {
        const applicationId = '6ZHEUVKJ88';
        const apiKey = 'c5470567eae7fa1177d43222e18ba086';
        const index = 'production_community_consolidated_newest';
        const resp = await fetch(`https://${applicationId.toLowerCase()}-dsn.algolia.net/1/indexes/${index}/query?x-algolia-application-id=${applicationId}&x-algolia-api-key=${apiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                params: encodeQueryData({
                    query: '',
                    page: 0,
                    hitsPerPage: 0,
                    facetFilters: '["feedable_language:en","item_type:question"]',
                    numericFilters: '["indexed_answers_count=0"]',
                }),
            }),
        });

        return (await resp.json()).nbHits;
    };

    getUnanswered().then(res => {
        queues.unansweredQuestions.text += ` (${res.toLocaleString()})`;
    });

    module.exports = {
        name: 'Queues',
        data() {
            return {
                app: null,
                queues,
            };
        },
        created() {
            this.$data.app = this.$parent;
        },
    };
</script>
