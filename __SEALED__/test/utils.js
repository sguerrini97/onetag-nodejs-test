
exports.timeout = async function timeout(delay = 0) {
    return new Promise((resolve) => setTimeout(resolve, delay));
};

exports.until = async function until(predicate, delay = 300) {
    try {
        await predicate();
    } catch (error) {
        await exports.timeout(delay);
        return until(predicate, delay);
    }
};
