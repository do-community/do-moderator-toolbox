module.exports = name => {
    const hr = (new Date()).getHours();
    const greet = hr < 12 ? "morning" : hr < 18 ? "afternoon" : "evening";
    return `Good ${greet}, ${name}.`
};
