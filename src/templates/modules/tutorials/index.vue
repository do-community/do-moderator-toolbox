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
    <!-- This module shows nothing in the toolbox itself -->
    <div></div>
</template>

<script>
    const onTutorial = () => {
        return !!(window.location.pathname.match(/\/community\/tutorials\/.+/));
    };

    module.exports = {
        name: 'Tutorials',
        data() {
            return {
                app: null,
                commentsObserver: null,
            };
        },
        methods: {
            find(id) {
                const comment = document.getElementById(`comment_${id}`);

                // If we haven't found the comment, load more
                if (!comment) {
                    const load = document.querySelector('a.load-more:not(.loading)');
                    if (load) load.click();
                    return;
                }

                // If we have, stop observing
                this.$data.commentsObserver.disconnect();
                comment.scrollIntoView();
            },
        },
        created() {
            this.$data.app = this.$parent;

            if (onTutorial()) {
                // This is now handled by Community itself
                /*const query = window.location.search.match(/[?&]comment=(\d+)/);
                if (query && query[1]) {
                    this.$data.commentsObserver = new MutationObserver(() => this.find(query[1]));
                    this.$data.commentsObserver.observe(
                        document.getElementById('comments-tab'),
                        { attributes: true, childList: true, subtree: true },
                    );
                }*/
            }
        },
    };
</script>
