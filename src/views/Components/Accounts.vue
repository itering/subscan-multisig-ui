<template>
  <el-table :data="accounts" border :show-header="false" style="width: 100%">
    <el-table-column prop="name" width="160">
      <template slot-scope="props">
        <div>{{ props.row.name }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="address">
      <template slot-scope="props">
        <address-display
          customCls="address-display-cls"
          :iconSize="30"
          :hasCopyBtn="false"
          :hasDisplayName="false"
          :address="props.row.address"
        ></address-display>
      </template>
    </el-table-column>
    <el-table-column prop="type" width="200">
      <template slot-scope="props">
        <div>
          {{ props.row.isInjected ? $t("injected") : $t("external") }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import AddressDisplay from "@/views/Components/AddressDisplay";

export default {
  components: {
    AddressDisplay
  },
  
  data() {
    return {};
  },

  props: {
    accounts: {
      type: [],
      default: []
    }
  }
};
</script>
