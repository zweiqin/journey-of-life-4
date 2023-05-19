<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
	<div class="login">
		<div class="introduce-container">
			<div style="font-size: 0.9375vw">巨蜂生活 万店互联</div>
			<div
				style="
          margin-top: 1.0417vw;
          margin-bottom: 0.7813vw;
          font-size: 2.0833vw;
          font-weight: 700;
        "
			>
				新经济 新商业 为商户创效益
			</div>
			<div style="font-size: 0.7813vw">JUFENG</div>
		</div>
		<div class="login-container">
			<div class="login-header">
				<h2 class="login-title" style="font-size: 1.25vw">
					欢迎登录巨蜂管理系统
				</h2>
				<hr />
				<h4 style="font-size: 0.8333vw">
					WELCOME TO THE JUFENG management system
				</h4>
			</div>
			<div class="login-card">
				<el-card
					shadow="never"
					:body-style="{ padding: '0px' }"
					style="border: 0; background-color: transparent"
				>
					<!-- <el-tabs v-else v-model="activeName" @tab-click="handleClick"> -->
					<!-- <el-tab-pane label="密码登录" name="first"> -->
					<div class="login-box login-tab-box">
						<el-form ref="loginForm" :model="loginForm" :rules="loginRules">
							<el-form-item prop="username">
								<el-input
									v-model="loginForm.username"
									type="text"
									auto-complete="off"
									placeholder="请输入账号"
								>
									<div
										slot="prefix"
										style="
                      width: 100%;
                      height: 100%;
                      background-color: #fdb500;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
									>
										<img
											style="width: 0.7292vw; height: 0.7292vw"
											src="@/assets/image/humer.png"
											alt=""
											srcset=""
										/>
									</div>
								</el-input>
							</el-form-item>
							<el-form-item prop="password">
								<el-input
									v-model="loginForm.password"
									type="password"
									auto-complete="off"
									placeholder="请输入密码"
									show-password
									@keyup.enter.native="handleLogin"
								>
									<div
										slot="prefix"
										style="
                      width: 100%;
                      height: 100%;
                      background-color: #fdb500;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
									>
										<img
											style="width: 0.7292vw; height: 0.7292vw"
											src="@/assets/image/password.png"
											alt=""
											srcset=""
										/>
									</div>
								</el-input>
							</el-form-item>
							<el-form-item prop="code">
								<el-input
									v-model="loginForm.code"
									auto-complete="off"
									placeholder="验证码"
									style="width: 63%"
									@keyup.enter.native="handleLogin"
								>
									<div
										slot="prefix"
										style="
                      width: 100%;
                      height: 100%;
                      background-color: #fdb500;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
									>
										<img
											style="width: 0.7292vw; height: 0.7292vw"
											src="@/assets/image/yanzheng.png"
											alt=""
											srcset=""
										/>
									</div>
								</el-input>
								<div class="login-code">
									<img
										width="100%"
										height="100%"
										:src="codeUrl"
										@click="getCode"
									/>
								</div>
							</el-form-item>
							<el-checkbox
								v-model="loginForm.rememberMe"
								style="margin: 0px 0px 25px 0px; color: rgba(0, 0, 0, 0.85)"
							>
								记住密码
							</el-checkbox>
							<el-form-item style="width: 100%">
								<el-button
									:loading="loading"
									size="medium"
									type="primary"
									style="width: 100%; height: 2.6042vw"
									@click.native.prevent="handleLogin"
								>
									<span v-if="!loading">登 录</span>
									<span v-else>登 录 中...</span>
								</el-button>
							</el-form-item>
						</el-form>
					</div>
				</el-card>
			</div>
		</div>
		<!--  底部  -->
		<!-- <div class="el-login-footer">
			<span>Copyright © 2020-2030 团蜂科技版权所有.</span>
			</div> -->
	</div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'

