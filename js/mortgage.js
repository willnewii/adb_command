const TOTAL = 340000;
const TOTALMONTH = 360;
const RATE = 4.655 / 100;

const startYear = 2016;
const startMonth = 8;

/**
 * 房贷计算器
 */
class mortgage {
    /**
     * @param total         贷款总额
     * @param totalmonth    还款月数
     * @param rate          贷款利率
     * @param _startYear    还款开始年
     * @param _startMonth   还款开始月
     */
    constructor(total, totalmonth, rate, _startYear, _startMonth) {
        this.total = total || TOTAL;
        this.totalmonth = totalmonth || TOTALMONTH;
        this.rate = rate || RATE;
        this.startYear = _startYear || startYear;
        this.startMonth = _startMonth || startMonth;

        //月还款本金
        this.principal = this.total / this.totalmonth;
    }

    /**
     * 当月应还
     */
    print() {
        let currentMonth = this.currentNumMonth();
        let monthInterest = this.calculateMonthInterest(currentMonth);
        let totalSum = this.calculateTotalSum();

        return {
          month :currentMonth ,
          yh:handleNumPrint(monthInterest + this.principal),
          dh:handleNumPrint((totalSum - this.calculateRepayment(currentMonth - 1))),
          year:handleNumPrint((this.totalmonth-currentMonth)/12)
        }

        /* return `第${currentMonth}期应还款:${handleNumPrint(monthInterest + this.principal)}元 ` + '\n\n' +
            //`已还款:${mortgage.handleNumPrint(this.calculateRepayment(currentMonth - 1))}元 ` + '\n' +
            `待还款:${handleNumPrint((totalSum - this.calculateRepayment(currentMonth - 1)))}元 ` + '\n\n' +
            `坚持一下你还有${handleNumPrint((this.totalmonth-currentMonth)/12)}年就能还完啦~` */
    }

    /**
     * 已还金额
     */
    calculateRepayment(numMonth) {
        //平均利息
        let temp1 = (this.calculateMonthInterest(1) + this.calculateMonthInterest(numMonth)) / 2;
        return (temp1 + this.principal) * numMonth;
    }

    /**
     * 当月利息
     */
    calculateMonthInterest(numMonth) {
        return (this.total - (numMonth - 1) * this.principal) * this.rate / 12;
    }

    /**
     * 总利息=〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×还款月数-总贷款额
     */
    calculateTotalSum() {
        return this.calculateRepayment(this.totalmonth);
    }

    /**
     * 获取当前还款期数
     */
    currentNumMonth() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;

        return (year - this.startYear) * 12 + (month - this.startMonth) + 1;
    }

}

function handleNumPrint(result) {
    return parseFloat(result).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

module.exports = mortgage;