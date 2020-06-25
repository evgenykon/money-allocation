'user strict';

class ChartHelper {


    constructor() {
        this.counts = {};
    }

    /**
     * @param {*} date 
     */
    formatDateToStr(date) {
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        return [date.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('-');

    }

    /**
     * @param {*} revisions 
     */
    generateChartByDates(revisions) {
        if (revisions.length === 0) {
            return;
        }

        let firstDate = this.formatDateToStr(new Date(revisions[0].inserted_at));
        let counts = {};
        let lastDate = firstDate;
        for (let i in revisions) {
            let currentDate = this.formatDateToStr(new Date(revisions[i].inserted_at));
            const billId = revisions[i].bill_id;
            if (parseInt(currentDate.substr(8,2)) >= 10) {
                lastDate = currentDate.substr(0,8) + '25';
            }
            if (parseInt(currentDate.substr(8,2)) >= 25) {
                lastDate = currentDate.substr(0,8) + '10';
            }
            if (typeof counts[lastDate] === 'undefined') {
                counts[lastDate] = {};
            }
            if (typeof counts[lastDate][billId] === 'undefined') {
                counts[lastDate][billId] = 0;
            }
            counts[lastDate][billId] = revisions[i].balance_amount;
        }
        this.counts = counts;
        console.debug('counts', counts);
    }

    getDataset() {
        let values = [];
        for (let day in this.counts) {
            let value = 0;
            for (let billId in this.counts[day]) {
                value += parseFloat(this.counts[day][billId]);
            }
            values.push(value);
        }
        return [
          {
              backgroundColor: '#456789',
              borderColor: '#3300ff',
              label: 'Total amount',
              data: values
          }
        ];
    }

    getLabels() {
        let labels = [];
        for (let day in this.counts) {
            const dt = day.split('-');
            labels.push(dt[2] + '.' + dt[1]);
        }
        console.debug('labels', labels);
        return labels;
    }
}

export default ChartHelper;
