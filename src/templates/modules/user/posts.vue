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
        <h3 class="section_header">All User Posts</h3>
        <div class="dmt-user-posts feed_container" style="margin-bottom: 2rem;">
            <div v-if="state === 0">
                <a class="dmt-button" @click="loadUserPosts()">Load all posts by user</a>
            </div>
            <div v-if="state === 1">
                <p>User posts are loading...</p>
            </div>
            <div v-if="state === 2" class="feed">
                <div class="filter-objects">
                    <ul class="feedable-list">
                        <li :class="post.type.replace(/s+$/, '')" v-for="(post, i) in posts">
                            <span class="eyebrow">
                                <b>{{ title(post.attributes.state) }}</b>
                                {{ title(post.type.replace(/s+$/, "")) }}
                                <small>(Post #{{ (posts.length - i).toLocaleString() }})</small>
                            </span>
                            <h3>
                                <a :href="post.attributes.url">
                                    {{ post.attributes.title || `View ${post.type.replace(/s+$/, "")}` }}
                                </a>
                            </h3>
                            <div class="summary" v-if="post.attributes.content.length > 100">
                               {{ post.attributes.content.substring(0, 100) }}...
                            </div>
                            <div class="summary" v-else>
                                {{ post.attributes.content }}
                            </div>
                            <div class="meta-section">
                                <span class="publish-date">
                                    {{ (new Date(post.attributes['created-at'])).toLocaleString() }}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    const getUserPosts = require('../../../utils/user/getUserPosts');

    const user = (window.location.pathname.startsWith('/community/questions/') ?
        document.body.querySelector('.question-container .section-primary .postable-info-bar-container .username').textContent
        : window.location.pathname.match(/\/community\/users\/(.+)/)[1]);

    module.exports = {
        name: 'UserPosts',
        data() {
            return {
                app: null,
                state: 0,
                posts: null,
            };
        },
        methods: {
            loadUserPosts() {
                this.$data.state = 1;
                getUserPosts(user).then(data => {
                    // Hide the original contributions
                    document.querySelector('.large_column section:not(.dmt)').style.display = 'none';

                    // Show our full contributions
                    this.$data.state = 2;
                    this.$data.posts = data;
                });
            },
            title(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
        },
        created() {
            this.$data.app = this.$parent;
        },
    };
</script>
