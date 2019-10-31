export default class KpiEval {
  constructor(options = {}) {
    this.stat = options.stat;
    this.kpi = options.kpi;
    this.bound = options.kpi.bound.toLowerCase();
    this.value = options.value;
    this.compareWith = options.compareWith;
  }

  isInViolation() {
    switch (this.bound) {
      case 'higherviolation':
        // console.debug([this.value, this.kpi.value]);
        return this.value > this.kpi.value;
      case 'lowerviolation':
        return this.value < this.kpi.value;
      case 'percentage':
        // console.debug("% violating check", [this.value, this.compareWith]);
        if (this.compareWith && this.value < this.compareWith) {
          const diff = this.compareWith - this.value;
          const percentage = diff / this.compareWith;
          const comparePercentage = this.kpi.value / 100;
          // console.debug(`violating ${percentage} < ${comparePercentage} = ${percentage > comparePercentage} also ${diff}`)
          if (percentage > comparePercentage) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      default:
        return false;
    }
  }

  isExceedingTarget() {
    switch (this.bound) {
      case 'percentage':
        // console.debug("% exceeding check", [this.value, this.compareWith]);
        if (this.compareWith && this.value > this.compareWith) {
          const diff = this.value - this.compareWith;
          const percentage = diff / this.compareWith;
          const comparePercentage = this.kpi.value / 100;
          // console.debug(`exceeding ${percentage} > ${comparePercentage} = ${percentage > comparePercentage}`)
          if (percentage > comparePercentage) {
            // debugger;
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      case 'highertarget':
        return this.value > this.kpi.value;
      case 'lowertarget':
        return this.value < this.kpi.value;
      default:
        return false;
    }
  }
}
