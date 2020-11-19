export default [{
  name: 'RECHARGE_STATE',
  value: {
    accepted: {
      value: "充值成功",
      color: "#32d141 "
    },
    rejected: {
      value: "已驳回",
      color: "#df403f "
    },
    canceled: {
      value: "已撤销",
      color: "#df403f "
    },
    submitted: {
      value: "受理中",
      color: "#999 "
    },
    submitting: {
      value: "已提交",
      color: "#999 "
    }
  }
}, {
  name: 'WITHDRAW_STATE',
  value: {
    accepted: {
        value: "处理中",
        color: "#999"
    },
    done: {
        value: "已完成",
        color: "#32d141"
    },
    canceled: {
        value: "已撤销",
        color: "#df403f"
    },
    almost_done: {
        value: "发送中",
        color: "#999"
    },
    submitted: {
        value: "处理中",
        color: "#999"
    },
    submitting: {
        value: "处理中",
        color: "#999"
    },
    processing: {
        value: "处理中",
        color: "#999"
    },
    failed: {
        value: "提现出错",
        color: "#df403f"
    },
    rejected: {
        value: "已驳回",
        color: "#df403f"
    }
}
}]
