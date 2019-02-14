const Util = {
  // 格式化价格
  priceTransfer(value) {
    let fixedPrice;
    let finalPrice;
    const actualPrice = Number(value) / 1000;
    const re = /(\d{1,3})(?=(\d{3})+(?:\.))/g;
    if (isNaN(value)) {
      finalPrice = '--';
    }
    if (actualPrice.toString().indexOf('.') !== -1) {
      if (actualPrice !== 0 && actualPrice.toString().split('.')[1].length > 2) {
        fixedPrice = parseFloat(actualPrice).toFixed(3);
        finalPrice = fixedPrice.replace(re, '$1,');
      } else {
        fixedPrice = parseFloat(actualPrice).toFixed(2);
        finalPrice = fixedPrice.replace(re, '$1,');
      }
    } else {
      fixedPrice = parseFloat(actualPrice).toFixed(2);
      finalPrice = fixedPrice.replace(re, '$1,');
    }
    return finalPrice;
  },
  timeStamp(time) {
    const date = new Date(parseInt(time, {}));
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const sec = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    const times = `${year}.${month}.${day} ${hour}:${min}:${sec}`;
    return times;
  },
  timeStampRow(time) {
    const date = new Date(parseInt(time, {}));
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const times = `${year}${month}${day}`;
    return times;
  },
  timeStampLite(time) {
    const date = new Date(parseInt(time, 0));
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      const zero = '0';
      month = zero + month;
    }
    if (day < 10) {
      const zero = '0';
      day = zero + day;
    }
    const line = '-';
    return year + line + month + line + day;
  },
  timeStampLiteAdd(time) {
    const date = new Date(parseInt(time, 0));
    // const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    if (month < 10) {
      const zero = '0';
      month = zero + month;
    }
    if (day < 10) {
      const zero = '0';
      day = zero + day;
    }
    return `${hour}:${minutes} ${month}-${day}`;
  },
  title(title) {
    const pageTitle = title || '监控管理';
    window.document.title = pageTitle;
  },
  /**
   *获取不同环境下的基本域名
   */
  baseUrl() {
    let baseURL = '';
    switch (process.env.NODE_ENV) {
      case 'production':
        baseURL = 'http://172.23.7.73';
        break;
      case 'daily':
        baseURL = 'http://172.23.7.73';
        break;
      case 'buildtest':
        baseURL = 'http://172.23.7.73';
        break;
      default:
        baseURL = 'http://172.23.7.73';
        break;
    }
    return baseURL;
  },
};

export default Util;
