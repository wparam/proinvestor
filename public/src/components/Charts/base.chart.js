import { log } from 'modules/system';

export const BaseChart = {
    getSeries: data => {
        if(!data || data.length === 0){
            log.error('Error in base.chart, no input data');
            return;
        }
        data.forEach(element => {
            
        });
    }
};