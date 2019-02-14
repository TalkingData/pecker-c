const options = {
  title: {},
  tooltip: {
    trigger: 'axis',
    padding: 15,
    textStyle: {
      color: '#686f79',
      fontSize: 12,
      fontFamily: 'Microsoft Yahei',
    },
    borderColor: '#eee',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'line', // 默认为直线，可选为：'line' | 'shadow'
      lineStyle: { // 直线指示器样式设置
        color: '#ebecf1',
        width: 1,
        type: 'solid',
      },
      color: 'rgba(0,0,0,1)',
    },
  },
  legend: {
    data: [],
    itemHeight: 4,
    itemWidth: 12,
    trigger: 'axis',
    left: 'center',
    top: 'bottom',
    borderWidth: 0,
    textStyle: {
      fontSize: 12,
      fontFamily: 'Microsoft Yahei',
    },
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'line', // 默认为直线，可选为：'line' | 'shadow'
      lineStyle: { // 直线指示器样式设置
        width: 2,
        type: 'solid',
      },
      color: 'rgba(0,0,0,1)',
    },
  },
  toolbox: {
    show: true,
    right: 20,
    feature: {
      mark: {
        show: false,
      },
      dataView: {
        show: false,
        readOnly: false,
      },
      dataZoom: {
        show: false,
      },
      magicType: {
        show: true,
        title: {
          line: '动态类型切换-折线图',
          bar: '动态类型切换-柱形图',
        },
        type: ['line', 'bar'],
      },
      restore: {
        show: false,
      },
      saveAsImage: {
        show: true,
      },
    },
  },
  grid: {
    top: 30,
    left: '3%',
    right: '4%',
    bottom: 30,
    borderWidth: 1,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    splitLine: false,
    // 坐标轴线处理结果
    axisLine: {
      lineStyle: {
        color: '#dcdfe4',
        opacity: 1,
      },
    },
    // 坐标轴刻度
    axisTick: {
      show: false,
    },
    data: [],
    axisLabel: {
      show: true,
      textStyle: {
        color: '#333333',
      },
    },
  },
  yAxis: [
    {
      type: 'value',
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#dcdfe4',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#e3ecf3',
        },
      },
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          color: '#333333',
        },
      },
    },
  ],
  dataZoom: [],
  series: [],
};

export default options;
