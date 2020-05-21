export function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;
  
    // performanceごとにシャローコピーし、情報を追加する
    function enrichPerformance(aPerformances) {
      const calculator = new PerformanceCalculator(aPerformances, playFor(aPerformances));
      const result = Object.assign({}, aPerformances); //ディープコピーのように使っている？
      result.play = calculator.play;
      result.amount = amountFor(result);
      result.volumeCredits = volumeCreditsFor(result);
      return result;
    }
  
    function playFor(aPerformances) {
      return plays[aPerformances.playID];
    }
  
    function amountFor(aPerformances) {
      return new PerformanceCalculator(aPerformances, playFor(aPerformances)).amount;
    }
  
    function volumeCreditsFor(aPerformances) {
      let result = 0;
      result += Math.max(aPerformances.audience - 30, 0);
      if ("comedy" === aPerformances.play.type)
        result += Math.floor(aPerformances.audience / 5);
      return result;
    }
  
    function totalVolumeCredits(data) {
      let result = 0;
      for (let perf of data.performances) {
        result += perf.volumeCredits;
      }
      return result;
    }
  
    function totalAmount(data) {
      let result = 0;
      for (let perf of data.performances) {
        result += perf.amount;
      }
      return result;
    }
  }

  class PerformanceCalculator{
    constructor(aPerformances, aPlay){
      this.performances = aPerformances;
      this.play = aPlay;
    }

    get amount(){
      let result = 0;
      switch (this.play.type) {
        case "tragedy":
          result = 40000;
          if (this.performances.audience > 30) {
            result += 1000 * (this.performances.audience - 30);
          }
          break;
        case "comedy":
          result = 30000;
          if (this.performances.audience > 20) {
            result += 10000 + 500 * (this.performances.audience - 20);
          }
          result += 300 * this.performances.audience;
          break;
        default:
          throw new Error(`unknown type: ${this.play.type}`);
      }
      return result;
    }
  }