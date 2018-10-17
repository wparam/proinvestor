export const Log = {
    info: msg => {
        console.info(msg);
        return false;
    },
    error: msg => {
        console.error(msg);
        return false;
    },
    log: msg => {
        console.log(msg);
        return false;
    }
};