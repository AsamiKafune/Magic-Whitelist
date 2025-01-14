<script setup>
const { $swal } = useNuxtApp()
import { QrcodeCapture } from 'vue3-qrcode-reader';
import VueRecaptcha from 'vue3-recaptcha2';
const config = useRuntimeConfig()
const _accept = ref(false)
const name = ref(null)
const key = config.public.googlerecapcha
const loadingTimeout = 240000;
const recapchares = ref(null)
const recaptchaVerified = (response) => recapchares.value = response;
const recaptchaExpired = () => VueRecaptcha.reset();
const recaptchaFailed = (reason) => swal.fire({
  title: "ไม่สามารถยืนยันตัวตนได้",
  text: reason ?? "กรุณาลองอีกครั้งหากไม่ได้กรุณาติดต่อผู้ดูแล",
  confirmButtonText: 'ตกลง <i class="fas fa-check"></i>'
});
const recaptchaError = (reason) => swal.fire({
  title: "ไม่สามารถยืนยันตัวตนได้",
  text: reason,
  confirmButtonText: 'ตกลง <i class="fas fa-check"></i>'
});

const swal = $swal.mixin({
  customClass: {
    container: 'bg-black/90 backdrop-blur-sm',
    confirmButton: 'px-4 bg-blue-300 text-white rounded-xl p-2 shadow-lg transition-all duration-200 hover:scale-95 text-lg mx-1',
  },
  buttonsStyling: false
})

function showloading() {
  swal.fire({
    title: "โปรดรอ",
    text: "กำลังรอการตอบสนองจากเซิร์ฟเวอร์",
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      swal.showLoading()
    }
  })
}

async function QRbankSlip(c) {
  showloading()

  if (!_accept.value) return swal.fire({
    title: 'ผิดพลาด!',
    text: "กรุณายอมรับข้อตกลงก่อน!",
    allowOutsideClick: false,
    confirmButtonText: 'ตกลง <i class="fas fa-check"></i>'
  }).then(() => {
    window.location.reload()
  })

  if (!recapchares.value) return swal.fire({
    title: 'ผิดพลาด!',
    text: "กรุณากดยืนยันตัวตน!",
    allowOutsideClick: false,
    confirmButtonText: 'ตกลง <i class="fas fa-check"></i>'
  }).then(() => {
    window.location.reload()
  })

  if (!name.value) return swal.fire({
    title: 'ผิดพลาด!',
    text: "กรุณากรอกชื่อ Minecraft!",
    allowOutsideClick: false,
    confirmButtonText: 'ตกลง <i class="fas fa-check"></i>'
  }).then(() => {
    window.location.reload()
  })

  await fetch(config.public.api + '/whitelist', {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      "g-recaptcha-response": recapchares.value,
      "name": name.value,
      "slip": c
    })
  }).then(response => response.json())
    .then(async data => {
      if (data && data.code === 1) {
        return swal.fire({
          title: 'สำเร็จ!',
          text: data.msg,
          allowOutsideClick: false,
          confirmButtonText: 'ตกลง <i class="fas fa-check"></i>'
        }).then(async () => {
          window.location.replace("https://kfn.moe");
        })
      } else {
        return swal.fire({
          title: 'ผิดพลาด!',
          text: data.msg,
          allowOutsideClick: false,
          confirmButtonText: 'ตกลง <i class="fas fa-check"></i>'
        }).then(async () => {
          window.location.reload();
        })
      }
    });
}
</script>

