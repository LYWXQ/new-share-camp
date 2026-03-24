<template>
  <view class="container">
    <form class="publish-form">
      <view class="form-item">
        <text class="label required">物品标题</text>
        <input
          class="input"
          type="text"
          placeholder="请输入物品标题"
          v-model="form.title"
        />
      </view>

      <view class="form-item">
        <text class="label required">物品分类</text>
        <picker
          class="picker"
          :range="categories"
          :value="form.categoryIndex"
          @change="handleCategoryChange"
        >
          <view class="picker-text">{{
            categories[form.categoryIndex] || "请选择分类"
          }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">物品描述</text>
        <textarea
          class="textarea"
          placeholder="请详细描述物品的成色、使用方法等信息"
          v-model="form.description"
        ></textarea>
      </view>

      <view class="form-item">
        <text class="label required">租金 (元/天)</text>
        <input
          class="input"
          type="number"
          placeholder="请输入租金"
          v-model="form.price"
        />
      </view>

      <view class="form-item">
        <text class="label required">押金 (元)</text>
        <input
          class="input"
          type="number"
          placeholder="请输入押金"
          v-model="form.deposit"
        />
      </view>

      <view class="form-item">
        <text class="label">可租时间</text>
        <view class="time-picker-row">
          <picker
            class="time-picker"
            mode="date"
            :value="form.availableTime.start"
            @change="handleStartDateChange"
          >
            <view class="picker-text">{{
              form.availableTime.start || "开始日期"
            }}</view>
          </picker>
          <text class="time-separator">至</text>
          <picker
            class="time-picker"
            mode="date"
            :value="form.availableTime.end"
            @change="handleEndDateChange"
          >
            <view class="picker-text">{{
              form.availableTime.end || "结束日期"
            }}</view>
          </picker>
        </view>
      </view>

      <view class="form-item">
        <text class="label">位置</text>
        <input
          class="input"
          type="text"
          placeholder="请输入物品所在位置"
          v-model="form.location"
        />
      </view>

      <view class="form-item">
        <text class="label">物品图片</text>
        <view class="image-upload-area">
          <view class="image-list">
            <view
              v-for="(image, index) in form.images"
              :key="index"
              class="image-item"
            >
              <image
                class="uploaded-image"
                :src="image"
                mode="aspectFill"
              ></image>
              <view class="delete-btn" @click="removeImage(index)">
                <text class="delete-icon">×</text>
              </view>
            </view>
            <view
              v-if="form.images.length < 6"
              class="upload-btn"
              @click="chooseImage"
            >
              <text class="upload-plus">+</text>
              <text class="upload-hint">{{ form.images.length }}/6</text>
            </view>
          </view>
        </view>
      </view>

      <button
        class="submit-button"
        :disabled="isSubmitting"
        @click="submitForm"
      >
        {{ isSubmitting ? (isEditMode ? "保存中..." : "发布中...") : (isEditMode ? "保存修改" : "发布物品") }}
      </button>
    </form>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createItem, updateItem, getItemDetail, type CreateItemParams, type Item } from "@/api/items";
import { upload } from "@/utils/request";

const itemId = ref<number | null>(null)
const isEditMode = ref(false)

const form = ref({
  title: "",
  categoryIndex: 0,
  description: "",
  price: "",
  deposit: "",
  availableTime: {
    start: "",
    end: "",
  },
  location: "",
  images: [] as string[],
});

const isSubmitting = ref(false);
const categories = ["图书", "电子产品", "运动器材", "生活用品", "服装", "其他"];

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options as any
  if (options.id) {
    itemId.value = parseInt(options.id)
    isEditMode.value = true
    loadItemDetail()
  }
})

