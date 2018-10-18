import { Log } from 'modules/system';

export const Util = {
    /**
     * @param  {} dayStr: '20181017'
     * @param  {} timeStr: '10:14'
     */
    dateFormat: (dayStr, timeStr) => {
        if(!dayStr || !timeStr){
            return Log.error('Error in formating date, empty input');
        }
        if(dayStr.length < 8 || timeStr.indexOf(':')<=0){
            return Log.error('Error in formatting date, input values are invalid');
        }
        let y = dayStr.substr(0, 4),
            m = parseInt(dayStr.substr(4, 2)) - 1,
            d = dayStr.substr(6, 2);
        let [hh, mm] = timeStr.split(':');
        return new Date(y, m, d, hh, mm);
    }
};