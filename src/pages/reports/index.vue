<template>
  <div>
    <el-card class="cardList">
      <el-card v-for="(item, index) in cityData" :key="item">
        <div class="ctiy_box" @click="switchCity(index)">
          {{ item }}
        </div>
      </el-card>
    </el-card>
    <el-card class="cardEchart">
      <div>{{cityData[cityIndex]}}</div>
      <div ref="orgEchart" :style="{ width: '100%', height: '400px' }"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cityData: [],
      citydate: [],
      cityList: [],
      cityIndex: 0,
      ci
    };
  },
  created() {},
  watch: {},
  computed: {},
  mounted() {
    this.getChart();
  },
  methods: {
    async getChart() {
      const { data: res } = await this.$http.get('reports/type/1');
      console.log(res.data);
      if (res.meta.status !== 200) {
        this.$message.error('获取数据失败！');
      }
      this.cityData = res.data.legend.data;
      this.citydate = res.data.xAxis[0].data;
      this.cityList = res.data.series[0].data;
      this.orgEchart();
    },
    orgEchart() {
      let chart = this.$echarts.init(this.$refs.orgEchart);
      //职称结构取数
      let getsjjg = this.citydate;
      let getsjjgrs = this.cityList;
      let syjgdata = [];
      for (let i = 0; i < getsjjg.length; i++) {
        syjgdata.push({
          name: getsjjg[i],
          value: getsjjgrs[i]
        });
      }
      let rich = {
        name: {
          color: '#666666',
          fontSize: 14,
          padding: [8, 30, 0, 30],
          fontWeight: '400',
          align: 'center'
        },
        value: {
          color: '#333',
          fontSize: 15,
          padding: [0, 30, 8, 30],
          fontWeight: '500',
          align: 'center'
        },
        percent: {
          color: '#FFF',
          align: 'right',
          fontSize: 15,
          fontWeight: '500'
          //padding: [0, 5]
        },
        hr: {
          borderColor: '#DFDFDF',
          width: '100%',
          borderWidth: 1,
          height: 0
        },
        cir: {
          fontSize: 26
        }
      };
      //职称结构图表
      let colorList = ['#507AFF', '#51D9A2', '#FFC371', '#797AFF', '#fff324', '#543123'];
      let option = {
        series: [
          {
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorList[params.dataIndex];
                }
              }
            },
            type: 'pie',
            radius: ['0%', '50%'],
            center: ['50%', '50%'],
            label: {
              normal: {
                position: 'inner',
                formatter: params => {
                  return '{percent|' + params.percent.toFixed(0) + '%}';
                },
                rich: rich
              }
            },
            data: syjgdata
          },
          {
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorList[params.dataIndex];
                }
              }
            },
            type: 'pie',
            silent: true, //取消高亮
            radius: ['0%', '50%'],
            center: ['50%', '50%'],
            labelLine: {
              normal: {
                length: 30,
                length2: 0,
                lineStyle: {
                  color: 'transparent'
                }
              }
            },
            label: {
              normal: {
                formatter: params => {
                  return (
                    '{name|' +
                    params.name +
                    '}\n{hr|}\n{value|' +
                    params.value +
                    '本}'
                  );
                },
                rich: rich,
                padding: [2, 25, 0, 25]
              }
            },
            data: syjgdata,
            z: -1
          },
          {
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorList[params.dataIndex];
                }
              }
            },
            type: 'pie',
            silent: true, //取消高亮
            radius: ['0%', '50%'],
            center: ['50%', '50%'],
            labelLine: {
              normal: {
                length: 30,
                length2: 0,
                lineStyle: {
                  color: 'transparent'
                }
              }
            },
            label: {
              normal: {
                formatter: params => {
                  return '\n{cir|●}\n';
                },
                rich: rich
              }
            },
            data: syjgdata,
            z: -1
          },
          {
            itemStyle: {
              normal: {
                color: '#F2F9F7'
              }
            },
            type: 'pie',
            silent: true, //取消高亮
            radius: ['0%', '57%'],
            center: ['50%', '50%'],
            hoverAnimation: false, //取消动画效果
            data: syjgdata,
            label: {
              normal: {
                show: false,
                position: 'inner',
                formatter: params => {
                  return '{percent|' + params.percent.toFixed(0) + '%}';
                },
                rich: rich
              }
            },
            z: -1
          }
        ]
      };
      chart.setOption(option);
    },
    switchCity(e) {

    }
  }
};
</script>

<style lang="less" scoped>
.cardList {
  /deep/.el-card__body {
    display: flex;
    justify-content: space-between;

    .ctiy_box {
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      cursor: pointer;
    }
  }
}
.cardEchart {
  margin-top: 20px;
}
</style>