const loadItemDetail = async () => {
  try {
    uni.showLoading({ title: '加载中...' })
    const { item } = await getItemDetail(itemId.value!)
    form.value.title = item.title
    form.value.description = item.description || ''
    form.value.categoryIndex = categories.indexOf(item.category)
    if (form.value.categoryIndex === -1) form.value.categoryIndex = 0
    form.value.price = item.price.toString()
    form.value.deposit = item.deposit.toString()
    form.value.location = item.location || ''
    form.value.images = item.images || []
    if (item.availableTime) {
      form.value.availableTime.start = item.availableTime.start || ''
      form.value.availableTime.end = item.availableTime.end || ''
    }
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

const handleCategoryChange = (e: any) => {
  form.value.categoryIndex = e.detail.value;
};

const handleStartDateChange = (e: any) => {
  form.value.availableTime.start = e.detail.value;
};

const handleEndDateChange = (e: any) => {
  form.value.availableTime.end = e.detail.value;
};

const chooseImage = () => {
  const remainCount = 6 - form.value.images.length;
  uni.chooseImage({
    count: remainCount,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths as string[];
      uploadImages(tempFilePaths);
    },
  });
};

const uploadImages = async (filePaths: string[]) => {
  uni.showLoading({ title: "上传中..." });

  try {
    for (const filePath of filePaths) {
      const result = await upload("/upload", filePath);
      if (result && typeof result === "object" && "url" in result) {
        form.value.images.push((result as { url: string }).url);
      } else if (typeof result === "string") {
        form.value.images.push(result);
      }
    }
  } catch (error) {
    console.error("上传图片失败:", error);
    uni.showToast({
      title: "图片上传失败",
      icon: "none",
    });
  } finally {
    uni.hideLoading();
  }
};

const removeImage = (index: number) => {
  form.value.images.splice(index, 1);
};

const validateForm = (): boolean => {
  if (!form.value.title.trim()) {
    uni.showToast({
      title: "请输入物品标题",
      icon: "none",
    });
    return false;
  }

  if (!form.value.price || parseFloat(form.value.price) <= 0) {
    uni.showToast({
      title: "请输入有效的租金",
      icon: "none",
    });
    return false;
  }

  if (!form.value.deposit || parseFloat(form.value.deposit) < 0) {
    uni.showToast({
      title: "请输入有效的押金",
      icon: "none",
    });
    return false;
  }

  return true;
};

const submitForm = async () => {
  if (isSubmitting.value) return;

  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  uni.showLoading({ title: isEditMode.value ? "保存中..." : "发布中..." });

  try {
    const params: CreateItemParams = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      category: categories[form.value.categoryIndex],
      images: form.value.images,
      price: parseFloat(form.value.price),
      deposit: parseFloat(form.value.deposit),
      location: form.value.location.trim() || undefined,
    };

    if (form.value.availableTime.start || form.value.availableTime.end) {
      params.availableTime = {
        start: form.value.availableTime.start || undefined,
        end: form.value.availableTime.end || undefined,
      };
    }

    if (isEditMode.value && itemId.value) {
      await updateItem(itemId.value, params, { showLoading: false });
      uni.hideLoading();
      uni.showToast({
        title: "保存成功",
        icon: "success",
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    } else {
      await createItem(params, { showLoading: false });
      uni.hideLoading();
      uni.showToast({
        title: "发布成功",
        icon: "success",
      });
      setTimeout(() => {
        form.value = {
          title: "",
          categoryIndex: 0,
          description: "",
          price: "",
          deposit: "",
          availableTime: {
            start: "",
            end: "",
          },
          location: "",
          images: [] as string[],
        };
      }, 1500);
    }
  } catch (error) {
    console.error(isEditMode.value ? "保存失败:" : "发布失败:", error);
    uni.hideLoading();
    uni.showToast({
      title: isEditMode.value ? "保存失败，请重试" : "发布失败，请重试",
      icon: "none",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.container {
  padding: 16rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.publish-form {
  border-radius: 12rpx;
  padding: 24rpx;
}

.form-item {
  margin-bottom: 24rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
  color: #333333;
}

.label.required::after {
  content: "*";
  color: #ff4d4f;
  margin-left: 8rpx;
}

.input {
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  font-size: 28rpx;
  width: 100%;
  height: 88rpx;
  box-sizing: border-box;
  line-height: 56rpx;
}

.textarea {
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 16rpx;
  font-size: 24rpx;
  width: 100%;
  box-sizing: border-box;
  height: 200rpx;
  resize: none;
}

.picker {
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 16rpx;
  font-size: 24rpx;
  width: 100%;
  box-sizing: border-box;
}

.picker-text {
  color: #333333;
}

.time-picker-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.time-picker {
  flex: 1;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 16rpx;
  font-size: 24rpx;
}

.time-separator {
  font-size: 24rpx;
  color: #666666;
}

.image-upload-area {
  width: 100%;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
}

.uploaded-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  background-color: #f5f5f5;
}

.delete-btn {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #ff4d4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  color: #ffffff;
  font-size: 28rpx;
  line-height: 1;
}

.upload-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #cccccc;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}

.upload-plus {
  font-size: 60rpx;
  color: #999999;
  line-height: 1;
}

.upload-hint {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
}

.submit-button {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #007aff;
  color: #ffffff;
  font-size: 28rpx;
  margin-top: 32rpx;
}

.submit-button[disabled] {
  background-color: #cccccc;
}
</style>
