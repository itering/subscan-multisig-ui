<template>
  <div class="dashboard-wrapper subscan-content">
    <div class="subscan-container subscan-card-title">
      {{ $t("wallet.deploy") }}
    </div>
    <div class="subscan-container subscan-card">
      <div class="create-section">
        <el-form
          label-width="80px"
          :model="form"
          ref="form"
          :rules="formRules"
          label-position="top"
        >
          <el-form-item :label="$t('name')">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="threshold" :label="$t('threshold')">
            <el-input @input="handleThresholdInputChange" v-model="form.threshold"></el-input>
          </el-form-item>
          <el-form-item :label="$t('members')">
            <div class="column-header">
              <div class="column column-1">{{ $t("id") }}</div>
              <div class="column column-2">{{ $t("name") }}</div>
              <div class="column column-3">{{ $t("address") }}</div>
              <div class="column column-4"></div>
            </div>
          </el-form-item>
          <el-form-item
            v-for="(account, index) in form.dynamicAccounts"
            :key="account.key"
          >
            <div class="column-body">
              <div class="index column column-1">{{ index }}</div>
              <el-input
                class="column column-2"
                v-model="account.name"
              ></el-input>
              <el-input
                class="column column-3"
                v-model="account.address"
              ></el-input>
              <div class="column column-4" @click="removeAccountRow(account)">
                <icon-svg icon-class="delete" class="icon" />
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="btns">
              <div class="button add-btn" @click="addAccountRow">
                {{ $t("add_members") }}
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="btns">
              <div class="button black" @click="onSubmit">
                {{ $t("create") }}
              </div>
              <router-link to="/" tag="div" class="button">
                {{ $t("cancel") }}
              </router-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import const_symbol from "Service/const/symbol";
import { mapState } from "vuex";
import { isMobile } from "Utils/tools";
import keyring from "@polkadot/ui-keyring";
import _ from "lodash";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      const_symbol: const_symbol,
      currentTime: Date.now(),
      drawer: false,
      network: "polkadot",
      tokens: {},
      metadata: {},
      sourceList: this.$const["COMMON/networkList"]["all"].value,
      form: {
        name: "",
        threshold: "",
        dynamicAccounts: [
          {
            address: "",
            name: "",
            key: 1,
          },
          {
            address: "",
            name: "",
            key: 2,
          },
        ],
      },
      formRules: {
        threshold: [
          {
            trigger: "submit",
            validator: (rule, value, callback) => {
              if (
                value &&
                value > 1 &&
                value <= this.form.dynamicAccounts.length
              ) {
                callback();
              } else {
                callback(new Error(this.$t("error.threshold")));
              }
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      sourceSelected: (state) => state.global.sourceSelected,
      language: (state) => state.global.language,
    }),
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.initApi();
    },
    initApi() {
      this.genesisHash = this.$polkaApi.genesisHash.toHex();
    },
    isMobile() {
      return isMobile();
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid && this.checkDuplicateMembers()) {
          this.addMultiAccount();
        }
      });
    },
    checkDuplicateMembers() {
      let result = true;
      let addressList = _.map(this.form.dynamicAccounts, "address");
      if (addressList.length !== _.uniq(addressList).length) {
        result = false;
        this.$message({
          type: "error",
          message: this.$t("error.member"),
        })
      }
      return result;
    },
    addMultiAccount() {
      let signatories = [];
      _.forEach(this.form.dynamicAccounts, (account) => {
        signatories.push(account.address);
      });
      try {
        keyring.addMultisig(signatories, this.form.threshold, {
          name: this.form.name,
          genesisHash: this.genesisHash,
          addressPair: this.form.dynamicAccounts,
        });
        // const { address } = result.pair;
        this.$message({
          type: "success",
          message: this.$t("success"),
        });
        this.$router.push("/");
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },
    handleThresholdInputChange(value) {
      this.form.threshold = value.replace(/[^\d]/g, '');
    },
    removeAccountRow(item) {
      var index = this.form.dynamicAccounts.indexOf(item);
      if (index !== -1) {
        this.form.dynamicAccounts.splice(index, 1);
      }
    },
    addAccountRow() {
      this.form.dynamicAccounts.push({
        address: "",
        name: "",
        key: Date.now(),
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  .subscan-card {
    position: relative;
    min-height: 500px;
    .create-section {
      padding: 30px;
      .column-header {
        background-color: #f3f5f9;
        display: flex;
        .column {
          font-weight: 600;
        }
      }
      .column-body {
        display: flex;
        align-items: center;
      }
      .column {
        padding-left: 10px;
      }
      .column-1 {
        flex: 1;
      }
      .column-2 {
        flex: 2;
      }
      .column-3 {
        padding-left: 20px;
        flex: 4;
      }
      .column-4 {
        cursor: pointer;
        padding-left: 0;
        margin-left: 20px;
        flex: 0 0 30px;
        font-size: 20px;
        color: var(--main-color);
      }
      /deep/ .el-form {
        .el-form-item {
          margin-bottom: 25px;
          .el-form-item__label {
            padding-bottom: 5px;
            font-size: 14px;
            line-height: 20px;
            font-weight: 600;
            color: var(--black-color);
          }
          .el-input {
            input {
              box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.05);
            }
          }
        }
      }
      .btns {
        .button {
          font-size: 14px;
          cursor: pointer;
          display: inline-block;
          margin-top: 10px;
          padding: 10px 80px;
          border: 1px solid var(--black-color);
          border-radius: 2px;
          line-height: 20px;
          & + .button {
            margin-left: 30px;
          }
          &.add-btn {
            width: 100%;
            text-align: center;
            border: 1px solid var(--main-color);
            color: var(--main-color);
          }
        }
        .black {
          background: var(--black-color);
          color: #fff;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.main {
  display: flex;
}
</style>
