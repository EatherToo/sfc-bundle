<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Tweet from 'vue-tweet'
const ContactIcons: {
  [key: string]: string
} = {
  facebook: 'logos:facebook',
  instagram: 'skill-icons:instagram',
  tiktok: 'logos:tiktok-icon',
  twitter: 'devicon:twitter',
  whatsapp: 'logos:whatsapp-icon',
  youtube: 'logos:youtube-icon',
  telegram: 'logos:telegram',
  messenger: 'logos:messenger',
}

const shopInfo: any = {
  name: 'test',
  description: 'test',
  contacts: [
    {
      type: 'facebook',
      url: 'test',
    },
  ],
  benefits: ['test'],
  goods: [
    {
      id: 1,
      name: 'test',
      img: 'test',
      price: 100,
    },
  ],
  img: '',
  show_home_goods_ids: '',
  posts: [
    {
      type: 'twitter',
      url: 'https://x.com/aestheticspost_/status/1797368981688340786',
    },
  ],
}
</script>
<template>
  <div class="home-page hide-scroll-bar">
    <p class="shop-name">{{ shopInfo?.name || 'input your shop name' }}</p>
    <div class="shop-img-box"></div>
    <p class="shop-desc">
      {{
        shopInfo?.description ||
        'input your shop description, tell your customers what you are selling and what makes you special.'
      }}
    </p>
    <div class="social-icons-box">
      <Icon
        v-for="contact in shopInfo?.contacts"
        :key="contact.type"
        :icon="ContactIcons[contact.type]"
      />
    </div>
    <div class="wahtsapp-button-box">
      <button class="wahtsapp-button">whatsapp me</button>
    </div>
    <div class="benefit-box">
      <p class="benefit-title">Benefits</p>
      <ul class="benefit-ul">
        <li v-for="benefit in shopInfo?.benefits || []" :key="benefit">
          <div>
            <span>{{ benefit }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="join-button-box">
      <button class="join-button">Join the club</button>
    </div>
    <div class="goods-list">
      <div
        v-for="good in shopInfo?.goods || []"
        :key="good.id"
        class="goods-item"
      >
        <div class="goods-img">
          <img :src="good.img" alt="goods" />
        </div>
        <div class="goods-attr">
          <p>{{ good.name }}</p>
          <p style="font-size: 16px">THB {{ good.price }}</p>
        </div>
      </div>
      <div class="all-products-button-box">
        <button class="all-products-button">All Products</button>
      </div>
    </div>
    <div class="shop-post">
      <Tweet
        v-for="post in shopInfo?.posts || []"
        conversation="none"
        :tweet-url="post.url"
        :key="post.url"
      />
    </div>
  </div>
</template>
<style scoped>
#app-box {
  background: radial-gradient(
    108.21% 117.18% at 102.79% 94.58%,
    #ffb8e0,
    #be9eff 38.89%,
    #88c0fc 67.4%,
    #86ff99
  );
}
.home-page {
  width: 390px;
  overflow: auto;
  font-family: Gopher Display;
  overflow-y: overlay;
}

.shop-name {
  font-family: Gopher Display;
  font-size: 28px;
  font-weight: 700;
  text-align: left;
  text-align: center;
  margin-top: 45px;
}

.shop-img-box {
  width: 200px;
  height: 200px;
  margin: 14px auto 0;
  border: 1px solid transparent;
  border-radius: 20px;
  background-image: linear-gradient(#fee, #fee),
    linear-gradient(135.87deg, #0feffd 1.25%, #ff00f5 51.73%);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

.shop-img-box img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.shop-desc {
  font-family: Gopher Display;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  width: 300px;
  margin: 25px auto auto;
}

.social-icons-box {
  display: flex;
  font-size: 20px;
  margin: 20px auto auto;
  justify-content: center;
}

.social-icons-box svg {
  margin: 0 3px;
}

.wahtsapp-button-box {
  text-align: center;
}

.wahtsapp-button {
  margin-top: 10px;
  font-size: 16px;
  font-family: Gopher Display;
  color: #fff;
  width: 300px;
  height: 40px;
  border: none;
  border-radius: 46px;
  background: linear-gradient(106.24deg, #00416a -0.58%, #e4e5e6 119.49%);
}

.benefit-box {
  margin-top: 20px;
  padding-left: 35px;
  margin-bottom: 20px;
}

.benefit-title {
  font-size: 18px;
  font-weight: 700;
}

.benefit-ul {
  list-style-type: disc;
  padding-left: 30px;
}
.join-button-box {
  text-align: center;
}

.join-button {
  margin-top: 10px;
  font-size: 16px;
  font-family: Gopher Display;
  color: #fff;
  width: 300px;
  height: 40px;
  border: none;
  border-radius: 46px;
  background: linear-gradient(
    225.4deg,
    #ffcba0 0%,
    #dd5789 48.12%,
    #9b5be6 93.59%
  );
}

.goods-list {
  display: flex;
  justify-content: space-between;
  padding: 10px 30px;
  flex-wrap: wrap;
}
.goods-item {
  width: 150px;
  height: 93px;
  position: relative;
  margin-bottom: 10px;
}
.goods-img img {
  width: 160px;
  height: 93px;
}
.goods-attr {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  width: 100%;
  font-size: 24px;
  font-weight: 900;
  color: #fff;
  -webkit-text-stroke: 1px #00416a;
}

.all-products-button-box {
  text-align: center;
  width: 100%;
}

.all-products-button {
  margin-top: 10px;
  font-size: 16px;
  font-family: Gopher Display;
  color: #fff;
  width: 300px;
  height: 40px;
  border: none;
  border-radius: 46px;
  background: radial-gradient(50% 50% at 50% 50%, #000046 0%, #004c61 100%);
}
.shop-post {
  padding: 20px;
}
.shop-name {
  font-family: Gopher Display;
  font-size: 28px;
  font-weight: 700;
  text-align: left;
  text-align: center;
  margin-top: 45px;
}
.shop-img-box {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  margin-top: 14px;
  border: 1px solid transparent;
  border-radius: 20px;
  background-image: linear-gradient(#fee, #fee),
    linear-gradient(135.87deg, #0feffd 1.25%, #ff00f5 51.73%);

  background-origin: border-box;
  background-clip: content-box, border-box;
}

.shop-img-box img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}
.shop-desc {
  font-family: Gopher Display;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  width: 300px;
  margin: auto;
  margin-top: 25px;
}
.social-icons-box {
  font-size: 20px;
  margin: auto;
  margin-top: 20px;
  text-align: center;
}
.social-icons-box svg {
  margin: 0 3px;
}
.wahtsapp-button-box {
  text-align: center;
}
.wahtsapp-button {
  margin-top: 10px;
  font-size: 16px;
  font-family: Gopher Display;
  color: #ffffff;
  width: 300px;
  height: 40px;
  border: none;
  border-radius: 46px;
  background: linear-gradient(106.24deg, #00416a -0.58%, #e4e5e6 119.49%);
}
.benefit-box {
  margin-top: 20px;
  padding-left: 35px;
  margin-bottom: 20px;
}

.benefit-title {
  font-size: 18px;
  font-weight: 700;
}
.benefit-ul {
  list-style-type: disc;
  padding-left: 30px;
}
</style>
