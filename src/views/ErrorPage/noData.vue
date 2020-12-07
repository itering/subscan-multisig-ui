<template>
  <div class="error-page-wrapper subscan-content">
    <div class="subscan-container">
      <div class="not-found">
        <img class="not-found-img" src="./../../assets/images/no-related-data.png" alt="404" />
        <div v-if="type==='block'">
          <div class="no-data">
            <i18n path="error.block_not_found" tag="div">{{ idx }}</i18n>
          </div>
          <div class="no-data">
            <i18n path="error.block_current" tag="div">
              <a class="link" :href="`/block/${metadata.blockNum}`">{{ metadata.blockNum }}</a>
            </i18n>
          </div>
        </div>
        <div v-else-if="type==='hash'" class="no-data">{{$t('error.hash_not_found', {hash: idx})}}</div>
        <div v-else-if="type==='event'">
          <div class="no-data">{{$t('error.event_not_found', {event: idx})}}</div>
          <div class="no-data">
            <i18n path="error.event_suggest" tag="div">
              <a class="link" :href="`/extrinsic/${idx}`">{{ idx }}</a>
            </i18n>
          </div>
        </div>
        <div v-else-if="type==='extrinsic'">
          <div class="no-data">{{$t('error.extrinsic_not_found', {extrinsic: idx})}}</div>
          <div class="no-data">
            <i18n path="error.extrinsic_suggest" tag="div">
              <span class="link" @click="eventRedirect(idx)">{{ idx }}</span>
            </i18n>
          </div>
        </div>
        <div v-else-if="type==='account'">
          <div class="no-data">{{$t('error.account_not_found', {extrinsic: idx})}}</div>
          <div v-if="accountState === 0" class="no-data">
            <i18n path="error.account_inactive" tag="div">
            </i18n>
          </div>
          <div v-else-if="accountState === 1" class="no-data">
            <i18n path="error.account_other_network" tag="div">
              <a class="link" :href="`/account/${curAddress}`">{{ sourceSelected }}</a>
              <a class="link" :href="getHref(`/account/${idx}`)" target="_blank">{{ network }}</a>
            </i18n>
          </div>
          <div v-else-if="accountState === 2" class="no-data">
            <i18n path="error.account_unknown_network" tag="div">
              <a class="link" :href="`/account/${curAddress}`">{{ sourceSelected }}</a>
            </i18n>
          </div>
          <div v-else-if="accountState === 3" class="no-data">
            <i18n path="error.account_invalid" tag="div">
            </i18n>
          </div>
        </div>
        <div v-else class="no-data">{{$t('no_related_data')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
import _ from "lodash";
export default {
  data() {
    return {
      type: "",
      idx: "",
      curAddress: "",
      network: "",
      accountState: 0
    };
  },
  computed: {
    ...mapState({
      metadata: state => state.polka.metadata,
      sourceSelected: state => state.global.sourceSelected
    })
  },
  created() {
    if (this.$route.query.block) {
      this.type = "block";
      this.idx = this.$route.query.block;
    } else if (this.$route.query.hash) {
      this.type = "hash";
      this.idx = this.$route.query.hash;
    } else if (this.$route.query.extrinsic) {
      this.type = "extrinsic";
      this.idx = this.$route.query.extrinsic;
    } else if (this.$route.query.event) {
      this.type = "event";
      this.idx = this.$route.query.event;
    } else if (this.$route.query.account) {
      this.type = "account";
      this.idx = this.$route.query.account;
      this.detectAddress();
    }
  },
  methods: {
    eventRedirect(idx) {
      this.$api["polkaGetEventByKey"]({
        event_index: idx
      })
        .then(res => {
          if (res.extrinsic_hash) {
            this.$router.push(
              `/extrinsic/${res.extrinsic_hash}?event=${res.block_num}-${res.event_idx}`
            );
          } else {
            this.$router.push(
              `/extrinsic/${res.event_index}?event=${res.block_num}-${res.event_idx}`
            );
          }
        })
        .catch(() => {
          this.$router.push(`/noData?event=${idx}`);
          this.type = "event";
        });
    },
    detectAddress() {
      let public_key = "";
      try {
        public_key = u8aToHex(decodeAddress(this.idx));
      } catch (err) {
        this.accountState = 3;
        console.log(err);
      }
      if (public_key.length !== 66) {
        this.accountState = 3;
        return;
      }
      let networkList = this.$const['COMMON/networkList']['ss58Format']['value'];
      _.forEach(networkList, (val, key) => {
        let value = encodeAddress(public_key, val.prefix);
        if (key === this.sourceSelected) {
          this.curAddress = value;
        }
      })
      _.forEach(networkList, (val, key) => {
        let value = encodeAddress(public_key, val.prefix);
        if (value === this.idx) {
          if (this.sourceSelected === key) {
            this.accountState = 0;
            this.network = this.sourceSelected;
          } else if (val.hasLink) {
            this.accountState = 1;
            this.network = key;
          } else {
            this.accountState = 2;
          }
          return false;
        }
      })
    },
    getHref(path) {
      return  this.$const[`SYMBOL/${this.network}`]["domain"]["value"] + path;
    }
  }
};
</script>
<style lang="scss" scoped>
.error-page-wrapper {
  flex: 1 1 auto;
  .search-input {
    height: 50px;
  }
  .not-found {
    padding: 10%;
    text-align: center;
    .not-found-img {
    }
    .no-data {
      font-size: 14px;
      font-weight: 600;
      color: rgba(152, 149, 159, 1);
    }
    .link {
      cursor: pointer;
      color: var(--link-color);
    }
  }
}
</style>
