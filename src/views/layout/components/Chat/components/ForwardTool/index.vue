<template>
	<el-dialog title="我的联系人" :visible.sync="forwardTool.dialogVisible" width="38%" append-to-body>
		<div class="filter-container">
			<div class="all-fields">
				<div class="box-head" style="display: flex;justify-content: space-between;align-items: center;">
					<el-input v-model="filterText" size="small" style="width:280px;margin-right:10px" placeholder="请输入搜索联系人">
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
					</el-input>
					<el-button type="text" size="mini" @click="selectAllInvert">
						<i class="el-icon-circle-plus-outline" style="font-size:22px;vertical-align: middle; font-weight:bold"></i>
					</el-button>
				</div>
				<div style="margin-bottom: 25px;">
					<el-checkbox
						v-for="(item, index) in forwardTool.contactsSource" :key="index" v-model="checkedContacts"
						:label="item" style="padding: 0 10px;margin-left:0px" class="checkItem"
					>
						<img class="avatar" :src="item.avatar" alt />
						{{ item.displayName }}
					</el-checkbox>
					<br />
				</div>
			</div>
			<div class="selected-fields">
				<div class="box-head">
					<el-divider content-position="left">已选择的用户列表 （{{ checkedContacts.length }}）</el-divider>
				</div>
				<div ref="selectedBox" class="selected-box">
					<div v-for="(item, index) in checkedContacts" :key="index" class="selected-item">
						<span>
							<img class="avatar" :src="item.avatar" alt />
							{{ item.displayName }}
						</span>
						<div class="cancelItemBtn" @click="deleteSelected(item, index)"></div>
					</div>
				</div>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="medium" @click="forwardTool.dialogVisible = false">取 消</el-button>
			<el-button type="primary" size="medium" @click="handleForwardMessage()">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
const defaultListQuery = {
	contact_id: ''
}
export default {
	name: 'ForwardTool',
	props: {
		forwardTool: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			filterText: '',
			checkedContacts: []
		}
	},
	watch: {
		filterText(queryString) {
			var contacts = this.forwardTool.contact
			var results = queryString
				? contacts.filter(this.createFilter(queryString))
				: contacts
			// 调用 callback 返回建议列表的数据
			this.forwardTool.contactsSource = results
		}
	},
	mounted() { },
	created() { },
	methods: {
		init() { },
		handleForwardMessage() {
			const contact = []
			for (let i = 0; i < this.checkedContacts.length; i++) {
				contact.push({
					id: this.checkedContacts[i].id,
					is_group: this.checkedContacts[i].is_group,
					displayName: this.checkedContacts[i].displayName
				})
			}

			// const message = []
			// for (let i = 0; i < this.forwardTool.multiMessage.length; i++) {
			//   message.push({
			//     id: this.forwardTool.multiMessage[i].id,
			//     is_group: this.forwardTool.multiMessage[i].isGroup
			//   })
			// }
			// this.$parent.$parent.send(
			//   {
			//     message,
			//     contact,
			//     user: this.forwardTool.user
			//   },
			//   this.forwardTool.type == 'mergeForward'
			//     ? '/message/merge_forward_message'
			//     : '/message/forward_message',
			//   'POST'
			// )
			if (this.forwardTool.type == 'mergeForward') { } else {
				let tempDate = Date.now()
				contact.forEach((contactItem, count) => {
					this.forwardTool.multiMessage.forEach(async (item, index) => {
						const message = {
							id: tempDate,
							status: 'succeed',
							type: item.type,
							sendTime: tempDate,
							content: item.content,
							toContactId: contactItem.id,
							fileSize: item.fileSize,
							fileName: item.fileName,
							fromUser: {
								id: this.$parent.$parent.user.id,
								displayName: this.$parent.$parent.user.displayName,
								avatar: this.$parent.$parent.user.avatar
							},
							isGroup: !!contactItem.is_group
						}
						tempDate = tempDate + 1
						await this.$parent.$parent.send(message, 'oneByoneSend', contactItem)
						this.$parent.$parent.$refs.IMUI.appendMessage(message, true)
					})
				})
			}
			this.checkedContacts = []
			this.forwardTool.dialogVisible = false
			this.$parent.$parent.closeMulti()
		},
		deleteSelected(data, index) {
			this.checkedContacts.splice(index, 1)
		},
		selectAllInvert() {
			const arr = [ ...this.forwardTool.contact ].filter((x) => [ ...this.checkedContacts ].every((y) => y.id !== x.id))
			this.checkedContacts = arr
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
