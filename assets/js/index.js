//路由器固件解包后，从 /bin/mkxqimage 中提取的盐
const salt = {
  r1d: "A2E371B0-B34B-48A5-8C40-A7133F3B5D88",
  others: "d44fb0960aa0-a5e6-4a30-250f-6d2df50a",
};

// 非 R1D 盐要反转后才能使用
function swapSalt(salt) {
  return salt.split("-").reverse().join("-");
}

// SN 中不含 '/' 则为 r1d
function getSalt(sn) {
  if (!sn.includes("/")) return salt.r1d;
  else return swapSalt(salt.others);
}

// 密码算法：原始 SN 拼接反转后的盐，做 md5 运算取前 8 个字符
function getPassword(sn) {
  const md5 = CryptoJS.MD5(sn + getSalt(sn));
  return md5.toString().substring(0, 8);
}

// 监听提交事件
function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const sn = formData.get("sn");
  document.querySelector("input:read-only").value = getPassword(sn);
}

// 监听输入事件
function handleChange(event) {
  if (!event.value) document.querySelector("input:read-only").value = "";
}
