<template>
  <div class="base">
    <el-card :style="{height:'100%',width:'100%'}">
      <div
        v-if="UserInfo.admin"
        :style="{fontSize:20*$root.dw+'px'}"
        class="admindiv"
      >
        <p>账号信息（PC端）</p>
        <div>
          <img
            :style="{borderRadius:'50%'}"
            :src="common.splicingImgUrl()+UserInfo.admin.avatar"
            width="80px"
            alt=""
          >
        </div>
        <ul>
          <li>系统信息编号：{{ UserInfo.admin.id }}</li>
          <li>账号：{{ UserInfo.admin.username }}</li>
          <li>最近登录地点：{{ UserInfo.admin.lastLoginIp }}</li>
          <li>最近登录时间：{{ UserInfo.admin.lastLoginTime }}</li>
          <li>绑定人员ID：{{ UserInfo.admin.userId }}</li>
          <li>权限：
            <template v-for="roleId in UserInfo.admin.roleIds ">
              {{ roleIdsArr.filter(item => item.id == roleId)[0] ?
              roleIdsArr.filter(item => item.id == roleId)[0].name : '' }}，
            </template >
          </li>
          <li>描述：{{ UserInfo.admin.desc }}</li>
          <li>电话：{{ UserInfo.admin.tel }}</li>
          <li>邮箱：{{ UserInfo.admin.mail }}</li>
        </ul>
      </div>
      <div v-else>暂无信息</div>
      <el-divider />
      <div
        v-if="UserInfo.user"
        :style="{fontSize:20*$root.dw+'px'}"
        class="admindiv"
      >
        <p>用户信息（移动端）</p>
        <div>
          <img
            :style="{borderRadius:'50%'}"
            :src="common.splicingImgUrl()+UserInfo.user.avatar"
            width="80px"
            alt=""
          >
        </div>
        <ul>
          <li>用户编号：{{ UserInfo.user.id }}</li>
          <li>用户名：{{ UserInfo.user.username }}</li>
          <li>用户昵称：{{ UserInfo.user.nickname }}</li>
          <li>性别：{{ genderDic[UserInfo.user.gender] }}</li>
          <li>生日：{{ UserInfo.user.birthday }}</li>
          <li>最近登录地点：{{ UserInfo.user.lastLoginIp }}</li>
          <li>最近登录时间：{{ UserInfo.user.lastLoginTime }}</li>
          <li>
            用户级别：{{ userLevelArr.filter(item => item.id == UserInfo.user.userLevel)[0] ?
            userLevelArr.filter(item => item.id == UserInfo.user.userLevel)[0].name : '' }}
          </li>
          <li>联系方式：{{ UserInfo.user.mobile }}</li>
        </ul>
      </div>
      <div v-else>暂无信息</div>
      <el-divider />
      <div
        v-if="UserInfo.salesman"
        :style="{fontSize:20*$root.dw+'px'}"
        class="admindiv"
      >
        <p>身份信息</p>
        <ul>
          <li>身份编号：{{ UserInfo.salesman.id }}</li>
          <li>名字：{{ UserInfo.salesman.name }}</li>
          <li>性别：{{ genderDic[UserInfo.salesman.gender] }}</li>
          <li>电话：{{ UserInfo.salesman.mobile }}</li>
          <li>邮箱：{{ UserInfo.salesman.email }}</li>
          <li>微信号：{{ UserInfo.salesman.wechat }}</li>
          <li>生日：{{ UserInfo.salesman.birthday }}</li>
          <li>入职时间：{{ UserInfo.salesman.entrydate }}</li>
          <li>离职时间：{{ UserInfo.salesman.leavedate }}</li>
          <li>
            在职状态：{{ activeStatus.filter(item => item.id == UserInfo.salesman.salemanstateid)[0] ? activeStatus.filter(item => item.id == UserInfo.salesman.salemanstateid)[0].name: '' }}
          </li>
          <li>业务员类型：{{ typeArr[UserInfo.salesman.type] }}</li>
          <li>所属地区：{{ UserInfo.salesman.areaname }}</li>
          <li>居住地址：{{ UserInfo.salesman.address }}</li>
          <li>身份证正面：</li>
          <img
            v-if="UserInfo.salesman.idcardProsUrl"
            :style="{borderRadius:'50%'}"
            :src="common.splicingImgUrl()+UserInfo.salesman.idcardProsUrl"
            width="80px"
            alt=""
          >
          <li>身份证反面：</li>
          <img
            v-if="UserInfo.salesman.idcardConsUrl"
            :style="{borderRadius:'50%'}"
            :src="common.splicingImgUrl()+UserInfo.salesman.idcardConsUrl"
            width="80px"
            alt=""
          >
          <li>所得佣金：{{ UserInfo.salesman.commission }}</li>
          <li>所属会员id：{{ UserInfo.salesman.userId }}</li>
        </ul>
      </div>
      <div v-else>暂无信息</div>
      <el-divider />
      <div
        v-if="UserInfo.voucherHold"
        :style="{fontSize:20*$root.dw+'px'}"
        class="admindiv"
      >
        <p>代金券信息</p>
        <ul>
          <li>代金券编号：{{ UserInfo.voucherHold.id }}</li>
          <li>用户编号：{{ UserInfo.voucherHold.userId }}</li>
          <li>代金券数量：{{ UserInfo.voucherHold.number }}</li>
        </ul>
      </div>
      <div v-else>暂无信息</div>
      <el-divider />
    </el-card>
  </div>
</template>

<script>
import { UserInfoGet } from '@/api/profile/userInfo'
export default {
  name: 'UserInfo',
  data () {
    return {
      roleIdsArr: [
        { id: 1, name: '超级管理员' },
        { id: 2, name: '商场管理员' },
        { id: 3, name: '推广管理员' },
        { id: 4, name: '门店' },
        { id: 5, name: '营销策划' },
        { id: 6, name: '门店业务员' },
        { id: 7, name: '门店高级业务员' }
      ],
      genderDic: ['未知', '男', '女'],
      userLevelArr: [
        { id: 1, name: '门店' },
        { id: 2, name: '营销策划师' },
        { id: 4, name: 'VIP会员' },
        { id: 5, name: '会员' }
      ],
      activeStatus: [
        { id: 0, name: '在职' },
        { id: -1, name: '离职' },
        { id: -2, name: '已删除' }
      ],
      typeArr: ['门店', '营销'],
      UserInfo: {
        admin: undefined,
        salesman: undefined,
        user: undefined,
        voucherHold: undefined
      }
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      UserInfoGet().then(response => {
        console.log(response.data.data)
        this.UserInfo = response.data.data
        // this.$notify.success({
        //   title: '成功',
        //   message: '修改密码成功'
        // })
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    }
  }
}
</script>

<style scoped>
.base {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2%;
}
.admindiv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
}
</style>
