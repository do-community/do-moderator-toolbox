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

module.exports = async userId => {
    const formData = new FormData();
    formData.append('data[type]', 'users');
    formData.append('data[id]', userId);

    formData.append('data[attributes][avatar]', '');
    formData.append('data[attributes][first_name]', '');
    formData.append('data[attributes][last_name]', '');
    formData.append('data[attributes][title]', '');
    formData.append('data[attributes][bio]', '');
    formData.append('data[attributes][skills]', '');
    formData.append('data[attributes][learn_more]', '');
    formData.append('data[attributes][website]', '');
    formData.append('data[attributes][twitter_handle]', '');
    formData.append('data[attributes][github_handle]', '');
    formData.append('data[attributes][linkedin_url]', '');
    formData.append('data[attributes][preferred_contact_method]', '');
    formData.append('data[attributes][referral_code]', '');
    formData.append('data[attributes][location]', '');

    await fetch('/community/api/users/' + userId, {
        body: formData,
        method: 'PATCH',
        headers: {'x-csrf-token': getMetaCSRF()},
    });
};
