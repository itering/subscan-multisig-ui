<template>
  <div
    class="address-display"
    :class="`${isVertical? 'is-vertical': ''} ${displayName ? 'has-displayname': ''} ${customCls}`"
  >
    <div v-if="hasIdenticon && !isAccountIndex" class="icon identicon">
      <identicon :size="iconSize" theme="polkadot" :value="address" />
    </div>
    <div class="info-wrapper">
      <div class="name-wrapper" v-if="hasDisplayName && displayName">
        <div v-if="judgements && identity" class="judgement" :class="isGoodJudgement ? 'good' :'unknown'">
          <Tooltip customCls="item" effect="light" :content="judgementContent" placement="top">
            <div v-if="isGoodJudgement">V</div>
            <div v-else>—</div>
          </Tooltip>
        </div>
        <Tooltip customCls="item" effect="light" :content="address" placement="top-start">
          <div v-if="displayName" class="nick-name">
            <router-link v-if="isWaiting" :to="`/waiting/${address}`">
              <span v-if="hasHashFormat">{{displayName | hashFormat}}</span>
              <span v-else>{{displayName}}</span>
            </router-link>
            <router-link v-else-if="isValidate" :to="`/validator/${address}`">
              <span v-if="hasHashFormat">{{displayName | hashFormat}}</span>
              <span v-else>{{displayName}}</span>
            </router-link>
            <router-link v-else :to="`/account/${address}`">
              <span v-if="hasHashFormat">{{displayName | hashFormat}}</span>
              <span v-else>{{displayName}}</span>
            </router-link>
          </div>
        </Tooltip>
        <!-- <div v-if="displayName" class="nick-name">{{displayName}}</div> -->
      </div>
      <div
        class="name-wrapper"
        v-else-if="hasDisplayName && !(hasAddressWrapper && hasAddressInAddressWrapper)"
      >
        <Tooltip
          :disabled="!isTruncate"
          customCls="item"
          effect="light"
          :content="address"
          placement="top-start"
        >
          <div class="name-wrapper-address">
            <router-link v-if="isWaiting" :to="`/waiting/${address}`">
              <span v-if="hasHashFormat">{{address | hashFormat}}</span>
              <span v-else>{{address}}</span>
            </router-link>
            <router-link v-else-if="isValidate" :to="`/validator/${address}`">
              <span v-if="hasHashFormat">{{address | hashFormat}}</span>
              <span v-else>{{address}}</span>
            </router-link>
            <router-link v-else :to="`/account/${address}`">
              <span v-if="hasHashFormat">{{address | hashFormat}}</span>
              <span v-else>{{address}}</span>
            </router-link>
          </div>
        </Tooltip>
      </div>
      <div class="address-wrapper" v-if="hasAddressWrapper">
        <div v-if="hasAddressInAddressWrapper" class="address-wrapper-address">
          <router-link v-if="isWaiting" :to="`/waiting/${address}`">
            <span v-if="hasHashFormat">{{address | hashFormat}}</span>
            <span v-else>{{address}}</span>
          </router-link>
          <router-link v-else-if="isValidate" :to="`/validator/${address}`">
            <span v-if="hasHashFormat">{{address | hashFormat}}</span>
            <span v-else>{{address}}</span>
          </router-link>
          <router-link v-else :to="`/account/${address}`">
            <span v-if="hasHashFormat && hasBracket">{{'('}}{{address | hashFormat}}{{')'}}</span>
            <span v-else-if="hasHashFormat">{{address | hashFormat}}</span>
            <span v-else>{{address}}</span>
          </router-link>
        </div>
        <div
          class="copy-btn copy-icon"
          :style="{ fontSize: copyBtnSize + 'px' }"
          v-if="address && hasCopyBtn"
          v-clipboard:copy="address"
          v-clipboard:success="clipboardSuccess"
        >
          <icon-svg class="iconfont" icon-class="copy" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Identicon from "@polkadot/vue-identicon";
