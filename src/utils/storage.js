const getStorage = () => {
    const data = window.localStorage.getItem('dmt');
    if (!data) return {};
    const parsed = JSON.parse(data);
    if (!parsed) return {};
    return parsed;
};
const setStorage = data => window.localStorage.setItem('dmt', JSON.stringify(data));

const get = key => getStorage()[key];

const set = (key, data) => {
    const store = getStorage();
    store[key] = data;
    setStorage(store);
};

const remove = key => {
    const store = getStorage();
    if (key in store) {
        delete store[key];
        setStorage(store);
    }
};

module.exports = { get, set, remove };