<template>
  <div class="polka">
    <div class="flex items-center justify-center mx-auto w-full min-h-[calc(100dvh)]">
      <div class="flex w-full sm:max-w-fit">
        <div v-if="!_accept" class="bg-neutral-900 rounded-md p-7 relative w-full min-h-[calc(100dvh)] sm:min-h-fit">
          <div>
            <div class="tracking-[10px]">
              MAGICLAB
            </div>
            <div class="flex gap-2 items-center mt-2">
              <div class="flex items-center justify-center h-[30px] w-[30px] bg-white rounded-full"><i
                  class="far fa-paste text-[#363636]"></i></div> ข้อตกลง
            </div>
            <div class="text-red-200 mt-2.5">
              *กรุณาอ่านก่อนโอนทุกกรณี
            </div>
            <hr class="my-3 opacity-20">
            <div class="mt-2 text-sm font-light">
              - หากโอนผิดหรือนอกเงื่อนไขที่ตั้งไว้จะไม่มีการคืนเงินใด ๆ<br>
              - ก่อนโอนกรุณาเช็คความถูกต้องทั้งหมด<br>
              - กรุณาโอนผ่านบัญชีธนาคารเท่านั้นห้ามโอนผ่าน Wallet / Promptpay<br>
              - รับเฉพาะธนาคารที่มีสลิปเท่านั้น<br>
              - ต้องโอนตามจำนวนเงินที่แจ้งเท่านั้น!<br>
              - หากต้องการโอนแทนกรุณาโอนให้ตรงและกรอกชื่อให้ถูกต้อง!<br>
            </div>
            <div class="mt-2">
              <input id="accept_" type="checkbox" v-model="_accept"
                class="border-gray-300 text-purple-400 focus:ring-0"> <label for="accept_">ยอมรับข้อตกลง</label>
            </div>
          </div>
        </div>
        <div v-if="_accept" class="bg-neutral-900 rounded-md p-7 relative w-full min-h-[calc(100dvh)] sm:min-h-fit">
          <div class="tracking-[10px]">
            MAGICLAB
          </div>
          <div class="flex gap-2 items-center mt-2">
            <div class="flex items-center justify-center h-[30px] w-[30px] bg-white rounded-full"><i
                class="fas fa-shopping-cart text-[#363636]"></i></div> รายระเอียดการชำระ
          </div>
          <div class="text-red-200 mt-2.5">
            *กรุณาอ่านก่อนโอนทุกกรณี
          </div>
          <hr class="my-3 opacity-20">
          <div class="mt-2 text-sm">
            <div class="flex justify-between w-full">
              <p class="opacity-60">
                เลข
              </p>
              <p>
                xxx-x-xxxxx-x
              </p>
            </div>
            <div class="flex justify-between w-full">
              <p class="opacity-60">
                บัญชี
              </p>
              <p>
                กสิกร (K-Bank)
              </p>
            </div>
            <div class="flex justify-between w-full">
              <p class="opacity-60">
                ชื่อ
              </p>
              <p>
                นาย xxx xxxxxx
              </p>
            </div>
          </div>
          <hr class="my-3 opacity-20">
          <div class="mt-2 text-sm">
            <div class="flex justify-between w-full">
              <p class="opacity-60">
                ระยะเวลา
              </p>
              <p>
                1 เดือน
              </p>
            </div>
            <div class="flex justify-between w-full">
              <p class="opacity-60">
                ระบบสกิน
              </p>
              <p>
                -
              </p>
            </div>
            <div class="flex justify-between w-full">
              <p class="opacity-60">
                ระบบฟิกุล่า
              </p>
              <p>
                -
              </p>
            </div>
            <div class="flex justify-between w-full">
              <p class="opacity-60">
                xxxx xxxxx
              </p>
              <p>
                ฿100
              </p>
            </div>
          </div>
          <hr class="my-3 opacity-20">
          <div class="flex justify-between w-full">
            <p class="opacity-60">
              รวมเป็นเงิน
            </p>
            <p>
              ฿100
            </p>
          </div>
          <hr class="my-3 opacity-20">
          <div class="mt-2">
            <label for="name">1. ชื่อไอดีแท้มายคราฟ</label>
            <input v-model="name" type="text" id="name"
              class=" mt-1 w-full bg-white/10 outline-none px-2 py-1 rounded-md">
          </div>
          <div class="mt-2">
            <label>
              2. ยืนยันตัวตนว่าไม่ใช่บอท
            </label>
            <div class="pt-1">
              <vue-recaptcha theme="light" :sitekey="key" :loading-timeout="loadingTimeout" @verify="recaptchaVerified"
                @expire="recaptchaExpired" @fail="recaptchaFailed" @error="recaptchaError">
              </vue-recaptcha>
            </div>
          </div>
          <div class="mt-2 grid">
            <label>3. โอนเสร็จอัพโหลดสลิปที่นี่</label>
            <qrcode-capture @decode="QRbankSlip" accept="image/*" :capture="null" placeholder="อัพโหลดสลิป"
              class="file:border-0 max-w-[300px] file:cursor-pointer mt-1 file:bg-white/10 file:text-white file:py-1 file:px-3 file:rounded-lg outline-none rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    </div>

    <footer class="text-xs opacity-40 mt-4 fixed left-5 bottom-5 pointer-events-none">
      © Whitelist V1.1 | MagicLab
    </footer>
  </div>
</template>
