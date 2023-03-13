<template>
  <div class="base">
    <showmenu style="width:100%;height: 10%;" />
    <div
      :style="{padding:10* $root.dw+'px'}"
      class="fristdiv"
    >
      <div
        v-for="value,index in list"
        :key="list[index].img_id"
        :style="{padding:20* $root.dw+'px'}"
        class="divitem"
      >
        <el-card :body-style="{ padding: '0px',height:'100%',width:'100%' ,cursor:'pointer'}">
          <img
            :src="common.splicingImgUrl()+list[index].img_url"
            style="width:100%;height:100%"
            @click="showPicture(list[index].img_url,list[index].img_title)"
          >
          <div class="TXBJW">
            <span>{{ list[index].img_title }}</span>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog :visible.sync="detailDialogVisible">
      <img
        :src="common.splicingImgUrl()+lookingPicture"
        width="100%"
      >
      <div
        :style="{width:'100%',fontSize:20*$root.dw+'px'}"
        class="TXBJW"
      >{{ lookingPictureTitle }}</div>
    </el-dialog>
  </div>
</template>

<script>
import { listGetPicture } from '@/api/painting/picture'
import showmenu from './showmenu.vue'

export default {
  name: 'PaintingShow',
  components: { showmenu },
  data () {
    return {
      activeIndex: '3',
      detailDialogVisible: false,
      img: require('@/assets/image/tfkj.png'),
      lookingPicture: '',
      lookingPictureTitle: '',
      list: [],
      listImg: [],
      total: 0,
      listLoading: true,
      listImgLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        paint_id: undefined,
        paint_title: undefined,
        sort: 'add_time',
        order: 'asc' // desc倒序
      },
      listQueryImg: {
        page: 1,
        limit: 0,
        paint_id: undefined,
        // img_id: undefined,
        // img_title: undefined,
        sort: 'add_time',
        order: 'asc' // desc倒序
      },
      downloadLoading: false
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.listQuery.paint_id = this.$route.query.id
      this.listQueryImg.paint_id = this.$route.query.id
      this.getList()
    } else {
      this.getList()
    }
  },
  created () {
  },
  methods: {
    getList () {
      this.listLoading = true
      listGetPicture(this.listQueryImg).then(response => {
        this.list = response.data.data.items
        this.list = this.list.filter(function (item) {
          return item.paint_id !== 1
        })
        // console.log(this.list)
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    showPicture (url, title) {
      this.lookingPictureTitle = title
      this.lookingPicture = url
      this.detailDialogVisible = true
    }
  }
}
</script>

<style scoped>
.base {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: flex-start;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.wmenu >>> .el-button {
  color: #000;
  border-color: rgba(0, 0, 0, 0.8);
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  /* transform: scale(2, 2); */
}

.Mytitle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ccd9ff;
  font-weight: bold;
}

.TXBJW {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.TXBJL {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.maxdiv {
  width: 100%;
  height: 100%;
}
.fristdiv {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: start;
  align-content: stretch;
  height: 95%;
  width: 95%;
  /* background-color: #3b637a; */
  /* background-color: rgba(52, 65, 76, 1); */
  /* background-color: rgba(47, 47, 57, 0.8); */
}

.divitem {
  width: 25%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
</style>
