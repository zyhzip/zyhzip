document.addEventListener('DOMContentLoaded', () => {
  const alice1 = document.querySelector("#alice1");
  const alice2 = document.querySelector("#alice2");
  const alice3 = document.querySelector("#alice3");
  const alice4 = document.querySelector("#alice4");

  const aliceTumb = [
    { transform: 'rotate(0) scale(1)' },
    { transform: 'rotate(360deg) scale(0)' }
  ];

  const aliceTiming = {
    duration: 1000,
    iterations: 1,
    fill: 'forwards'
  };

  function start() {
    if (alice1) {
      alice1.animate(aliceTumb, aliceTiming).finished
        .then(() => {
          if (alice2) return alice2.animate(aliceTumb, aliceTiming).finished;
        })
        .then(() => {
          if (alice3) return alice3.animate(aliceTumb, aliceTiming).finished;
        })
        .then(() => {
          if (alice4) return alice4.animate(aliceTumb, aliceTiming).finished;
        })
        .catch(error => console.error(`Error animating Alices: ${error}`));
    } else {
      console.error("alice1 is null, cannot animate.");
    }
  }
  alice1.onclick = start; // 直接使用元素的 onclick
});

//作业二中的一个函数
function changeImage(src) {
  // 获取  
  var mian = document.getElementById('main');
  // 更新  
  mian.src = src;
}
