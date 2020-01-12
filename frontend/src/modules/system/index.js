export const Log = {
    info: msg => {
        console.info(msg);
        return false;
    },
    error: msg => {
        console.error(msg);
        return false;
    },
    warn: msg => {
        console.warn(msg);
        return false;
    }
};