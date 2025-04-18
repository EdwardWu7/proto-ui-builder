
<template>
  <view v-if="showPopup" class="uni-popup" :class="[popupClass]" @touchmove.stop.prevent="clear">
    <view class="uni-popup__mask" :class="[maskClass]" @click="onMaskClick" />
    <view class="uni-popup__wrapper" :class="[wrapperClass]" :style="{ backgroundColor: bg }">
      <slot />
    </view>
  </view>
</template>

<script>
export default {
  name: 'UniPopup',
  props: {
    // 开启动画
    animation: {
      type: Boolean,
      default: true
    },
    // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
    type: {
      type: String,
      default: 'center'
    },
    // maskClick
    maskClick: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: 'none'
    }
  },
  data() {
    return {
      showPopup: false
    }
  },
  computed: {
    bg() {
      return this.backgroundColor
    },
    popupClass() {
      return [
        'uni-popup-' + this.type,
        this.animation ? 'uni-popup-animation' : ''
      ]
    },
    maskClass() {
      return this.animation ? 'mask-ani' : ''
    },
    wrapperClass() {
      return this.animation ? 'content-ani' : ''
    }
  },
  methods: {
    clear() {},
    open() {
      this.showPopup = true
    },
    close() {
      this.showPopup = false
    },
    onMaskClick() {
      if (!this.maskClick) return
      this.close()
    }
  }
}
</script>

<style>
.uni-popup {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.uni-popup__mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
}

.uni-popup__mask.mask-ani {
  transition: opacity 0.3s;
}

.uni-popup__wrapper {
  position: absolute;
  box-sizing: border-box;
  opacity: 0;
}

.uni-popup__wrapper.content-ani {
  transition: transform 0.3s, opacity 0.3s;
}

.uni-popup-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.uni-popup-center .uni-popup__wrapper {
  width: 80%;
  border-radius: 12rpx;
  background-color: #fff;
  transform: scale(0.8);
}

.uni-popup-center.uni-popup-animation .uni-popup__wrapper {
  opacity: 1;
  transform: scale(1);
}

.uni-popup-center.uni-popup-animation .uni-popup__mask {
  opacity: 1;
}

.uni-popup-top .uni-popup__wrapper {
  top: 0;
  width: 100%;
  transform: translateY(-100%);
}

.uni-popup-top.uni-popup-animation .uni-popup__wrapper {
  opacity: 1;
  transform: translateY(0);
}

.uni-popup-top.uni-popup-animation .uni-popup__mask {
  opacity: 1;
}

.uni-popup-bottom .uni-popup__wrapper {
  bottom: 0;
  width: 100%;
  transform: translateY(100%);
}

.uni-popup-bottom.uni-popup-animation .uni-popup__wrapper {
  opacity: 1;
  transform: translateY(0);
}

.uni-popup-bottom.uni-popup-animation .uni-popup__mask {
  opacity: 1;
}
</style>
