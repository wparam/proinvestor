import { Log } from 'modules/system';
import { Util } from 'modules/util';

// Intraday Sample data
// {
//     "date": "20181017",
//     "minute": "10:14",
//     "label": "10:14 AM",
//     "high": 255.83,
//     "low": 255.59,
//     "average": 255.736,
//     "volume": 900,
//     "notional": 230162,
//     "numberOfTrades": 9,
//     "marketHigh": 255.91,
//     "marketLow": 255.56,
//     "marketAverage": 255.702,
//     "marketVolume": 19628,
//     "marketNotional": 5018929.1222,
//     "marketNumberOfTrades": 252,
//     "open": 255.83,
//     "close": 255.6,
//     "marketOpen": 255.86,
//     "marketClose": 255.61,
//     "changeOverTime": -0.00846774193548397,
//     "marketChangeOverTime": -0.00859956575682389
// }

export const BaseChart = {
    getIntradayLine: data => {
        if(!data || data.length === 0){
            Log.error('Error in base.chart, no input data');
            return;
        }
        let d = [];
        data.forEach(element => {
            let dt = Util.dateFormat(element.date, element.minute);
            if(dt instanceof Date){
                d.push([
                    dt.getTime(),
                    element.average || element.marketAverage
                ]);
            }else{
                Log.error('Error in base.chart-getIntradayLine, fail to create dat object ');
            }
        });
        return d;
    }
};