<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    id="Shopupcreate"
  >
    <el-card class="box-card">
      <el-form
        :model="ShopInfo"
        :inline="true"
        status-icon
        class="demo-ruleForm"
        @submit.native.prevent
      >
        <el-col :span="12">
          <el-form-item
            label="登录账号"
            prop="username"
          >
            <el-input
              v-model="ShopInfo.username"
              autocomplete="off"
              clearable
              placeholder="请填写登录账号(至少为6位) 用于登录"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="登录密码"
            prop="password"
          >
            <el-input
              v-model="ShopInfo.password"
              type="password"
              autocomplete="off"
              clearable
              placeholder="请填写密码(至少为6位) 用于登录"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="联系电话"
            prop="mobile"
          >
            <el-input
              v-model="ShopInfo.mobile"
              autocomplete="off"
              clearable
              placeholder="请填写手机号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="门店名称"
            prop="brandname"
          >
            <el-input
              v-model="ShopInfo.brandname"
              autocomplete="off"
              clearable
              placeholder="请填写门店名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            class="mandatoryclass"
            label="所属类型"
            prop="SubProCategory"
          >
            <el-select
              v-model="ShopInfo.brandgenre"
              placeholder="请选择所属类型"
              autocomplete="off"
            >
              <el-option
                v-for="StoreType in listStoreType"
                :key="StoreType.id"
                :label="StoreType.storeName"
                :value="StoreType.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            class="mandatoryclass"
            label="所在城市"
            prop="SubProCategory"
          >
            <!-- <el-input v-model="dataForm.areaname" /> -->
            <el-cascader
              :options="areaOptions"
              v-model="selectedAreaOptions"
              size="large"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          class="longinput"
        >
          <el-form-item
            label="详细地址"
            prop="addressdetail"
          >
            <el-input
              v-model="ShopInfo.addressdetail"
              autocomplete="off"
              clearable
              placeholder="请输入详细地址"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            class="mandatoryclass"
            label="营业开始时间"
            prop="startTime"
          >
            <el-time-select
              v-model="ShopInfo.startTime"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
              }"
              placeholder="营业开始时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            class="mandatoryclass"
            label="营业结束时间"
            prop="endTime"
          >
            <el-time-select
              v-model="ShopInfo.endTime"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
              }"
              placeholder="营业开始时间"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          class="longinput"
        >
          <el-form-item
            label="门店介绍"
            prop="desc"
          >
            <el-input
              v-model="ShopInfo.desc"
              autocomplete="off"
              clearable
              placeholder="请输入门店介绍"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <!-- <el-form-item label="门店logo">
          <el-upload
            :action="uploadPath"
            :show-file-list="false"
            :headers="headers"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="ShopInfo.picUrl" :src="ShopInfo.picUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item> -->
        <el-col :span="24">
          <el-form-item
            class="btn"
            style="padding-top: 2vh"
          >
            <el-button
              type="primary"
              native-type="submit"
              @click="Submit()"
            >{{
              editflag ? '编辑提交' : '提交'
            }}</el-button>
            <!-- <el-button type="primary" native-type="submit" @click="addPosal">新增</el-button> -->
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { listStoreType } from '@/api/business/brand'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { uploadPath } from '@/api/business/storage'
export default {
  name: 'ShopUpCreate',
  data () {
    return {
      uploadPath,
      selectedAreaOptions: [],
      areaOptions: regionData,
      ShopInfo: {
        id: '', // 申请表单号
        username: '', // 登录账号
        password: '', // 登录密码
        mobile: '', // 手机号
        // username: '', //用户名
        brandname: '', // 门店名称
        brandgenre: -1, // 门店类型
        addressdetail: '', // 具体门店地址
        longitude: '', // 经度
        latitude: '', // 纬度
        startTime: '9:00', // 开始营业时间HH:mm:ss
        endTime: '18:00', // 结束营业时间HH:mm:ss
        desc: '', // 门店简介
        comment: '', // 备注
        applicationType: 1, // 升级类型(商家)
        // status: null, // 状态
        picUrl: '', // 门店logo
        licenseUrl: '', // 营业执照
        brandIdcardProsUrl: '', // 法人身份证人像面
        brandIdcardConsUrl: '', // 法人身份证国徽面
        haveaddress: ''
      },
      listStoreType: [],
      editflag: false
    }
  },
  async created () {
    listStoreType()
      .then((response) => {
        console.log(response)
        this.listStoreType = response.data.data.items
        this.ShopInfo.brandgenre = response.data.data.items[0].id
        console.log(this.listStoreType)
      })
      .catch((error) => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error,
          type: 'error'
        })
      })
  },
  methods: {
    handleChange (value) {
      console.log(value)
      this.getCodeToText(null, value)
    },
    getCodeToText (codeStr, codeArray) {
      if (codeStr === null && codeArray === null) {
        return null
      } else if (codeArray === null) {
        codeArray = codeStr.split(',')
      }
      let area = ''
      switch (codeArray.length) {
        case 1:
          area += CodeToText[codeArray[0]]
          break
        case 2:
          area += CodeToText[codeArray[0]] + '/' + CodeToText[codeArray[1]]
          break
        case 3:
          area +=
            CodeToText[codeArray[0]] +
            '/' +
            CodeToText[codeArray[1]] +
            '/' +
            CodeToText[codeArray[2]]
          break
        default:
          break
      }
      console.log(area)
      this.ShopInfo.haveaddress = area
      return area
    },
    Submit () {
      this.$message({
        showClose: true,
        message: '正在开发中',
        type: 'error'
      })
    }
  }
}
</script>

