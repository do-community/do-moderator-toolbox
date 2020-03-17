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
    <div v-if="user" class="dmt">
        <div v-if="user.attributes['is-disabled']" class="dmt-badge dmt-badge-trash">
            Disabled
        </div>
        <div v-if="user.attributes.email.includes('_archived@')" class="dmt-badge dmt-badge-spam">
            Archived
        </div>

        <div class="dmt-user-info">
            <h4 class="header_label">
                Created
            </h4>
            <code>{{ (new Date(user.attributes['created-at'])).toLocaleString() }}</code>

            <h4 class="header_label">
                Updated
            </h4>
            <code>{{ (new Date(user.attributes['updated-at'])).toLocaleString() }}</code>

            <h4 class="header_label">
                Email
            </h4>
            <code>{{ user.attributes.email }}</code>

            <h4 class="header_label">
                UUID
            </h4>
            <code>{{ user.attributes.uuid }}</code>

            <h4 class="header_label">
                ID
            </h4>
            <code>{{ user.id }}</code>

            <h4 class="header_label">
                Seen username modal
            </h4>
            <code>{{ user.attributes['viewed-username-prompt'] ? 'Yes' : 'No' }}</code>

            <h4 class="header_label">
                Ref Code
            </h4>
            <code>{{ user.attributes['referral-code'] || 'Not set' }}</code>

            <h4 class="header_label">
                Admin user
            </h4>
            <code>{{ user.attributes['is-admin'] ? 'Yes' : 'No' }}</code>

            <h4 class="header_label">
                Internal User
            </h4>
            <code>{{ user.attributes['is-internal'] ? 'Yes' : 'No' }}</code>

            <h4 class="header_label">
                Disabled User
            </h4>
            <code>{{ user.attributes['is-disabled'] ? 'Yes' : 'No' }}</code>
        </div>
    </div>
</template>

<script>
    const getUserData = require('../../../utils/user/getUserData');

    module.exports = {
        name: 'UserInfo',
        data() {
            return {
                app: null,
                user: null,
            };
        },
        created() {
            this.$data.app = this.$parent;

            const user = window.location.pathname.match(/\/community\/users\/(.+)/)[1];
            getUserData(user).then(data => {
                this.$data.user = data;
            });
        },
    };
</script>