import clipboard from "Directives/clipboard";
import { hashFormat } from "Utils/filters";
import Tooltip from "@/views/Components/Tooltip";
import _ from "lodash";
export default {
  name: "address-display",
  components: {
    Identicon,
    Tooltip,
  },
  props: {
    address: {
      type: String,
      default: "",
    },
    customCls: {
      type: String,
      default: "",
    },
    isValidate: {
      type: Boolean,
      default: false,
    },
    isWaiting: {
      type: Boolean,
      default: false,
    },
    hasAddressWrapper: {
      type: Boolean,
      default: true,
    },
    hasBracket: {
      type: Boolean,
      default: false,
    },
    hasAddressInAddressWrapper: {
      type: Boolean,
      default: true,
    },
    hasCopyBtn: {
      type: Boolean,
      default: true,
    },
    hasDisplayName: {
      type: Boolean,
      default: true,
    },
    hasDisplayNameInfo: {
      type: Boolean,
      default: false,
    },
    displayNameInfo: {
      type: Object,
      default: null,
    },
    hasHashFormat: {
      type: Boolean,
      default: false,
    },
    isTruncate: {
      type: Boolean,
      default: false,
    },
    isVertical: {
      type: Boolean,
      default: false,
    },
    hasIdenticon: {
      type: Boolean,
      default: true,
    },
    iconSize: {
      type: Number,
      default: 24,
    },
    copyBtnSize: {
      type: Number,
      default: 10,
    },
  },
  directives: {
    clipboard,
  },
  watch: {
    address() {
      this.init();
    },
    displayNameInfo() {
      this.init();
    },
  },
  filters: {
    hashFormat,
  },
  data() {
    return {
      accountInfo: {},
      judgements: [],
      identity: false,
      isAccountIndex: false,
      displayName: "",
      hasFoundDisplayName: false,
    };
  },
  computed: {
    judgementContent() {
      let result = '';
      let judgementText = [];
      if (this.judgements && this.judgements.length > 0) {
        _.forEach(this.judgements, (item)=> {
            let text = item && item.toLowerCase();
            text.replace(' ', '');
            judgementText.push(this.$t(text));
        })
        result = judgementText.join(', ');
      } else {
        result = this.$t('nojudgement');
      }
      return this.$t('identityLevel') + result;
    },
    isGoodJudgement() {
      let result = false;
      _.forEach(this.judgements, (item) => {
        if (
          this.$const["COMMON/typeList"]["good_judgements"].value.indexOf(
            item.toLowerCase()
          ) > -1
        ) {
          result = true;
          return false;
        }
      });
      return result;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.hasDisplayName) {
        if (this.displayNameInfo) {
          this.initDisplay();
        } else {
          if (!this.hasDisplayNameInfo) {
            this.getDisplayName();
          }
        }
      } else {
        if (this.address && this.address.length < 12) {
          this.isAccountIndex = true;
        }
      }
    },
    initDisplay() {
      let dn = this.displayNameInfo;
      this.judgements = [];
      this.displayName = dn.display || dn.account_index;
      this.identity = dn.identity;
      if (dn && dn.display) {
        this.hasFoundDisplayName = true;
        _.forEach(dn.judgements, (item) => {
          this.judgements.push(item.judgement);
        });
      }
    },
    getDisplayName() {
      let key = this.address;
      if (!key) {
        return;
      }
      this.$api["polkaGetSearchRes"]({ key, row: 1, page: 0 })
        .then(async (res) => {
          if (res === undefined || typeof res.account !== "object") {
            return Promise.reject();
          }
          this.accountInfo = res;
          let accountDisplay =
            (this.accountInfo.account &&
              this.accountInfo.account.account_display) ||
            {};
          this.identity = accountDisplay.identity;
          this.displayName = accountDisplay.display || accountDisplay.account_index;
          this.judgements = [];
          if (accountDisplay.judgements) {
            _.forEach(res.account.judgements, (item) => {
              this.judgements.push(item.judgement);
            });
          }
          this.hasFoundDisplayName = true;
          // this.isIntroLoading = false;
        })
        .catch(() => {
          this.hasFoundDisplayName = false;
          this.displayName = "";
          this.identity = false;
          this.accountInfo = {};
          this.judgements = [];
          // this.isLoading = false;
          // this.isIntroLoading = false;
        });
    },
    clipboardSuccess() {
      this.$message({
        type: "success",
        message: this.$t("copy_success"),
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.address-display {
  display: flex;
  align-items: center;
  .icon {
    line-height: initial;
    margin-right: 10px;
    vertical-align: -0.3em;
  }
  a {
    word-break: break-all;
    color: var(--link-color);
  }
  .copy-btn {
    margin-left: 10px;
    flex: 0 0 20px;
    cursor: pointer;
  }
  .info-wrapper {
    display: flex;
  }
  .address-wrapper {
    display: flex;
    align-items: center;
  }
  .name-wrapper {
    display: flex;
    color: var(--black-color);
    align-items: center;
    .nick-name {
      margin-right: 5px;
      line-height: initial;
    }
    .judgement {
      cursor: pointer;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      text-align: center;
      margin: 0 5px 0 0;
      &.good {
        background-color: var(--main-color);
        color: #f8f9fa;
        line-height: 16px;
        border-radius: 50%;
      }
      &.unknown {
        line-height: 15px;
        background-color: #98959f;
        color: #f8f9fa;
      }
    }
  }
  &.is-vertical {
    &.has-displayname {
      .info-wrapper {
        flex-direction: column;
        line-height: initial;
        .name-wrapper {
          margin-bottom: 2px;
          .nick-name {
            a {
              color: initial;
            }
          }
        }
        .address-wrapper {
          .copy-btn {
            // font-size: 14px !important;
          }
        }
      }
    }
  }
}
</style>