<style scoped>
#Shopupcreate {
  height: 100%;
  overflow: scroll;
}
#Shopupcreate::-webkit-scrollbar {
  width: 0;
}

#Shopupcreate {
  -ms-overflow-style: none;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
#Shopupcreate > div:nth-child(1) >>> .el-form--inline .el-form-item {
  margin-right: 0 !important;
  width: 100%;
}
#Shopupcreate > div:nth-child(1) >>> .el-form--inline .el-form-item__label {
  width: 16vw !important;
}

.longinput >>> .el-form-item__content {
  width: 59.5vw !important;
}

#Shopupcreate > div:nth-child(1) >>> .el-form-item__content {
  width: 20vw;
}

#Shopupcreate > div:nth-child(1) >>> .el-select {
  width: 100% !important;
}

#Shopupcreate > div:nth-child(1) >>> .el-cascader {
  width: 100% !important;
}
/* #createProSetUp .el-form-item {
    margin-bottom: 2vh;
} */

.btn {
  display: flex !important;
  justify-content: center;
}

.btn .el-form-item__content {
  width: auto !important;
}
.el-collapse-item__header {
  background-image: linear-gradient(
    to top,
    #1e3c72 0%,
    #1e3c72 1%,
    #2a5298 100%
  );
  -webkit-back: text;
  -webkit-background-clip: text;
  font-weight: bold;
  background-clip: text;
  -moz-background-clip: text;
  -ms-background-clip: text;
  color: transparent;
}

.JYSCard .upload-demo {
  display: flex;
  justify-content: space-around;
}

.JYSCard .el-collapse-item__wrap {
  padding-top: 2vh;
}

#Shopupcreate > div:nth-child(1) .el-button--primary {
  width: 11vw;
}

.mandatoryclass .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

#Shopupcreate > div:nth-child(1) .el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 20vw;
}

#Shopupcreate > div:nth-child(1) .el-form-item__content {
  width: 20vw;
}

#Shopupcreate .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#Shopupcreate .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
#Shopupcreate .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
#Shopupcreate .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
/* #Shopupcreate .el-range-editor.el-input__inner {
  padding: 0 !important;
} */
</style>