export default {
	name: 'Login',
	data() {
		const phoneCheck = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('手机号不能为空'))
			}
			const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
			if (reg.test(value)) {
				callback()
			} else {
				return callback(new Error('请输入正确的手机号'))
			}
		}
		return {
			activeName: 'first',
			codeUrl: '',
			cookiePassword: '',

			loginForm: {
				username: '',
				password: '',
				rememberMe: false,
				code: '',
				typ: 0,
				uuid: ''
			},
			loginRules: {
				username: [
					{ required: true, trigger: 'blur', message: '用户名不能为空' }
				],
				password: [
					{ required: true, trigger: 'blur', message: '密码不能为空' }
				],
				code: [
					{ required: true, trigger: 'change', message: '验证码不能为空' }
				]
			},

			validationForm: {
				phone: '',
				code: ''
			},
			validationRules: {
				phone: [ { required: true, trigger: 'change', validator: phoneCheck } ],
				code: [
					{ required: true, trigger: 'change', message: '验证码不能为空' }
				]
			},
			validationDisabled: false,
			validationText: '发送验证码',
			countDown: 60,

			loading: false,
			redirect: undefined
		}
	},
	watch: {
		$route: {
			handler(route) {
				this.redirect = route.query && route.query.redirect
			},
			immediate: true
		}
	},
	created() {
		this.getCode()
		this.getCookie()
	},
	methods: {
		switchLogin() {
			if (this.activeName === 'third') {
				this.activeName = 'first'
			} else {
				this.activeName = 'third'
			}
		},
		handleClick(tab, event) {
			console.log(tab, event)
		},
		getCode() {
			getCodeImg().then((res) => {
				console.log(res)
				this.codeUrl = 'data:image/gif;base64,' + res.data.data.img
				this.loginForm.uuid = res.data.data.uuid
			})
		},
		getCookie() {
			const username = Cookies.get('username')
			const password = Cookies.get('password')
			const typ = Cookies.get('typ')
			const rememberMe = Cookies.get('rememberMe')
			this.loginForm = {
				username: username === undefined ? this.loginForm.username : username,
				password: password === undefined ? this.loginForm.password : password,
				typ: typ === undefined ? this.loginForm.typ : typ,
				rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
			}
		},
		handleLogin() {
			if (this.activeName === 'first') {
				this.$refs.loginForm.validate((valid) => {
					if (valid) {
						this.loading = true
						if (this.loginForm.rememberMe) {
							Cookies.set('username', this.loginForm.username, { expires: 30 })
							Cookies.set('password', this.loginForm.password, { expires: 30 })
							Cookies.set('typ', this.loginForm.typ, { expires: 30 })
							Cookies.set('rememberMe', this.loginForm.rememberMe, {
								expires: 30
							})
						} else {
							Cookies.remove('username')
							Cookies.remove('password')
							Cookies.remove('rememberMe')
						}
						this.$store
							.dispatch('LoginByUsername', this.loginForm)
							.then(() => {
								this.loading = false
								this.$router.push({ path: this.redirect || '/' })
							})
							.catch((response) => {
								this.loading = false
								this.getCode()
							})
					}
				})
			} else if (this.activeName === 'second') {
				this.$refs.validationForm.validate((valid) => {
					if (valid) {
						this.loading = true
						this.$store
							.dispatch('LoginByVerification', this.loginForm)
							.then(() => {
								this.loading = false
								this.$router.push({ path: this.redirect || '/' })
							})
							.catch((response) => {
								this.loading = false
							})
					}
				})
			} else if (this.activeName === 'third') {
				return false
			}
		},
		sendCode() {
			this.$refs.validationForm.validateField('phone', (errorMessage) => {
				if (errorMessage) {
					this.$message.error(errorMessage)
				} else {
					// 1.时间开始倒数
					// 2.按钮进入禁用状态
					// 3.如果倒计时结束 按钮恢复可用状态 按钮文字变为重新发送, 时间重置
					// 4.倒计时的过程中 按钮文字为 多少s后重新发送
					this.validationDisabled = true
					const timer = setInterval(() => {
						this.countDown--
						this.validationText = `${this.countDown}s后重新发送`
						if (this.countDown === 0) {
							this.validationDisabled = false
							this.validationText = '重新发送'
							this.countDown = 60
							clearInterval(timer)
						}
					}, 1000)
				}
			})
		}
	}
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  width: 100vw;
  position: relative;
  height: 100%;
  background-image: url('~@/assets/image/login-background2.jpg');
  background-size: 100vw 100vh;
  // background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  .introduce-container {
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    color: #ffffff;
  }

  .login-container {
    /* width: 26.0417vw;
    height: 20.8333vw; */
    position: absolute;
    right: 20%;
    top: 50%;
    transform: translateY(-50%);
    padding: 1.5625vw 3.125vw;
    background: #ffffffa8;
    border-radius: 0.7813vw;
    box-shadow: 0px 0px 15px 3px #ffffff;

    .login-header {
      color: #000000;

      .login-title {
        // width: 100%;
        height: 1.5em;
        text-align: justify;
      }

      .login-title:after {
        display: inline-block;
        width: 100%;
        content: '';
      }

      hr {
        margin: 0.2083vw 0;
        border-color: rgba(0, 0, 0, 0.85);
      }

      h4 {
        // width: 100%;
        height: 1.875vw;
        text-align: justify;
      }

      h4:after {
        display: inline-block;
        width: 100%;
        content: '';
      }
    }

    .login-card {
      position: relative;

      .el-tabs__nav-wrap::after {
        background-color: transparent;
      }

      .login-box {
        // width: 500px;
        height: 18.2292vw;
        padding: 1.3021vw 1.3021vw 5px 25px;
        border-radius: 0.3125vw;

        .login-content {
          .master-login-title {
            padding-top: 0.5208vw;
            font-weight: lighter;
            font-size: 1.0417vw;
            text-align: center;
            font-family: PingFangSC-Regular;
            color: #111;
          }

          .qrcode-login {
            .qrcode-img {
              width: 100%;
              height: 13.5417vw;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0;
            }

            .qrcode-desc {
              width: 100%;
              margin: 0 auto;

              p {
                text-align: center;
                font-size: 1.0417vw;
                color: #111;
                font-family: PingFangSC-Regular;
              }
            }
          }
        }
      }

      .login-tab-box {
        height: 16.25vw;
        padding: 1.5625vw 0.2604vw 0;

        .el-input {
          height: 1.9792vw;
          box-shadow: 0px 0px 0.5208vw 0px rgba(153, 153, 153, 0.8);

          input {
            height: 1.9792vw;
            padding-left: 2.6042vw;
          }

          .el-input__prefix {
            left: 0;
            width: 1.9792vw;
          }
        }

        .input-icon {
          color: white;
          height: 2.0313vw;
          width: 0.7292vw;
          margin-left: 0.1042vw;
        }

        .login-tip {
          font-size: 0.6771vw;
          text-align: center;
          color: #bfbfbf;
        }

        .login-code {
          width: 33%;
          height: 1.9792vw;
          float: right;

          img {
            cursor: pointer;
            vertical-align: middle;
          }
        }

        .el-button--primary {
          background-color: #fdb500;
          /* border-color: #073E8E; */
          border: none;
          box-shadow: 0px 0px 0.5208vw 0px rgba(153, 153, 153, 0.8);
        }

        .el-button--primary:active {
          background-color: #e6a503;
          color: #ffffff;
          outline: none;
        }
      }
    }
  }
  .el-input__inner {
    line-height: 1.4583vw !important;
  }
  .el-form-item {
    margin-bottom: 0.9375vw !important;
  }
  .el-form-item__content {
    line-height: 2.0833vw;
    position: relative;
    font-size: 0.7292vw;
  }
  .el-checkbox__label {
    display: inline-block;
    padding-left: 0.5208vw;
    line-height: 0.9896vw;
    font-size: 0.7292vw;
  }
  .el-checkbox__inner {
    font-size: 0.625vw;
    width: 0.7292vw;
    height: 0.7292vw;
  }
  .el-button--medium {
    font-size: 0.7292vw;
  }
  .el-input--mini {
    font-size: 0.625vw !important;
  }
}
</style>
