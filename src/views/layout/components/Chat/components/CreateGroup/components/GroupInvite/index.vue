<template>
  <div class="filter-container">
    <div class="all-fields">
      <div
        class="box-head"
        style="display: flex;justify-content: space-between;align-items: center;"
      >
        <el-input
          v-model="filterText"
          size="small"
          style="width:280px;margin-right:10px"
          placeholder="请输入搜索联系人"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="text" size="mini" @click="selectAllInvert">
          <i
            class="el-icon-circle-plus-outline"
            style="font-size:22px;vertical-align: middle; font-weight:bold"
          ></i>
        </el-button>
      </div>
      <div style="margin-bottom: 25px;">
        <el-checkbox
          v-for="(item, index) in contactsSource"
          :key="index"
          v-model="group.checkedContacts"
          :label="item"
          style="padding: 0 10px;margin-left:0px"
          class="checkItem"
        >
          <img class="avatar" :src="item.avatar" alt />
          {{ item.displayName }}
        </el-checkbox>
        <br />
      </div>
    </div>
    <div class="selected-fields">
      <div class="box-head">已选择的用户列表 {{ group.checkedContacts.length }}</div>
      <div ref="selectedBox" class="selected-box">
        <div class="selected-item">
          <div>
            <span>
              <img class="avatar" :src="creator.avatar" alt />
              {{ creator.displayName }}
            </span>
          </div>
        </div>
        <div v-for="(item, index) in group.checkedContacts" :key="index" class="selected-item">
          <span>
            <img class="avatar" :src="item.avatar" alt />
            {{ item.displayName }}
          </span>
          <div class="cancelItemBtn" @click="deleteSelected(item, index)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupInvite',
  props: {
    creator: {
      type: Array,
      default: []
    },
    contacts: {
      type: Array,
      default: []
    },
    group: {
      type: Object
    }
  },
  data() {
    return {
      filterText: '',
      contactsSource: this.contacts
    }
  },

  watch: {
    filterText(queryString) {
      var contacts = this.contacts
      var results = queryString
        ? contacts.filter(this.createFilter(queryString))
        : contacts
      // 调用 callback 返回建议列表的数据
      this.contactsSource = results
    }
  },
  mounted() {},
  created() {},
  methods: {
    deleteSelected(data, index) {
      this.group.checkedContacts.splice(index, 1)
    },
    selectAllInvert() {
      const arr = [ ...this.contacts ].filter((x) => [ ...this.group.checkedContacts ].every((y) => y.id !== x.id))
      this.group.checkedContacts = arr
    },
    createFilter(queryString) {
      return (contacts) => contacts.displayName
        .toLowerCase()
        .indexOf(queryString.toLowerCase()) > -1
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container::after {
  content: '';
  display: block;
  clear: both;
}

.box-head {
  margin-bottom: 15px;
  padding: 10px 0;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.all-fields,
.selected-fields {
  float: left;
  padding: 5px 10px;
  height: 500px;
  border: 1px solid #ddd;
  overflow-y: scroll;
}

.all-fields {
  width: 48%;
  margin-right: 2%;
}

.selected-fields {
  width: 48%;
}

.checkAll {
  display: block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #f7f9fc;
}
.avatar {
  width: 30px;
  height: 30px;
  vertical-align: middle;
  margin-right: 5px;
  border-radius: 5px;
}
.all-fields ::v-deep .el-checkbox__label {
  font-size: 16px;
}
.all-fields ::v-deep .el-checkbox__input {
  float: right;
}
.all-fields ::v-deep .el-checkbox__inner {
  width: 16px;
  height: 16px;
  &::before {
    top: 6px;
  }
  &::after {
    top: 2px;
    left: 5px;
  }
}
.checkAll ::v-deep .el-checkbox__label {
  font-weight: bold;
}

.checkItem {
  margin: 0 0 15px 0;
  width: 100%;
}
.checkItem:hover ::v-deep .el-checkbox__inner {
  border-color: #409eff;
}

.selected-group {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
}

.selected-item {
  position: relative;
  padding: 5px 10px;
  border-radius: 10px;
  &--active {
    background-color: #ddd;
  }
  &:last-child {
    margin-bottom: 0;
  }

  .cancelItemBtn {
    position: absolute;
    top: 50%;
    right: 20px;
    margin-top: -8px;
    width: 16px;
    height: 16px;
    cursor: pointer;

    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      margin-top: -1px;
      width: 100%;
      height: 2px;
      background-color: #9f9f9f;
      transition: all 0.3s;
    }
    &::before {
      transform: rotate(45deg);
    }
    &::after {
      transform: rotate(-45deg);
    }

    &:hover {
      &::before,
      &::after {
        background-color: #f00;
      }
    }
  }
}
</style>
