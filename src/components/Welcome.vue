<template>
  <div>
    <div class="card_top">
      <el-card class="box-card" v-for=" item in cardList" :key="item.name">
        <div>
          <img :src="item.img" alt="##">
        </div>
        <div>
          <p>{{item.name}}</p>
          <p>{{item.num}}</p>
        </div>
      </el-card>
    </div>
    <!-- 内容 -->
    <div>
      <el-card class="chart_box">
        <div ref="myChart" :style="{width: '100%', height: '400px'}"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      cardList: [
        {
          img: require('../assets/fonts/yonghu.png'),
          name: '用户来访',
          num: 1113
        },
        {
          img: require('../assets/fonts/lishi.png'),
          name: '历史记录',
          num: 4321
        },
        {
          img: require('@/assets/fonts/shuju.png'),
          name: '数据数量',
          num: 1234
        },
        {
          img: require('@/assets/fonts/wenjian.png'),
          name: '文件数量',
          num: 3412
        }
      ],
      dataTop: [],
      dataBottom: []
    }
  },
  mounted() {
    this.numAdd();
    this.chartInit();
    this.numMath();
  },
  methods: {
    // 数量递增
    numAdd() {
      this.cardList.map(item => {
        let num = item.num;
        item.num = item.num - 100;
      })
    },
    numMath() {
      for (let i = 1; 5; i++) {
        console.log(i);
      }
    },
    // 折线图引入
    chartInit() {
      let chart = this.$echarts.init(this.$refs.myChart);
      let colors = ['#5793f3', '#d14a61', '#675bba'];
      let option = {
          color: colors,
          // title: {
          //     text: '折线图堆叠'
          // },
          tooltip: {
              trigger: 'axis'
          },
          legend: {

          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
          ],
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  type: 'line',
                  name: 'top',
                  stack: '总量',
                  smooth: true,
                  data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                  type: 'line',
                  name: 'bottom',
                  smooth: true,
                  stack: '总量',
                  data: [220, 182, 191, 234, 290, 330, 310]
              }
          ]
      };
      chart.setOption(option);
    }
  }
}
</script>

<style scoped lang="less">
.card_top {
  display: flex;
  justify-content:space-between;
}
.box-card {
  /deep/.el-card__body {
    display: flex !important;
    :nth-child(1) {
      margin-right: 20px;
    }
  }
  img {
    width: 100px;
  }
}
.chart_box {
  margin-top: 20px;
}
</style>
