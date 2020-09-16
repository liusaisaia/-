<template>
  <div>
    <div class="card_top">
      <div v-for="item in cardList" :key="item.name" @click="changeCard">
        <el-card class="box-card" >
          <div @click="changeCard">
            <img :src="item.img" alt="##" />
          </div>
          <div>
            <p>{{ item.name }}</p>
            <p>{{ item.num }}</p>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 内容 -->
    <div>
      <el-card class="chart_box">
        <div ref="myChart" :style="{ width: '100%', height: '400px' }"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {
      cardList: [
        {
          img: require('@/assets/fonts/yonghu.png'),
          name: '用户来访',
          num: 1113
        },
        {
          img: require('@/assets/fonts/lishi.png'),
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
    };
  },
  mounted() {
    this.numMath();
  },
  methods: {
    changeCard() {
      // console.log(e);
      this.numMath();
    },
    // 数量递增
    numAdd() {
      this.cardList.map(item => {
        let num = item.num;
        item.num = item.num - 100;
      });
    },
    numMath() {
      this.dataTop = [];
      this.dataBottom = [];
      for (let i = 1; i <= 7; i++) {
        this.dataTop.push(Math.floor(Math.random() * 1000 + 1));
        this.dataBottom.push(Math.floor(Math.random() * 1000+ 1));
      }
      this.chartInit();
    },
    // 折线图引入
    chartInit() {
      let chart = this.$echarts.init(this.$refs.myChart);
      let colors = ['#5793f3', '#d14a61', '#675bba'];
      let that = this;
      let option = {
        color: colors,
        // title: {
        //     text: '折线图堆叠'
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
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
            data: that.dataTop
          },
          {
            type: 'line',
            name: 'bottom',
            smooth: true,
            stack: '总量',
            data: that.dataBottom
          }
        ]
      };
      chart.setOption(option);
    }
  }
};
</script>

<style scoped lang="less">
.card_top {
  display: flex;
  justify-content: space-between;
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
