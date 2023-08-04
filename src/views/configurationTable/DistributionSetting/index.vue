<template>
	<div class="app-container">
		<el-card class="box-card">
			<h3>分销设置</h3>
			<el-form ref="refDistributionForm" :rules="rules" :model="distributionForm" status-icon label-width="150px">

				<el-form-item label="是否开启分销" prop="isOpen">
					<el-radio-group v-model="distributionForm.isOpen">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="分销关系绑定天数" prop="distributionDay">
					<el-input v-model="distributionForm.distributionDay" placeholder="请输入分销关系绑定天数">
						<template #append>天</template>
					</el-input>
				</el-form-item>
				<el-form-item label="分销结算天数" prop="cashDay">
					<el-input v-model="distributionForm.cashDay" placeholder="请输入分销结算天数">
						<template #append>天</template>
					</el-input>
				</el-form-item>
			</el-form>
		</el-card>

		<div class="op-container">
			<el-button type="primary" @click="handleSave">保存</el-button>
		</div>

	</div>
</template>

<script>
import { settingControllerGet, settingControllerPut } from '@/api/configurationTable/distribution'

export default {
	name: 'DistributionSetting',
	data() {
		return {
			distributionForm: { isOpen: '', distributionDay: '', cashDay: '' },
			rules: {
				isOpen: [ { required: true, message: '商品名称不能为空', trigger: 'blur' } ],
				distributionDay: [ { required: true, message: '商品名称不能为空', trigger: 'blur' } ],
				cashDay: [ { required: true, message: '商品名称不能为空', trigger: 'blur' } ]
			}
		}
	},
	created() {
		settingControllerGet()
			.then((res) => {
				this.distributionForm.isOpen = typeof res.data.isOpen === 'boolean' ? res.data.isOpen : ''
				this.distributionForm.distributionDay = res.data.distributionDay || ''
				this.distributionForm.cashDay = res.data.cashDay || ''
			})
	},

	methods: {
		handleSave() {
			this.$refs.refDistributionForm.validate((valid) => {
				if (valid) {
					settingControllerPut(this.distributionForm)
						.then((res) => {
							this.$notify.success({
								title: '成功',
								message: '设置成功'
							})
						})
				} else {
					this.$message({
						type: 'error',
						message: '请设置完整的分销信息！'
					})
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.el-card {
	margin-bottom: 10px;
}
</style>
