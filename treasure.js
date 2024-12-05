class TreasureMap {
  static async getInitialClue() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const random = Math.random()
        if (random < 0.5) {
          resolve("在古老的图书馆里找到了线索1...");
        } else {
          resolve("在古老的图书馆里找到了线索2...")
        }
      }, 1000);
    });
  }

  static async decodeAncientScript(clue) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let str_clue = String(clue);
        if (str_clue.includes('线索1')) {
          resolve("解码成功!宝藏在一座古老的神庙中...");
        }
        else {
          resolve("解码成功!宝藏在深不见底的洞穴中...")
        }
      }, 1000);
    });
  }

  static async searchTemple(location) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (String(location).includes('神庙')) {
          const random = Math.random();
          if (random < 0.5) {
            reject("糟糕!遇到了神庙守卫!");
          }
          resolve("找到了一个神秘的箱子...");
        }
        else {
          const random = Math.random();
          if (random < 0.5) {
            reject("坏了，摔伤了");
          }
          resolve("找到了一个神秘的祭坛...");
        }
      }, 1000);
    });
  }

  static async checkmykey(box) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (String(box).includes("箱子")) {
          const random = Math.random();
          if (random < 0.5) {
            reject('使用了银色钥匙,无法打开宝箱')
          }
          else {
            resolve('使用了金色钥匙,打开了宝箱！')
          }
        }

        if (String(box).includes("祭坛")) {
          const random = Math.random();
          if (random < 0.5) {
            reject('不知道如何使用祭坛,悻悻离开')
          }
          else {
            resolve('献祭了自己的鲜血打开了祭坛的暗格！')
          }
        }
      }, 1000);
    })
  }

  static async openTreasureBox() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("恭喜!你找到了传说中的宝藏!");
      }, 1000);
    });
  }

}
0
let gameInProgress = false;

async function findTreasureWithAsyncAwait() {
  if (gameInProgress) {
    return;
  }

  gameInProgress = true;

  let outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';
  try {
    window.scrollTo
    const clue = await TreasureMap.getInitialClue();
    if (String(clue).includes('线索1')) {
      outputDiv.innerHTML += clue + '<br>' + '<img src="./images/library.jpg" alt="图书馆1" style="height: 150px; width: 250px;">' + '<br>' + '<br>';
    } else {
      outputDiv.innerHTML += clue + '<br>' + '<img src="./images/library2.jpg" alt="图书馆2" style="height: 150px; width: 250px;">' + '<br>' + '<br>';
    }

    window.scrollTo
    const location = await TreasureMap.decodeAncientScript(clue);
    if (String(location).includes('神庙')) {
      outputDiv.innerHTML += location + '<br>' + '<img src="./images/sm.jpg" alt="神庙" style="height: 150px; width: 250px;">' + '<br>' + '<br>';
    }
    else {
      outputDiv.innerHTML += location + '<br>' + '<img src="./images/cave.jpg" alt="洞穴" style="height: 150px; width: 250px;">' + '<br>' + '<br>';
    }

    window.scrollTo
    const box = await TreasureMap.searchTemple(location);
    if (String(box).includes('箱子')) {
      outputDiv.innerHTML += box + '<br>' + '<img src="./images/box.jpg" alt="宝箱" style="height: 150px; width: 250px;">' + '<br>' + '<br>';
    } else {
      outputDiv.innerHTML += box + '<br>' + '<img src="./images/jt.jpg" alt="祭坛" style="height: 150px; width: 250px;">' + '<br>' + '<br>';
    }

    window.scrollTo
    const keys = await TreasureMap.checkmykey(box);
    if (String(keys).includes('钥匙')) {
      outputDiv.innerHTML += keys + '<br>' + '<img src="./images/godkey.jpg" alt="金钥匙" style="height: 150px; width: 250px;">' + '<br>' + '<br>';
    } else {
      outputDiv.innerHTML += keys + '<br>' + '<img src="./images/blood.jpg" alt="献祭" style="height: 150px; width: 250px;">' + '<br>' + '<br>';
    }

    window.scrollTo
    const treasure = await TreasureMap.openTreasureBox();
    outputDiv.innerHTML += treasure + '<br>' + '<img src="./images/chest.jpg" alt="宝藏" style="height: 150px; width: 250px;">' + '<br>' + '<br>';

    gameInProgress = false;
    document.getElementById('startButton').disabled = false; // 重新启用按钮


  } catch (error) {

    gameInProgress = false;
    document.getElementById('startButton').disabled = false;

    let str_er = String(error);
    let imgsrc = String("");
    if (str_er.includes("神庙守卫")) {
      imgsrc = '<img src="./images/smsw.jpg" alt="守卫" style="height: 150px; width: 250px;">'
    }
    else if (str_er.includes("银色钥匙")) {
      imgsrc = '<img src="./images/sliverkey.jpg" alt="银钥匙" style="height: 150px; width: 250px;">'
    }
    else if (str_er.includes("摔")) {
      imgsrc = '<img src="./images/hurt.jpg" alt="摔伤" style="height: 150px; width: 250px;">'
    }
    else {
      imgsrc = '<img src="./images/leave.jpg" alt="离开" style="height: 150px; width: 250px;">'
    }

    outputDiv.innerHTML += "寻宝失败:" + error + "<br>" + imgsrc + '<br>';
    window.scrollTo
  }
}

document.getElementById('startButton').addEventListener('click', function (event) {
  if (!gameInProgress) {
    findTreasureWithAsyncAwait();
    this.disabled = true; // 禁用按钮，直到游戏结束
  } else {
    alert("游戏正在进行中，请稍后再试。");
  }
});

