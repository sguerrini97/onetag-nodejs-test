
exports.timeout = async function timeout(delay = 0) {
    return new Promise((resolve) => setTimeout(resolve, delay));
};

exports.until = async function until(predicate, options = 300, iteration = 1) {
    const { delay, retries } = typeof options === 'number'
        ? {
            delay: options,
            retries: Infinity,
        } : options;
    try {
        await predicate();
    } catch (error) {
        if (iteration < retries) {
            await exports.timeout(delay);
            return until(predicate, options, iteration + 1);
        }
        throw error;
    }
};
