/*
Copyright 2019 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const getMetaCSRF = require('../getMetaCSRF');
const getUserData = require('./getUserData');

module.exports = async userId => {
    // Archive the user
    await fetch('/community/api/users/' + userId + '/archive', {
        method: 'PATCH',
        headers: {'x-csrf-token': getMetaCSRF()},
    });

    // Get the user email
    const userEmail = (await getUserData(userId)).attributes.email;

    // Find the archive hash
    const hash = (new RegExp(/^.*_(.+)_archived@.+$/)).exec(userEmail)[1];

    // Set the username
    const formData = new FormData();
    formData.append('data[type]', 'users');
    formData.append('data[id]', userId);
    formData.append('data[attributes][username]', hash);

    await fetch('/community/api/users/' + userId, {
        body: formData,
        method: 'PATCH',
        headers: {'x-csrf-token': getMetaCSRF()},
    });

    return hash;
};
