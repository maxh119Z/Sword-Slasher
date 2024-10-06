var mobKills, coinsmultiplier, critmult, critchance, coins, health, attrition, regencont, startattrition, startkills, damagemult;
var pause = true;
var playmenu = true;
var storedName = localStorage.getItem("name");
var turrets, texts, mobs;
var shop, leaderboard, chattalk, custoboard;
var leaderboardtext = [];
var innertable;
var leadButtons;
var section;

//playerrelated
var hitbox, swinging, maxHealth;
var tip, tipHitbox, tipX, tipY;
var player, playercontainer, playerHitbox, playerX, playerY, playerCenter;

//movespeed related variables
var moveSpeed, diagonalmoveSpeed, turSpeed, turdiaspeed;
const keys = {};

//background related variables
var background, backgroundHitBox, backgroundX, backgroundY
var attack, turretdmg, backgroundmusic;
let debounceTimeout; //prevent glitching when i open the shop START HERE
const debounceDelay = 195;
//movementmaybe?
var musicX, musicY;
//mob
var mobCount,mobCountID;

// Function to preload images
function preloadImages(callback) {
  var imageUrls = [
    "attrition.png",
    "background3.jpeg",
    "boss1.png",
    "coin.png",
    "chatbut.png",
    "critdamage.png",
    "critpercent.png",
    "cperenemey.png",
    localStorage.getItem("newmobimg"),
    localStorage.getItem("newmobhurtimg"),
    "guyrunning.gif",
    "heart.png",
    "heartregen.png",
    "maxhealth.png",
    "mapBG.jpg",
    "panelMenu3.png",
    "morecoins.png",
    localStorage.getItem("newplayerimg"),
    localStorage.getItem("newplayerhurtimg"),
    "shadedBorders.png",
    "shopbackground.png",
    "shopborder.png",
    "regensign.png",
    localStorage.getItem("newturretimg"),
    "reset.png",
    "leaderboardbut.png",
    "skull.png",
    "shop.png",
    "title.png"
    // Add more image URLs here
  ];

  var loadedImagesCount = 0;
  function loadImage(url) {
    var img = new Image();
    img.src = url;

    img.onload = function() {
      loadedImagesCount++;
      if (loadedImagesCount === imageUrls.length) {
        callback();
      }
    };

  }

  imageUrls.forEach(function(url) {
    loadImage(url);
  });
}

function initializeGame() {
  alldavariables();
  newimg();

  if (storedName !==null && storedName !== "") {
    document.getElementById("playscreen").style.zIndex = "-3";
    //alert("Name: "+ localStorage.getItem("name"));
    pause = false;
    playmenu = false;
  }
  document.getElementById("deathscreen").style.zIndex = "-3";
  startturrets();

}

function startGame() {

  window.addEventListener("keydown", handleTouchDown);
  window.addEventListener("keyup", handleTouchUp);
  //rotating player to face mouse
  function handleRotate(e) {
    if (!pause){
      let angle = Math.atan2(e.pageX - playerCenter.x, - (e.pageY - playerCenter.y)) * (180 / Math.PI);
      player.style.transform = `rotate(${angle}deg)`;
      player.style.top = Math.max((window.innerHeight - player.clientHeight) / 2, 0) + 'px';
      player.style.left = Math.max((window.innerWidth - player.clientWidth) / 2, 0) + 'px';
    }
  }
  document.addEventListener("mousemove", handleRotate);
  document.addEventListener("touchmove", handleRotate);

  //onclick swing and other onclick functions
  document.onclick = function() {
    if (backgroundmusic.paused && shop.style.visibility == "hidden" && playmenu == false && leaderboard.style.visibility == "hidden" && chattalk.style.visibility == "hidden" && custoboard.style.visibility == "hidden"){
      backgroundmusic.play();
    }
    if (!pause){
      if (playercontainer.classList.contains("swinganim") == false && !swinging) {
        playercontainer.classList.add("swinganim");
        swinging = true;
        setTimeout(function() {         
          playercontainer.classList.remove("swinganim"); 
          swinging = false;
        }, 500);


      //start of swining to hit mob Kai here
        mobs = document.querySelectorAll('.mob1,.boss1');
      mobs.forEach(mob => { 
        let a = false;
        if (damaged(tip, mob)){
            a = true;
          }
        if (a) {
            let mobX = parseFloat(mob.style.left) || 0;
            let mobY = parseFloat(mob.style.top) || 0;
            var subtracting;

            var random = Math.floor(Math.random() * (100)) + 1;
            if (random <= critchance){
              hitdamagetext(mob, mobX,mobY, Math.ceil(attack*critmult*damagemult),true);
              subtracting = Math.ceil(attack*critmult*damagemult);
            }
            else{
              hitdamagetext(mob, mobX,mobY, Number( Math.ceil(attack*damagemult)),false);
              subtracting = Math.ceil(attack*damagemult);
            }
      
          if (mob.classList.contains("boss1")){
              knockback(mob, tipX, tipY+15,600);
            }
          else{
            knockback(mob, tipX, tipY+15,300);
          }
          if (!mob.damageCooldown) {
              mob.innerHTML -=subtracting;
              mob.damageCooldown = true;
              if (!mob.classList.contains("boss1")){
                mob.style.backgroundImage = 'url('+localStorage.getItem("newmobhurtimg")+')';
                //hurt version
                setTimeout(() => {
                  mob.damageCooldown = false;
                  mob.style.backgroundImage = 'url('+localStorage.getItem("newmobimg")+')';
                }, 500);
              }
              else{
                setTimeout(() => {
                  mob.damageCooldown = false;
                }, 500);
              }
              if (mob.innerHTML <= 0) {
                var killsound = new Audio("killsound.mp3");
                killsound.volume = 0.5;
                killsound.play();
                mob.remove();
                coins += Math.floor(coinsmultiplier*(Math.floor(Math.random() * 3) + 3));
                document.getElementById("coinint").innerHTML = coins;
                localStorage.setItem("coins", coins);
                mobKills += 1;
                localStorage.setItem("mobkills",mobKills);
                document.getElementById("killint").innerHTML = mobKills;
                attrition += Math.ceil(mobKills/16);
                localStorage.setItem("attrition",attrition);
                document.getElementById("attritionint").innerHTML = attrition + "%";
                //mobCount--; could result in the same mob... bugs in text
                mobCountID--;
              }
            }
        }
      });
      }
    }
    if (document.getElementById("deathscreen").style.zIndex == "102" && health == 0){
      window.open(window.location.href, "_self")
    }
  }

  setInterval(combinedInterval, 1000);
  setInterval(regeneration, 2000);
  window.ontouchmove = function(){
    musicX = event.touches[0].clientX;
    musicY = event.touches[0].clientY;
  }

  movement();
  mobCount = 0;
  mobCountID = 0;
  createMob();
  updatePlayerPosition();
}

function startAfterPreload() { 
  initializeGame();
  document.getElementById("cov").style.visibility = "hidden";
  startGame();
}

//load the loading gif b4 the game starts
var loading = new Image();
loading.src = "loadinggif.gif";
loading.onload = function() {
  localStor();
  preloadImages(startAfterPreload);
};

function playamenu() {

    var inputName = document.getElementById("name").value;
    if (inputName !== "") {

      var textLines = []
      fetch('leaderboard.txt')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(data => {
          console.log("very nice")
          // Split the text file content into lines
          textLines = data.split('\n');

          console.log('Text file content:', textLines);
          // don't delete this is very hard to code sir  
          if(!textLines.includes(inputName)){
            localStorage.setItem("name", inputName);
            document.getElementById("playscreen").style.zIndex = "-3";
            pause = false;
            playmenu = false;
            backgroundmusic.volume = 0.3;
            backgroundmusic.play();

          var xhr = new XMLHttpRequest();
          xhr.open("POST", "save_value.php", true);
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr.onreadystatechange = function() {
              if (xhr.readyState === 4 && xhr.status === 200) {
                  console.log(xhr.responseText);
              }
          };

          xhr.send("username=" + inputName +"\n" + localStorage.getItem("coins") + "\n" + localStorage.getItem("mobkills") + "\n" + localStorage.getItem("attrition") + "\n"+localStorage.getItem("health"));
          } else {
            alert("Username Is Already Taken")
          }
      })
      .catch(error => {
          console.error('There was a problem with fetching the text file:', error);
      });

    } 
    else {
      alert("Please enter a name");
    }


}

function leaderboardsave(){
  var textLines = []
  var coinranking = []
  fetch('leaderboard.txt')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text();
  })
  .then(data => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "leaderboard.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };
    textLines = data.split('\n')

    for (j=1;j<textLines.length;j+=5){
      if(textLines[j-1] == localStorage.getItem("name") && localStorage.getItem("name")!=""){
        textLines.splice(j, 1, String(Number(localStorage.getItem("coins"))))
      }
    }
    for (k=2;k<textLines.length;k+=5){
      if(textLines[k-2] == localStorage.getItem("name") && localStorage.getItem("name")!=""){
        textLines.splice(k, 1, String(Number(localStorage.getItem("mobkills"))))
      }
    }
    for (l=3;l<textLines.length;l+=5){
      if(textLines[l-3] == localStorage.getItem("name") && localStorage.getItem("name")!=""){
        textLines.splice(l, 1, String(Number(localStorage.getItem("attrition"))))
      }
    }
    for (m=4;m<textLines.length;m+=5){
      if(textLines[m-4] == localStorage.getItem("name") && localStorage.getItem("name")!=""){
        textLines.splice(m, 1, String(Number(localStorage.getItem("health"))))
      }
    }
    newlist = textLines.toString()
    newlist = textLines.join(",");
    newlist = newlist.replace(/,$/, '');

    // Now newlist doesn't have a trailing comma
    //alert(newlist);

    newerlist = newlist.replace(/,/g,"\n")
    if(newerlist != ""){
      xhr.send("username="+newerlist)
    }
  })
  .catch(error => {
      console.error('There was a problem with fetching the text file:', error);
  });
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "leaderboard.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
       xhr.send("username=" + inputName +"\n" + localStorage.getItem("coins") + "\n" + localStorage.getItem("mobkills") + "\n" + localStorage.getItem("attrition") + "\n"+localStorage.getItem("health"));
  };

}

function alldavariables(){

  health = Number(localStorage.getItem("health"));
  document.getElementById("healthint").innerHTML = health;
  attrition = Number(localStorage.getItem("attrition"));
  document.getElementById("attritionint").innerHTML = attrition + "%";
  shop = document.getElementById("shop");
  shop.style.visibility = "hidden";
  leaderboard = document.getElementById("leaderboard");
  leaderboard.style.visibility = "hidden";
  innertable = document.getElementById("innertable");
  innertable.innerHTML = "";
  chattalk = document.getElementById("chatboard");
  chattalk.style.visibility = "hidden";
  custoboard = document.getElementById("custoboard");
  custoboard.style.visibility = "hidden";
  leadButtons = document.querySelectorAll('.leadbutton');
  leadButtons.forEach(function(button) {
      button.style.visibility = 'hidden';
  });
  section = document.getElementById("section");

  turrets = document.querySelectorAll('.turret1');
  texts = document.querySelectorAll('.hittext');
  mobs = document.querySelectorAll('.mob1,.boss1');

  hitbox = false;
  swinging = false;
  maxHealth = Number(localStorage.getItem("starthealth"));
  tip = document.getElementById("tip");
  tipHitbox = tip.getBoundingClientRect();
  tipX = tipHitbox.left;
  tipY = tipHitbox.top;


  player = document.getElementById("player");
  playercontainer = document.getElementById("playercontainer");
  playerHitbox = player.getBoundingClientRect();
  playerX = playerHitbox.left;
  playerY = playerHitbox.top;
  playerCenter = {
    x: window.innerWidth/2,
    y: window.innerHeight/2
  };
  //when resize
  window.onresize = function(){
    var playercurRot = playercontainer.style.transform;
    player.style.transform = 'rotate(0)';
    playerCenter = {
      x: window.innerWidth/2,
      y: window.innerHeight/2
    };
    player.style.top = Math.max((window.innerHeight - player.clientHeight) / 2, 0) + 'px';
    player.style.left = Math.max((window.innerWidth - player.clientWidth) / 2, 0) + 'px';
    playerHitbox = player.getBoundingClientRect();
    playerX = playerHitbox.left;
    playerY = playerHitbox.top;
    mobs = document.querySelectorAll('.mob1,.boss1');
    tipHitbox = tip.getBoundingClientRect();
    tipX = tipHitbox.left;
    tipY = tipHitbox.top;
    player.style.transform = playercurRot;

  }

  //movespeed related variables
  moveSpeed = Number(localStorage.getItem("moveSpeed"));
  diagonalmoveSpeed = moveSpeed/Math.sqrt(2)
  turSpeed = moveSpeed;
  turdiaspeed = diagonalmoveSpeed;

  //background related variables
  background = document.getElementById("background");
  backgroundHitBox = background.getBoundingClientRect();
  backgroundX = backgroundHitBox.left;
  backgroundY = backgroundHitBox.top;

  //gamevariables
  attack = localStorage.getItem("attack");
  turretdmg = localStorage.getItem("turretdmg");
  backgroundmusic = new Audio("Noise-Long-Version-chosic.com_.mp3");
  backgroundmusic.volume = 0.5;

  regencont = document.getElementById("regencont");
  regencont.style.visibility = "hidden";

  musicX = window.innerWidth/2;
  musicY = window.innerHeight/2;
}
function localStor(){
  if(localStorage.getItem("newplayerimg") != null){
    document.getElementById("playerimgbox").value = localStorage.getItem("newplayerimg");
  }
  else{
    localStorage.setItem("newplayerimg","playersword.png");
  }
  document.getElementById("playerimg").src = localStorage.getItem("newplayerimg");

  if(localStorage.getItem("newmobimg") != null){
    document.getElementById("mobimgbox").value = localStorage.getItem("newmobimg");
  }
  else{
    localStorage.setItem("newmobimg","enemy1.png")
  }
  if(localStorage.getItem("newturretimg") != null){
    document.getElementById("turretimgbox").value = localStorage.getItem("newturretimg");
  }
  else{
    localStorage.setItem("newturretimg","sawblade.png")
  }
  if(localStorage.getItem("newmobhurtimg") != null){
    document.getElementById("mobhurtimgbox").value = localStorage.getItem("newmobhurtimg");
  }
  else{
    localStorage.setItem("newmobhurtimg","enemy1hurt.png")
  }
  if(localStorage.getItem("newplayerhurtimg") != null){
    document.getElementById("playerhurtimgbox").value = localStorage.getItem("newplayerhurtimg");
  }
  else{
  localStorage.setItem("newplayerhurtimg","playerhurt.png")
  }
  //turrets
  if (localStorage.getItem("turret") == null || localStorage.getItem("health") == 0) {
    localStorage.setItem("turret", false);
  }
  if (localStorage.getItem("allturretx") == null || localStorage.getItem("health") == 0) {
    localStorage.setItem("allturretx", "");
  }
  if (localStorage.getItem("allturrety") == null || localStorage.getItem("health") == 0) {
    localStorage.setItem("allturrety", "");
  }

  //attack
  if (localStorage.getItem("attacklvl") == null || Number(localStorage.getItem("attacklvl") == 0) || localStorage.getItem("health") == 0) {
    localStorage.setItem("attacklvl", 1);
    localStorage.setItem("attackcost", 50);
    localStorage.setItem("attack", 25);
  }
  document.getElementById("priceone").innerHTML = "$" + Number(localStorage.getItem("attackcost"));
  document.getElementById("levelone").innerHTML = "LVL: " + Number(localStorage.getItem("attacklvl"));

  //movementupgrade
  if (localStorage.getItem("speedlvl") == null || Number(localStorage.getItem("speedlvl") == 0) || Number(localStorage.getItem("speedlvl") > 3) || localStorage.getItem("health") == 0) {
    localStorage.setItem("speedlvl", 1);
    localStorage.setItem("speedcost", 50);
    localStorage.setItem("moveSpeed", 5)
  }
  document.getElementById("pricetwo").innerHTML = "$" + Number(localStorage.getItem("speedcost"));
  if (localStorage.getItem("speedlvl") == 3) {
    document.getElementById("leveltwo").innerHTML = "MAX";
  }
  else {
    document.getElementById("leveltwo").innerHTML = "LVL: " + Number(localStorage.getItem("speedlvl"));
  }

  //turretupgrade
  if (localStorage.getItem("turretlvl") == null || Number(localStorage.getItem("turretlvl") == 0) || Number(localStorage.getItem("turretlvl") > 10) || localStorage.getItem("health") == 0) {
    localStorage.setItem("turretlvl", 1);
    localStorage.setItem("turretcost", 75);
    localStorage.setItem("turretdmg", 10)
  }
  document.getElementById("pricethree").innerHTML = "$" + Number(localStorage.getItem("turretcost"));
  if (localStorage.getItem("turretlvl") == 10) {
    document.getElementById("levelthree").innerHTML = "MAX";
  }
  else {
    document.getElementById("levelthree").innerHTML = "LVL: " + Number(localStorage.getItem("turretlvl"));
  }

  //regenerationupgrade
  if (localStorage.getItem("regenlvl") == null || Number(localStorage.getItem("regenlvl") == 0) || localStorage.getItem("health") == 0) {
    localStorage.setItem("regenlvl", 1);
    localStorage.setItem("regencost", 10);
    localStorage.setItem("regen", 0)
  }
  document.getElementById("pricefour").innerHTML = "$" + Number(localStorage.getItem("regencost"));
  document.getElementById("levelfour").innerHTML = "LVL: " + Number(localStorage.getItem("regenlvl"));

  //starthealthupgrade
  if (localStorage.getItem("starthealthlvl") == null || Number(localStorage.getItem("starthealthlvl")) == 0) {
    localStorage.setItem("starthealthlvl", 1);
    localStorage.setItem("starthealthcost", 100);
    localStorage.setItem("starthealth", 100)
  }
  document.getElementById("pricefive").innerHTML = "$" + Number(localStorage.getItem("starthealthcost"));
  document.getElementById("levelfive").innerHTML = "LVL: " + Number(localStorage.getItem("starthealthlvl"));

  //startcoinsupgrade
  if (localStorage.getItem("startcoinlvl") == null || Number(localStorage.getItem("startcoinlvl")) == 0) {
    localStorage.setItem("startcoinlvl", 1);
    localStorage.setItem("startcoincost", 800);
    localStorage.setItem("startcoin", 500)
  }
  document.getElementById("pricesix").innerHTML = "$" + Number(localStorage.getItem("startcoincost"));
  document.getElementById("levelsix").innerHTML = "LVL: " + Number(localStorage.getItem("startcoinlvl"));

  //startdamagesupgrade
  if (localStorage.getItem("startdamagemultlvl") == null || Number(localStorage.getItem("startdamagemultlvl")) == 0) {
    localStorage.setItem("startdamagemultlvl", 1);
    localStorage.setItem("startdamagemultcost", 450);
    localStorage.setItem("startdamagemult", 1);
  }
  damagemult = Number(localStorage.getItem("startdamagemult"));
  document.getElementById("priceten").innerHTML = "$" + Number(localStorage.getItem("startdamagemultcost"));
  document.getElementById("levelten").innerHTML = "LVL: " + Number(localStorage.getItem("startdamagemultlvl"));

  if ((localStorage.getItem("startcoinlvl") == 1 && localStorage.getItem("starthealthlvl") == 1) || localStorage.getItem("startattrition") == null || localStorage.getItem("startkills") == null){
    localStorage.setItem("startattrition",0);
    localStorage.setItem("startkills",0);
  }
  startattrition = parseInt(localStorage.getItem("startattrition"));
  startkills = parseInt(localStorage.getItem("startkills"));
  //mobkills
  if (localStorage.getItem("mobkills") == null || localStorage.getItem("health") == 0) {
    localStorage.setItem("mobkills", localStorage.getItem("startkills"));
  }
  mobKills = Number(localStorage.getItem("mobkills"));
  document.getElementById("killint").innerHTML = mobKills;

  //attrition
  if (localStorage.getItem("attrition") == null || localStorage.getItem("health") == 0) {
    localStorage.setItem("attrition", localStorage.getItem("startattrition"));
  }

  //cperenemeyerationupgrade
  if (localStorage.getItem("cperenemeylvl") == null || Number(localStorage.getItem("cperenemeylvl") == 0) || localStorage.getItem("health") == 0) {
    localStorage.setItem("cperenemeylvl", 1);
    localStorage.setItem("cperenemeycost", 69);
    localStorage.setItem("cperenemey", 1)
  }
  coinsmultiplier = Number(localStorage.getItem("cperenemey"))
  document.getElementById("priceseven").innerHTML = "$" + Number(localStorage.getItem("cperenemeycost"));
  document.getElementById("levelseven").innerHTML = "LVL: " + Number(localStorage.getItem("cperenemeylvl"));

  //critdamageupgrade
  if (localStorage.getItem("critdamagelvl") == null || Number(localStorage.getItem("critdamagelvl") == 0) || localStorage.getItem("health") == 0) {
    localStorage.setItem("critdamagelvl", 1);
    localStorage.setItem("critdamagecost", 100);
    localStorage.setItem("critdamage", 1)
  }
  critmult = Number(localStorage.getItem("critdamage"));
  document.getElementById("priceeight").innerHTML = "$" + Number(localStorage.getItem("critdamagecost"));
  document.getElementById("leveleight").innerHTML = "LVL: " + Number(localStorage.getItem("critdamagelvl"));

  //critchanceupgrade
  if (localStorage.getItem("critchancelvl") == null || Number(localStorage.getItem("critchancelvl") == 0) || localStorage.getItem("health") == 0) {
    localStorage.setItem("critchancelvl", 1);
    localStorage.setItem("critchancecost", 100);
    localStorage.setItem("critchance", 0)
  }
  critchance = Number(localStorage.getItem("critchance"))
  document.getElementById("pricenine").innerHTML = "$" + Number(localStorage.getItem("critchancecost"));
  document.getElementById("levelnine").innerHTML = "Chance: " + Number(localStorage.getItem("critchance")) + "%";


  //coins
  if (localStorage.getItem("coins") == null || localStorage.getItem("health") == 0) {
    localStorage.setItem("coins", Number(localStorage.getItem("startcoin")));
  }
  //localStorage.setItem("coins",123123213);
  coins = Number(localStorage.getItem("coins"));
  document.getElementById("coinint").innerHTML = coins;

  //health
  if (localStorage.getItem("health") == null || localStorage.getItem("health") == 0) {
    localStorage.setItem("health", Number(localStorage.getItem("starthealth")));
  }
}
function startturrets() {
  if(localStorage.getItem("turret")==="true"){
    spawnturret()
  }
  listx = localStorage.getItem("allturretx").split(',')
  listy = localStorage.getItem("allturrety").split(',')

  if (listx !== null && listy !== null && listx !== "" && listy !== ""){
    for (i = 1; i < listx.length; i++) {
      const turret = document.createElement('div');
      turret.className = "turret1";
      turret.style.backgroundImage = 'url('+localStorage.getItem("newturretimg")+')';
      document.body.appendChild(turret);

      var posX = parseInt(listx[i]);
      var posY = parseInt(listy[i]);
      turret.spawnx = posX;
      turret.spawny = posY;


      // Set turret position
      turret.style.top = posY + "px";
      turret.style.left = posX + "px";
    }
  }
}
function showshop(){
  if (shop.style.visibility == "hidden" && playmenu == false && leaderboard.style.visibility == "hidden" && chattalk.style.visibility == "hidden" && custoboard.style.visibility == "hidden"){
    shop.classList.add("shopopen");
    shop.zIndex = "100";
    shop.style.visibility = "visible";
    setTimeout(function(){shop.classList.remove("shopopen");},500);
  }
}
function hideshop(){
  if (shop.style.visibility == "visible"){
    shop.classList.add("shopclose")
    setTimeout(function() {
      shop.style.visibility = "hidden";
      shop.zIndex = "-3";
      shop.classList.remove("shopclose");
    }, 480);
  }
}
function combinedInterval() {
  if (!pause && health != 0){
    mobhitu();
    createMob();
    turrethitmob();
  }
  if (chattalk.style.visibility == "visible"){
      var textLines = []
      fetch('chat.txt')
      .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
      })
      .then(data => {
          textLines = data.split('\n') 

          let curtextlines = document.getElementById("innertable2").innerText.split('\n');
          if ((curtextlines.length + 1) !== textLines.length){
              displaychat();
          }
        })
  }
}
function regeneration(){
  if (health < maxHealth && health >0 && Number(localStorage.getItem("regen"))>0 && shop.style.visibility == "hidden" && leaderboard.style.visibility == "hidden" && chattalk.style.visibility == "hidden" && custoboard.style.visibility == "hidden"){

    health += Number(localStorage.getItem("regen"));
    if (health>localStorage.getItem("starthealth")){
      health = maxHealth;
    }
    localStorage.setItem("health",health);
    document.getElementById("healthint").innerHTML = health;
    regencont.style.visibility = "visible";
    regencont.classList.add("regenup");

    setTimeout(function(){
      regencont.classList.remove("regenup");
    },500);

    regencont.classList.add("regendis");
    setTimeout(function(){
      regencont.style.visibility = "hidden";
      regencont.classList.remove("regendis");

    },500)
  }

}
function mobhitu(){
  let mobthisinterval = 0;
  let damagethisinterval = 0;
  if (!swinging){
    mobs.forEach(mob => {
      if (damaged(document.getElementById("playerhitbox"), mob)) {
        mobthisinterval++;
        if (mobthisinterval<6){
          damagethisinterval+=mob.damage;
        }
        var hitsound = new Audio("hitsound.mp3");
        hitsound.volume = 0.5;
        hitsound.play();

        document.getElementById("playerimg").src = localStorage.getItem("newplayerhurtimg");
      }
    });
    health-= damagethisinterval;
    localStorage.setItem("health",health);
    document.getElementById("healthint").innerHTML = health;
    setTimeout(function(){document.getElementById("playerimg").src = localStorage.getItem("newplayerimg");},500);
    if (health <=0){
      pause = true;
      leaderboardsave();
      health = 0;
      localStorage.setItem("health",0);
      document.getElementById("healthint").innerHTML = 0;
      //You Died With (Rank): Coins
      var textLines = []
      fetch('leaderboard.txt')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(data => {
        textLines = data.split('\n')
        var leaderboard = [];
        var coinranking = 0;
        var attritionranking = 0;
        var killsranking = 0;
        let index = 0;

        //coins
        for(i=1;i<textLines.length;i+=5){
          leaderboard.push({ name: textLines[i-1], score: textLines[i] })
        }
        leaderboard = sortLeaderboard(leaderboard);
        leaderboard.forEach(function(player, index) {
          if (player.name == localStorage.getItem("name")){
            coinranking = index+1;
          }
          index++;
        });
        //attrition
        leaderboard = [];
        index = 0;
        for(i=3;i<textLines.length;i+=5){
            leaderboard.push({ name: textLines[i-3], score: textLines[i] })
          }
        leaderboard = sortLeaderboard(leaderboard);
        leaderboard.forEach(function(player, index) {
          if (player.name == localStorage.getItem("name")){
            attritionranking = index+1;
          }
          index++;
        });
        //kills
        leaderboard = [];
        index = 0;
        for(i=2;i<textLines.length;i+=5){
          leaderboard.push({ name: textLines[i-2], score: textLines[i] })
        }
        leaderboard.forEach(function(player, index) {
          if (player.name == localStorage.getItem("name")){
            killsranking = index+1;
          }
          index++;
        });

        document.getElementById("deathcoins").innerHTML = "Coins " + "(Rank " + coinranking +
          "): " + Number(localStorage.getItem("coins"));
        document.getElementById("deathattrition").innerHTML = "Attrition " + "(Rank " + attritionranking +
          "): " + Number(localStorage.getItem("attrition"));
        document.getElementById("deathkills").innerHTML = "Kills " + "(Rank " + killsranking +
          "): " + Number(localStorage.getItem("mobkills"));

      })
      .catch(error => {
          console.error('There was a problem with fetching the text file:', error);
      });

      document.getElementById("deathscreen").classList.add("showdeath");
      document.getElementById("deathscreen").style.zIndex = "102";    
      //window.open(window.location.href, "_self");
    }
  }

}
//touchscreen
//stops moving when touch code
touchscreen = false;
window.ontouchstart = function(){
  touchscreen = true;
}
window.ontouchend = function(){
  touchscreen = false
}
function updatePlayerPosition() {
  if(touchscreen){
    mobs = document.querySelectorAll('.mob1,.boss1');
  turrets = document.querySelectorAll('.turret1');
 texts = document.querySelectorAll('.hittext');
  var movex = musicX - window.innerWidth/2;
  var movey = musicY - window.innerHeight/2;

  const distance = Math.sqrt(movex * movex + movey * movey);
  const speed = localStorage.getItem("moveSpeed");
  if (pause == false){
  if (distance > speed) {

    const ratio = speed / distance;
    backgroundX -= movex*ratio;
    backgroundY -= movey *ratio;


      mobs.forEach(mob => {

        var mobY = parseInt(window.getComputedStyle(mob).getPropertyValue("top"));
        var mobX = parseInt(window.getComputedStyle(mob).getPropertyValue("left"));


          mobY -= movey * ratio;
          mobX -= movex*ratio;

        mob.style.top = mobY + "px";
        mob.style.left = mobX + "px";


      });
      texts.forEach(text=>{
        var textY = parseInt(window.getComputedStyle(text).getPropertyValue("top"));
        var textX = parseInt(window.getComputedStyle(text).getPropertyValue("left"));

          textY -= movey * ratio;
          textX -= movex*ratio;

        text.style.top = textY + "px";
        text.style.left = textX + "px";

      });
    turrets.forEach(turret=>{
      var turretY = parseInt(window.getComputedStyle(turret).getPropertyValue("top"));
      var turretX = parseInt(window.getComputedStyle(turret).getPropertyValue("left"));

        turretY -= movey * ratio;
        turretX -= movex*ratio;

      turret.style.top = turretY + "px";
      turret.style.left = turretX + "px";

    });
    }
}
  requestAnimationFrame(updatePlayerPosition);
} 
}
function updatebackground() {
  background.style.left = backgroundX + "px";
  background.style.top = backgroundY + "px";
  backgroundHitBox = background.getBoundingClientRect();
}
function handleTouchDown(event) {
  keys[event.key.toLowerCase()] = true;
}
function debounce(func, delay) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(func, delay);
}
function handleTouchUp(event) {
  delete keys[event.key.toLowerCase()];
  if(event.key.toLowerCase() === "c"){
    if (!hitbox){
      tip.style.backgroundColor = 'red';
      document.getElementById("playerhitbox").style.border = '2px solid red';
      playercontainer.style.border = '2px solid lime';
      hitbox = true;
    }
    else{
      tip.style.backgroundColor = '';
      document.getElementById("playerhitbox").style.border = '0px solid red';
      playercontainer.style.border = '0px solid lime';
      hitbox = false;
    }
  }
  if (event.key.toLowerCase() === "b") {
    debounce(() => {
      if (shop.style.visibility == "hidden" && health != 0 && leaderboard.style.visibility == "hidden" && chattalk.style.visibility == "hidden" && custoboard.style.visibility == "hidden"){
        showshop();
        pause = true;
        backgroundmusic.pause();
      } else {

          hideshop();
        if (health != 0 && leaderboard.style.visibility == "hidden" && chattalk.style.visibility == "hidden" && custoboard.style.visibility == "hidden"){
          pause = false;
          backgroundmusic.volume = 0.5;
          backgroundmusic.play();
        }

      }
    }, debounceDelay);
  }
  if (event.key==="Enter") {

      if(chattalk.style.visibility == "visible"){
        chatsend()
      }

  }
}
function touchscreenshop(){
  debounce(() => {
    if (shop.style.visibility == "hidden" && health != 0 && leaderboard.style.visibility == "hidden" && chattalk.style.visibility == "hidden" && custoboard.style.visibility == "hidden"){
      showshop();
      pause = true;
      backgroundmusic.pause();
    } else {

        hideshop();
      if (health != 0 && leaderboard.style.visibility == "hidden" && chattalk.style.visibility == "hidden" && custoboard.style.visibility == "hidden"){
        pause = false;
        backgroundmusic.volume = 0.5;
        backgroundmusic.play();
      }

    }
  }, debounceDelay);
}
function movement() {
  if (!pause){
    mobs = document.querySelectorAll('.mob1,.boss1');
    turrets = document.querySelectorAll('.turret1');
    texts = document.querySelectorAll('.hittext');

    if (keys['d']&&keys['w']) {
      backgroundX -= diagonalmoveSpeed;
      backgroundY += diagonalmoveSpeed;
      mobs.forEach(mob => {
        dw(mob);
      });
      turrets.forEach(turret => {
        dw(turret);
      });
      texts.forEach(text =>{dw(text);});
    }
    else if (keys['d']&&keys['s']) {
      backgroundX -= diagonalmoveSpeed;
      backgroundY -= diagonalmoveSpeed;
      mobs.forEach(mob => {
        ds(mob);
      });
      turrets.forEach(turret => {
        ds(turret);
      });
      texts.forEach(text =>{ds(text);});
    }
    else if (keys['a']&&keys['s']) {
      backgroundX += diagonalmoveSpeed;
      backgroundY -= diagonalmoveSpeed;
      mobs.forEach(mob => {
       as(mob);
      });
      turrets.forEach(turret => {
        as(turret);
      });
      texts.forEach(text =>{as(text);});
    }
    else if (keys['a']&&keys['w']) {
      backgroundX += diagonalmoveSpeed;
      backgroundY += diagonalmoveSpeed;
      mobs.forEach(mob => {
        aw(mob);
      });
      turrets.forEach(turret => {
        aw(turret);
      });
      texts.forEach(text =>{aw(text);});
    }
    else if (keys['w']) {
      backgroundY += moveSpeed;
      mobs.forEach(mob => {
       w(mob);
      });
      turrets.forEach(turret => {
        w(turret);
      });
      texts.forEach(text =>{w(text);});
    }
    else if (keys['a']) {
      backgroundX += moveSpeed;
      mobs.forEach(mob => {
        a(mob);
      });
      turrets.forEach(turret => {
        a(turret);
      });
      texts.forEach(text =>{a(text);});
    }
    else if (keys['s']) {
      backgroundY -= moveSpeed;
      mobs.forEach(mob => {
        s(mob);
      });
      turrets.forEach(turret => {
        s(turret);
      });
      texts.forEach(text =>{s(text);});
    }
    else if (keys['d']) {
      backgroundX -= moveSpeed;
      mobs.forEach(mob => {
        d(mob);
      });
      turrets.forEach(turret => {
        d(turret);
      });
      texts.forEach(text =>{d(text);});
    }
  }
    updatebackground();
    updateMobsPosition();
    requestAnimationFrame(movement);

}
function createMob() {
  if (mobCountID<50){
    var mob = document.createElement('div');

    mob.innerHTML = 100 + (attrition);
    mob.id = `mob${mobCount}`;
    mob.wastouching = false;
    mob.touchtimeout = false;
    mob.damageCooldown = false;
    mob.damage = 5+ Math.floor((attrition*0.005));

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    var passedtest = false;
    while (!passedtest){
      randomX = Math.round(Math.random() * screenWidth);
      randomY = Math.round(Math.random() * screenHeight);
      if (Number(Math.hypot(randomX - playerX, randomY - playerY)) > 800){
        passedtest = true;
      }
    }
    mob.style.top = randomY + 'px';
    mob.style.left = randomX + 'px';
    document.body.appendChild(mob);
    /*if (mobCountID == 1){
      mob.className = "boss1";
      mob.point = 0;
      const objBPos = {
        x: mob.offsetLeft + mob.offsetWidth / 2,
        y: mob.offsetTop + mob.offsetHeight / 2
      };
      let angleRad = Math.atan2(playerCenter.x - objBPos.x, -(playerCenter.y - objBPos.y));
      let angleDeg = angleRad * (180 / Math.PI);
      var targetan = angleDeg;
      var curan = Number(mob.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
      var angleDiff = targetan - curan;
      mob.style.transform = `rotate(${targetan}deg)`;
      mob.movex = 0
      mob.movey = 0;
    }
    else{
    }*/
    mob.className = "mob1";
    mob.style.backgroundImage = 'url('+localStorage.getItem("newmobimg")+')';

    mobCount++;
    mobCountID++;
  }
}
function updateMobsPosition() {
  mobs = document.querySelectorAll('.mob1,.boss1');
  turrets = document.querySelectorAll('.turret1');

  if (!pause){
    mobs.forEach(mob => {
      if (mob.classList.contains("boss1")){
        bossmoveTowards(mob,playerX,playerY);
      }
      else{
        moveTowards(mob, playerX, playerY);
      }
    });
    turrets.forEach(turret=>{
      turretmove(turret,turret.spawnx,turret.spawny);
    });
  }
}
function turretmove(obj,playerX,playerY){
  let objX = parseFloat(obj.style.left) || 0;
  let objY = parseFloat(obj.style.top) || 0;

  const deltaX = playerX - objX;
  const deltaY = playerY - objY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance > 0.75) {
    const ratio = 0.75 / distance;
    const moveX = deltaX * ratio*1.7;
    const moveY = deltaY * ratio*1.7;

    obj.style.left = objX + moveX + "px";
    obj.style.top = objY + moveY + "px";
  }
}
function bossmoveTowards(obj, playerX, playerY) {

  let objX = parseFloat(obj.style.left) || 0;
  let objY = parseFloat(obj.style.top) || 0;

  const objBPos = {
      x: obj.offsetLeft + obj.offsetWidth / 2,
      y: obj.offsetTop + obj.offsetHeight / 2
  };
  let angleRad = Math.atan2(playerCenter.x - objBPos.x, -(playerCenter.y - objBPos.y));
  let angleDeg = angleRad * (180 / Math.PI);
  var targetan = angleDeg;
  var curan = Number(obj.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
  var angleDiff = targetan - curan;
  
  var t = 0.05;
  
    if ((Number(Math.hypot(objX - playerX, objY - playerY)) > 500 && Math.abs(angleDiff) < 1) || obj.movex == 0) {
      obj.point = 0;
      const deltaX = playerX - objX;
      const deltaY = playerY - objY;
      const distance = Math.hypot(deltaX, deltaY);
      const ratio = 3 / distance;
      obj.movex = deltaX * ratio;
      obj.movey = deltaY * ratio;
    }
    else if (Number(Math.hypot(objX - playerX, objY - playerY)) > 500 && Math.abs(angleDiff) > 1 && obj.movex != 0){
      obj.movex = 0;
      obj.movey = 0;
      if (obj.point == 0){
        obj.point = targetan;
      }
      lerpedAngle = lerpAngle(curan, obj.point, t);
      obj.style.transform = `rotate(${lerpedAngle}deg)`;
    }
    obj.style.left = objX + obj.movex + "px";
    obj.style.top = objY + obj.movey + "px";

}
function moveTowards(obj, playerX, playerY) {

  let objX = parseFloat(obj.style.left) || 0;
  let objY = parseFloat(obj.style.top) || 0;


    const deltaX = playerX - objX;
    const deltaY = playerY - objY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > 0.75) {
      const ratio = 0.75 / distance;
      const moveX = deltaX * ratio;
      const moveY = deltaY * ratio;

      obj.style.left = objX + moveX + "px";
      obj.style.top = objY + moveY + "px";

    }

  const objBPos = {
      x: obj.offsetLeft + obj.offsetWidth / 2,
      y: obj.offsetTop + obj.offsetHeight / 2
  };

  let angleRad = Math.atan2(playerCenter.x - objBPos.x, -(playerCenter.y - objBPos.y));
  let angleDeg = angleRad * (180 / Math.PI);
  var targetan = angleDeg;
  var curan = Number(obj.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
  var angleDiff = targetan - curan;

  var t = 0.05;
  if (damaged(document.getElementById("playerhitbox"), obj) && obj.wastouching == false) {
      obj.wastouching = true;
  } else {
      if (obj.wastouching == true) {
         if (Math.abs(angleDiff) <2 && obj.touchtimeout){
            obj.wastouching = false;

        }
      }
  }

  if (!damaged(document.getElementById("playerhitbox"), obj)) {
      if (obj.wastouching == true && Math.abs(angleDiff) >1) {
          obj.touchtimeout = true;
          lerpedAngle = lerpAngle(curan, targetan, t);
          obj.style.transform = `rotate(${lerpedAngle}deg)`;

      } else {
          obj.touchtimeout = false;
          obj.style.transform = `rotate(${angleDeg}deg)`;
      }
  }


   turrets = document.querySelectorAll('.turret1');
   turrets.forEach(turret=>{
     let currentRotation = parseInt(turret.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
     currentRotation += 1;
     turret.style.transform = `rotate(${currentRotation}deg)`;
   });
}
//dw, ds, as, and aw are the directional keys, w, a , s,d
//they are opposite of the direction because it is moving away from player so opposite the player movement
function dw(obj){
  let objX = parseFloat(obj.style.left) || 0;
  let objY = parseFloat(obj.style.top) || 0;
  objX -= diagonalmoveSpeed;
  objY += diagonalmoveSpeed;
  obj.style.top = objY + "px";
  obj.style.left = objX + "px";
}
function ds(obj){
  let objX = parseFloat(obj.style.left) || 0;
  let objY = parseFloat(obj.style.top) || 0;
  objX -= diagonalmoveSpeed;
  objY -= diagonalmoveSpeed;
  obj.style.top = objY + "px";
  obj.style.left = objX + "px";
}
function as(obj){
  let objX = parseFloat(obj.style.left) || 0;
  let objY = parseFloat(obj.style.top) || 0;
  objX += diagonalmoveSpeed;
  objY -= diagonalmoveSpeed;
  obj.style.top = objY + "px";
  obj.style.left = objX + "px";
}
function aw(obj){
  let objX = parseFloat(obj.style.left) || 0;
  let objY = parseFloat(obj.style.top) || 0;
  objX += diagonalmoveSpeed;
  objY += diagonalmoveSpeed;
  obj.style.top = objY + "px";
  obj.style.left = objX + "px";
}
function w(obj){
  let objY = parseFloat(obj.style.top) || 0;
  objY -= -moveSpeed;
  obj.style.top = objY + "px";
}
function s(obj){
  let objY = parseFloat(obj.style.top) || 0;
  objY -= moveSpeed;
  obj.style.top = objY + "px";
}
function a(obj){
  let objX = parseFloat(obj.style.left) || 0;
  objX -= -moveSpeed;
  obj.style.left = objX + "px";
}
function d(obj){
  let objX = parseFloat(obj.style.left) || 0;
  objX -= moveSpeed;
  obj.style.left = objX + "px";
}

//other functions
function lerp(start, end, speed){
  return start+(end-start)*speed;
}
function lerpAngle(startAngle, targetAngle, t) {
    startAngle = (startAngle + 180) % 360 - 180;
    targetAngle = (targetAngle + 180) % 360 - 180;

    var angleDiff = targetAngle - startAngle;
    if (angleDiff > 180) {
        angleDiff -= 360;
    } else if (angleDiff < -180) {
        angleDiff += 360;
    }

    var newAngle = startAngle + angleDiff * t;
    newAngle = (newAngle + 360) % 360;

    return newAngle;
}
function knockback(mob, playerX, playerY,maxdis) {
    let mobX = parseFloat(mob.style.left) || 0;
    let mobY = parseFloat(mob.style.top) || 0;

    var deltaX = playerX - mobX;
    var deltaY = playerY - mobY;
    var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    let speed = 5;
    var stepX = (deltaX / distance) * speed;
    var stepY = (deltaY / distance) * speed;

    function moveMob() {
      deltaX = playerX - mobX;
      deltaY = playerY - mobY;
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance > maxdis) { 
          cancelAnimationFrame(animationId); 
          return;
      }
      if (mobX>=playerX){
        mobX = lerp(mobX, playerX, stepX / distance);

      }
      else{
        mobX = lerp(mobX, playerX, -stepX / distance);
      }
      if (mobY>=playerY){
        mobY = lerp(mobY, playerY, stepY / distance);
      }
      else{
        mobY = lerp(mobY, playerY, -stepY / distance);
      }
      if (mob.hastext) {

          text = document.getElementById(mob.id+"hittext");

              let textX = parseFloat(text.style.left) || 0;
              let textY = parseFloat(text.style.top) || 0;

              if (mobX>=playerX){
                textX = lerp(textX, playerX, stepX*0.5 / distance);

              }
              else{
                textX = lerp(textX, playerX, -stepX*0.5 / distance);
              }
              if (mobY>=playerY){
                textY = lerp(textY, playerY, stepY*0.5 / distance);
              }
              else{
                textY = lerp(textY, playerY, -stepY*0.5 / distance);
              }
              text.style.left = textX + 'px';
              text.style.top = textY + 'px';
      }

        // Update mob's style
        mob.style.left = mobX + 'px';
        mob.style.top = mobY + 'px';

        animationId = requestAnimationFrame(moveMob); 

    }

    // Start the animation
    var animationId = requestAnimationFrame(moveMob);
    setTimeout(function(){
       cancelAnimationFrame(animationId); 
       moveTowards(mob, playerX, playerY);
    },300)

}
function damaged(player, mob) {
      if (mob != null) {
        hitbox1 = player.getBoundingClientRect();
        hitbox2 = mob.getBoundingClientRect();
        return !(
          hitbox1.top > hitbox2.bottom ||
          hitbox1.right < hitbox2.left ||
          hitbox1.bottom < hitbox2.top ||
          hitbox1.left > hitbox2.right
        );
      }
}

//spawning turrets
function spawnturret(){
  hideshop();

  setTimeout(function(){
    //lets keep that until we make a real death screen ig
    //imma add a temporary localStorage.clear button for testing

    pause = true;
    const torret = document.createElement('div');
    torret.spawnx = -69;
    torret.spawny = -69;
    torret.className="turret1";
    torret.zIndex = -3;
    torret.style.backgroundImage = 'url('+localStorage.getItem("newturretimg")+')';
    //where did turret initialization go
    document.body.appendChild(torret);//buy the second one tell me how much your coins go down by what u do to the turret
    const mouseMoveHandler = spawningturret => {
        torret.zIndex = 3;
        const mouseX = spawningturret.clientX;
        const mouseY = spawningturret.clientY;
        torretX = torret.style.left;
        torretY = torret.style.top;
        torretX = mouseX;
        torretY = mouseY;

        torret.style.left = torretX + "px";
        torret.style.top = torretY + "px";

    };

    const doubleClickHandler = placeturret => {
      localStorage.setItem("turret", false);
        torret.spawnx = torretX;
        torret.spawny = torretY;

        localStorage.setItem("allturretx",localStorage.getItem("allturretx")+","+String(torretX))
        localStorage.setItem("allturrety",localStorage.getItem("allturrety")+","+String(torretY))

        pause = false;
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("dblclick", doubleClickHandler);
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("dblclick", doubleClickHandler);
  },500);

}
function turrethitmob(){
  turrets = document.querySelectorAll('.turret1');
  mobs = document.querySelectorAll('.mob1,.boss1');
  turrets.forEach(turret=>{
    mobs.forEach(obj =>{
      let objX = parseFloat(obj.style.left) || 0;
      let objY = parseFloat(obj.style.top) || 0;
        if (damaged(turret, obj) && !obj.damageCooldown && turret.spawnx != -69 && turret.spawny != -69) {
          if (!obj.classList.contains("boss1")){
           obj.style.backgroundImage = 'url('+localStorage.getItem("newmobimg")+')';
           setTimeout(() => {
             mob.style.backgroundImage = 'url('+localStorage.getItem("newmobhurtimg")+')';
           }, 1000);
           }
           obj.innerHTML -= Math.floor(turretdmg*damagemult);
           hitdamagetext(obj, objX,objY, Number(Math.floor(turretdmg*damagemult)),false);


           if (obj.innerHTML <= 0) {
             var killsound = new Audio("killsound.mp3");
             killsound.volume = 0.5;
             killsound.play();
             attrition += Math.ceil(mobKills/8);
              localStorage.setItem("attrition",attrition);
              document.getElementById("attritionint").innerHTML = attrition + "%";
             obj.remove();
             mobKills += 1;
             localStorage.setItem("mobkills",mobKills);
             document.getElementById("killint").innerHTML = mobKills;
             coins += Math.floor(coinsmultiplier*(Math.floor(Math.random() * 2) +2));
             document.getElementById("coinint").innerHTML = coins;
             localStorage.setItem("coins", coins);
             mobKills = Number(localStorage.getItem("mobkills"));
             localStorage.setItem("mobkills",mobKills);
             document.getElementById("killint").innerHTML = mobKills;
             attrition += Math.ceil(mobKills/4);
             localStorage.setItem("attrition",attrition);
             document.getElementById("attritionint").innerHTML = attrition + "%";
             //mobCount--;
             mobCountID--;
           }

         }
    });
   });
}

//damagetexts
function hitdamagetext(obj, objX, objY, damage, isbigguy){
   const hittext = document.createElement('div');
   hittext.innerHTML = damage;
   if (damage <= 20){
     hittext.style.color = "orange";
   }
  else if (damage > 20 && damage <=50){
    hittext.style.color = "orangered"; //redorange
  }
  else if (damage>50 && damage<=150){
    hittext.style.color = "red";
  }
  else if (damage>150 && damage<=300){
    hittext.style.color = "#50C878";
  }
  else if (damage>300 && damage<=600){
    hittext.style.color = "#BF40BF";
  }
  else if(damage>600 && damage<=1000){
    hittext.style.color = "#E6E6FA";
  }
  else if (damage > 1000 && damage<=3000){
    hittext.style.color = "#0096FF";
  }
  else{
    hittext.style.color = "#FFD700";
  }
   hittext.id = obj.id + "hittext";

  if (isbigguy){
    hittext.className = "crittext";
    hittext.style.color = "#00ff2a";
  }
  else{
    hittext.className = "hittext";
  }
   hittext.style.left = objX + "px";
   hittext.style.top = (objY+40) + "px";
   document.body.appendChild(hittext);
    obj.hastext = true;
  hittext.classList.add("hoverup");
  setTimeout(function(){
    hittext.classList.remove("hoverup");
    setTimeout(function(){
      hittext.classList.add("hoverdis");
      setTimeout(function(){hittext.remove();obj.hastext = false;},180);
    },100);
  },200);

}

//SHOPUPGRADES
function buyAttack(){
  attack = Number(localStorage.getItem("attack"));
  coins = Number(localStorage.getItem("coins"));
  if (coins >= localStorage.getItem("attackcost")) {
    coins -= Number(localStorage.getItem("attackcost"));
    localStorage.setItem("coins", coins);

    attack = Math.floor(attack*1.5);
    localStorage.setItem("attack", attack);
    localStorage.setItem("attacklvl", Number(localStorage.getItem("attacklvl")) + 1);
    localStorage.setItem("attackcost",Number(localStorage.getItem("attackcost"))*2);
    document.getElementById("priceone").innerHTML = "$" + Number(localStorage.getItem("attackcost"));
    document.getElementById("levelone").innerHTML = "LVL: "+Number(localStorage.getItem("attacklvl"));
    document.getElementById("coinint").innerHTML = coins;
  }
}
function buymovement(){
  moveSpeed = Number(localStorage.getItem("moveSpeed"));
  coins = Number(localStorage.getItem("coins"));
  if (coins >= localStorage.getItem("speedcost") && localStorage.getItem("speedlvl")<3) {
    coins = coins - localStorage.getItem("speedcost");
    document.getElementById("coinint").innerHTML = coins;
    localStorage.setItem("coins", coins);
    moveSpeed = moveSpeed + 1;
    localStorage.setItem("moveSpeed", moveSpeed);
    diagonalmoveSpeed = Math.sqrt(2 * Math.pow(moveSpeed, 2))/2;
    localStorage.setItem("speedlvl", Number(localStorage.getItem("speedlvl")) + 1);
    localStorage.setItem("speedcost",Number(localStorage.getItem("speedcost"))*3);

    document.getElementById("pricetwo").innerHTML = "$" + Number(localStorage.getItem("speedcost"));
    if (localStorage.getItem("speedlvl") == 3){
      document.getElementById("leveltwo").innerHTML = "MAX";
    }
    else{
      document.getElementById("leveltwo").innerHTML = "LVL: "+Number(localStorage.getItem("speedlvl"));
    }
  }
}
function buyturret(){
  moveSpeed = Number(localStorage.getItem("moveSpeed"));
  coins = Number(localStorage.getItem("coins"));
  if (coins >= localStorage.getItem("turretcost") && localStorage.getItem("turretlvl")<=9) {
    coins = coins - localStorage.getItem("turretcost");
    document.getElementById("coinint").innerHTML = coins;
    localStorage.setItem("coins", coins);

    localStorage.setItem("turretlvl", Number(localStorage.getItem("turretlvl")) + 1);
    localStorage.setItem("turretcost",Number(localStorage.getItem("turretcost"))*3);
    turretdmg *= 2;
    localStorage.setItem("turretdmg",Number(localStorage.getItem("turretdmg"))*2);
    document.getElementById("pricethree").innerHTML = "$" + Number(localStorage.getItem("turretcost"));
    if (localStorage.getItem("turretlvl") == 10){
      document.getElementById("levelthree").innerHTML = "MAX";
    }
    else{
      document.getElementById("levelthree").innerHTML = "LVL: "+Number(localStorage.getItem("turretlvl"));
    }
    spawnturret();
    localStorage.setItem("turret", true);
  }
}
function buyregeneration(){
  regen = Number(localStorage.getItem("regen"));
  coins = Number(localStorage.getItem("coins"));
  if (coins >= localStorage.getItem("regencost")) {
    coins -= Number(localStorage.getItem("regencost"));
    localStorage.setItem("coins", coins);


    regen += Math.ceil(localStorage.getItem("regenlvl")*1.2);
    localStorage.setItem("regen", regen);
    localStorage.setItem("regenlvl", Number(localStorage.getItem("regenlvl")) + 1);
    localStorage.setItem("regencost",Number(localStorage.getItem("regencost"))*4);
    document.getElementById("pricefour").innerHTML = "$" + Number(localStorage.getItem("regencost"));
    document.getElementById("levelfour").innerHTML = "LVL: "+Number(localStorage.getItem("regenlvl"));
    document.getElementById("coinint").innerHTML = coins;
  }
}
function buystarthealth(){
  starthealth = Number(localStorage.getItem("starthealth"));
  coins = Number(localStorage.getItem("coins"));
  if (coins >= localStorage.getItem("starthealthcost")) {
    coins -= Number(localStorage.getItem("starthealthcost"));
    localStorage.setItem("coins", coins);


    starthealth += Math.floor(175*localStorage.getItem("starthealthlvl")/2);
    health += Math.floor(0.25*starthealth);
    maxHealth = starthealth;
    localStorage.setItem("starthealth", starthealth);
    localStorage.setItem("starthealthlvl", Number(localStorage.getItem("starthealthlvl")) + 1);
    localStorage.setItem("starthealthcost",Number(localStorage.getItem("starthealthcost"))*5);
    startattrition += 75 * ((parseInt(localStorage.getItem("starthealthlvl")) - 1) * (parseInt(localStorage.getItem("starthealthlvl")) - 1));
    startkills += 15 * ((parseInt(localStorage.getItem("starthealthlvl")) - 1) * (parseInt(localStorage.getItem("starthealthlvl")) - 1));

    localStorage.setItem("startattrition",startattrition);
    localStorage.setItem("startkills",startkills);
    document.getElementById("pricefive").innerHTML = "$" + Number(localStorage.getItem("starthealthcost"));
    document.getElementById("levelfive").innerHTML = "LVL: "+Number(localStorage.getItem("starthealthlvl"));
    document.getElementById("coinint").innerHTML = coins;
  }
}
function buystartcoin(){
  startcoin = Number(localStorage.getItem("startcoin"));
  coins = Number(localStorage.getItem("coins"));
  if (coins >= localStorage.getItem("startcoincost")) {
    coins -= Number(localStorage.getItem("startcoincost"));
    localStorage.setItem("coins", coins);


    startcoin *= 2.4;
    startcoin += Math.floor(80*localStorage.getItem("startcoinlvl")*localStorage.getItem("startcoinlvl"));
    localStorage.setItem("startcoin", Math.floor(startcoin));
    localStorage.setItem("startcoinlvl", Number(localStorage.getItem("startcoinlvl")) + 1);
    localStorage.setItem("startcoincost",Number(localStorage.getItem("startcoincost"))*3.5 + Math.floor(85*localStorage.getItem("startcoinlvl")*localStorage.getItem("startcoinlvl")));

    startattrition += 75 * ((parseInt(localStorage.getItem("startcoinlvl")) - 1) * (parseInt(localStorage.getItem("startcoinlvl")) - 1));
    startkills += 15 * ((parseInt(localStorage.getItem("startcoinlvl")) - 1) * (parseInt(localStorage.getItem("startcoinlvl")) - 1));

    localStorage.setItem("startattrition",startattrition);
    localStorage.setItem("startkills",startkills);
    document.getElementById("pricesix").innerHTML = "$" + Number(localStorage.getItem("startcoincost"));
    document.getElementById("levelsix").innerHTML = "LVL: "+Number(localStorage.getItem("startcoinlvl"));
    document.getElementById("coinint").innerHTML = coins;
  }
}
function buycperenemey(){
  cperenemey = Number(localStorage.getItem("cperenemey"));
  coins = Number(localStorage.getItem("coins"));
  if (coins >= localStorage.getItem("cperenemeycost")) {
    coins -= Number(localStorage.getItem("cperenemeycost"));
    localStorage.setItem("coins", coins);


    coinsmultiplier *= 4.20/2.05;
    localStorage.setItem("cperenemey", Math.floor(coinsmultiplier));
    localStorage.setItem("cperenemeylvl", Number(localStorage.getItem("cperenemeylvl")) + 1);
    localStorage.setItem("cperenemeycost",Number(localStorage.getItem("cperenemeycost"))*3);
    document.getElementById("priceseven").innerHTML = "$" + Number(localStorage.getItem("cperenemeycost"));
    document.getElementById("levelseven").innerHTML = "LVL: "+Number(localStorage.getItem("cperenemeylvl"));
    document.getElementById("coinint").innerHTML = coins;
  }
}
function buycritdamage(){
  critdamage = Number(localStorage.getItem("critdamage"));
  coins = Number(localStorage.getItem("coins"));
  if (coins >= localStorage.getItem("critdamagecost")) {
    coins -= Number(localStorage.getItem("critdamagecost"));
    localStorage.setItem("coins", coins);


    critmult *= 1.5;
    localStorage.setItem("critdamage", critmult);
    localStorage.setItem("critdamagelvl", Number(localStorage.getItem("critdamagelvl")) + 1);
    localStorage.setItem("critdamagecost",Math.floor(Number(localStorage.getItem("critdamagecost"))*3.5));
    document.getElementById("priceeight").innerHTML = "$" + Number(localStorage.getItem("critdamagecost"));
    document.getElementById("leveleight").innerHTML = "LVL: "+Number(localStorage.getItem("critdamagelvl"));
    document.getElementById("coinint").innerHTML = coins;
  }
}
function buycritpercent(){
  critchance = Number(localStorage.getItem("critchance"));
  coins = Number(localStorage.getItem("coins"));
  if (coins >= localStorage.getItem("critchancecost")) {
    coins -= Number(localStorage.getItem("critchancecost"));
    localStorage.setItem("coins", coins);


    critchance += 5;
    if (critchance >50){
      critchance = 50;
    }
    localStorage.setItem("critchance", critchance);
    localStorage.setItem("critchancelvl", Number(localStorage.getItem("critchancelvl")) + 1);
    localStorage.setItem("critchancecost",Math.floor(Number(localStorage.getItem("critchancecost"))*4));
    document.getElementById("pricenine").innerHTML = "$" + Number(localStorage.getItem("critchancecost"));
    document.getElementById("levelnine").innerHTML = "Chance: "+Number(localStorage.getItem("critchance")) + "%";
    document.getElementById("coinint").innerHTML = coins;
  }
}
function buydmgmult(){
  damagemult = Number(localStorage.getItem("startdamagemult"));
  coins = Number(localStorage.getItem("coins"));
  if (coins >= localStorage.getItem("startdamagemultcost")) {
    coins -= Number(localStorage.getItem("startdamagemultcost"));
    localStorage.setItem("coins", coins);

    damagemult = Number(damagemult)*1.75;
    damagemult += 0.1*localStorage.getItem("startdamagemultlvl")*localStorage.getItem("startdamagemultlvl");
    localStorage.setItem("startdamagemult", damagemult);
    localStorage.setItem("startdamagemultlvl", Number(localStorage.getItem("startdamagemultlvl")) + 1);
    localStorage.setItem("startdamagemultcost",Number(localStorage.getItem("startdamagemultcost"))*4);

    startattrition += 25 * ((parseInt(localStorage.getItem("startcoinlvl")) - 1) * (parseInt(localStorage.getItem("startcoinlvl")) - 1));
    startkills += 5 * ((parseInt(localStorage.getItem("startcoinlvl")) - 1) * (parseInt(localStorage.getItem("startcoinlvl")) - 1));

    localStorage.setItem("startattrition",startattrition);
    localStorage.setItem("startkills",startkills);
    document.getElementById("priceten").innerHTML = "$" + Number(localStorage.getItem("startdamagemultcost"));
    document.getElementById("levelten").innerHTML = "LVL: "+Number(localStorage.getItem("startdamagemultlvl"));
    document.getElementById("coinint").innerHTML = coins;
  }
}

//restart reset button
function gameRESTART(){
  localStorage.setItem("starthealthlvl", 1);
  localStorage.setItem("name","");
  localStorage.setItem("startattrition",0);
  localStorage.setItem("startkills",0);
    localStorage.setItem("starthealthcost", 100);
    localStorage.setItem("starthealth", 100)
    localStorage.setItem("startcoinlvl", 1);
    localStorage.setItem("startcoincost", 800);
    localStorage.setItem("startcoin", 500)
    localStorage.setItem("startdamagemultlvl", 1);
    localStorage.setItem("startdamagemultcost", 450);
    localStorage.setItem("startdamagemult", 1)
  localStorage.setItem("health",0);
  localStorage.setItem("newplayerimg", "playersword.png");
  localStorage.setItem("newplayerhurtimg","playerhurt.png");
  localStorage.setItem("newmobimg","enemy1.png");
  localStorage.setItem("newmobhurtimg","enemy1hurt.png");
  localStorage.setItem("newturretimg","sawblade.png");
  //why reset this no point keep it until we make a revert imgs button
  window.open(window.location.href, "_self");
}

//leaderboard
function sortLeaderboard(leaderboard) {
    return leaderboard.sort(function(a, b) {
        return b.score - a.score;
    });
}
function coinsleaderboard(){
  section.innerHTML = "Coins";
  document.getElementById("coinslead").style.border = "2px solid lightgreen";
  document.getElementById("mobkilllead").style.border = "2px solid black";
  document.getElementById("attritionlead").style.border = "2px solid black";
  document.getElementById("healthlead").style.border = "2px solid black";

  var textLines = []
  fetch('leaderboard.txt')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text();
  })
  .then(data => {
    textLines = data.split('\n')
    var leaderboard = [

    ];
    for(i=1;i<textLines.length;i+=5){
      leaderboard.push({ name: textLines[i-1], score: textLines[i] })
    }
  leaderboard = sortLeaderboard(leaderboard);
  innertable.innerHTML = "";
  leaderboard.forEach(function(player, index) {
    console.log(`${index + 1}. ${player.name}: ${player.score}`);
    var row = document.createElement('tr');
    //ranking
    var indexCell = document.createElement('td');
    indexCell.innerHTML = index + 1;
    row.appendChild(indexCell);
    //nameofbro
    var nameCell = document.createElement('td');
    nameCell.classList.add("namestuf");
    nameCell.innerHTML = player.name;
    if (player.name == localStorage.getItem("name")){
      nameCell.style.color = "lightgreen";
      nameCell.style.fontWeight = "bold";
    }
    row.appendChild(nameCell);
    //hisscore
    var coinsCell = document.createElement('td');
    coinsCell.innerHTML = player.score;
    row.appendChild(coinsCell);
    //plzworkdaddy
    innertable.appendChild(row);

  });
    //var leaderboardString = JSON.stringify(leaderboardtext);
    //alert(leaderboardString);

  //replace with document.getElementById later
  })
  .catch(error => {
      console.error('There was a problem with fetching the text file:', error);
  });
}
function mobkillsleaderboard(){
  section.innerHTML = "Kills";
  document.getElementById("coinslead").style.border = "2px solid black";
  document.getElementById("mobkilllead").style.border = "2px solid lightgreen";
  document.getElementById("attritionlead").style.border = "2px solid black";
  document.getElementById("healthlead").style.border = "2px solid black";

  var textLines = []
  fetch('leaderboard.txt')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text();
  })
  .then(data => {
    textLines = data.split('\n')
    var leaderboard = [

    ];
    for(i=2;i<textLines.length;i+=5){
      leaderboard.push({ name: textLines[i-2], score: textLines[i] })
    }
  leaderboard = sortLeaderboard(leaderboard);
  innertable.innerHTML = "";
  leaderboard.forEach(function(player, index) {
    console.log(`${index + 1}. ${player.name}: ${player.score}`);
    var row = document.createElement('tr');
    //ranking
    var indexCell = document.createElement('td');
    indexCell.innerHTML = index + 1;
    row.appendChild(indexCell);
    //nameofbro
    var nameCell = document.createElement('td');
    nameCell.classList.add("namestuf");
    nameCell.innerHTML = player.name;
    if (player.name == localStorage.getItem("name")){
      nameCell.style.color = "lightgreen";
      nameCell.style.fontWeight = "bold";
    }
    row.appendChild(nameCell);
    //hisscore
    var coinsCell = document.createElement('td');
    coinsCell.innerHTML = player.score;
    row.appendChild(coinsCell);
    //plzworkdaddy
    innertable.appendChild(row);

  });
    //var leaderboardString = JSON.stringify(leaderboardtext);
    //alert(leaderboardString);

  //replace with document.getElementById later
  })
  .catch(error => {
      console.error('There was a problem with fetching the text file:', error);
  });
}
function attritionleaderboard(){
  section.innerHTML = "Attrition";
  document.getElementById("coinslead").style.border = "2px solid black";
  document.getElementById("mobkilllead").style.border = "2px solid black";
  document.getElementById("attritionlead").style.border = "2px solid lightgreen";
  document.getElementById("healthlead").style.border = "2px solid black";

  var textLines = []
  fetch('leaderboard.txt')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text();
  })
  .then(data => {
    textLines = data.split('\n')
    var leaderboard = [

    ];
    for(i=3;i<textLines.length;i+=5){
      leaderboard.push({ name: textLines[i-3], score: textLines[i] })
    }
  leaderboard = sortLeaderboard(leaderboard);
  innertable.innerHTML = "";
  leaderboard.forEach(function(player, index) {
    console.log(`${index + 1}. ${player.name}: ${player.score}%`);
    var row = document.createElement('tr');
    //ranking
    var indexCell = document.createElement('td');
    indexCell.innerHTML = index + 1;
    row.appendChild(indexCell);
    //nameofbro
    var nameCell = document.createElement('td');
    nameCell.classList.add("namestuf");
    nameCell.innerHTML = player.name;
    if (player.name == localStorage.getItem("name")){
      nameCell.style.color = "lightgreen";
      nameCell.style.fontWeight = "bold";
    }
    row.appendChild(nameCell);
    //hisscore
    var coinsCell = document.createElement('td');
    coinsCell.innerHTML = player.score;
    row.appendChild(coinsCell);
    //plzworkdaddy
    innertable.appendChild(row);

  });
    //var leaderboardString = JSON.stringify(leaderboardtext);
    //alert(leaderboardString);

  //replace with document.getElementById later
  })
  .catch(error => {
      console.error('There was a problem with fetching the text file:', error);
  });
}
function healthleaderboard(){
  section.innerHTML = "Health";
  document.getElementById("coinslead").style.border = "2px solid black";
  document.getElementById("mobkilllead").style.border = "2px solid black";
  document.getElementById("attritionlead").style.border = "2px solid black";
  document.getElementById("healthlead").style.border = "2px solid lightgreen";

  var textLines = []
  fetch('leaderboard.txt')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text();
  })
  .then(data => {
    textLines = data.split('\n')
    var leaderboard = [

    ];
    for(i=4;i<textLines.length;i+=5){
      leaderboard.push({ name: textLines[i-4], score: textLines[i] })
    }
  leaderboard = sortLeaderboard(leaderboard);
  innertable.innerHTML = "";
  leaderboard.forEach(function(player, index) {
    console.log(`${index + 1}. ${player.name}: ${player.score}`);
    var row = document.createElement('tr');
    //ranking
    var indexCell = document.createElement('td');
    indexCell.innerHTML = index + 1;
    row.appendChild(indexCell);
    //nameofbro
    var nameCell = document.createElement('td');
    nameCell.classList.add("namestuf");
    nameCell.innerHTML = player.name;
    if (player.name == localStorage.getItem("name")){
      nameCell.style.color = "lightgreen";
      nameCell.style.fontWeight = "bold";
    }
    row.appendChild(nameCell);
    //hisscore
    var coinsCell = document.createElement('td');
    coinsCell.innerHTML = player.score;
    row.appendChild(coinsCell);
    //plzworkdaddy
    innertable.appendChild(row);

  });
    //var leaderboardString = JSON.stringify(leaderboardtext);
    //alert(leaderboardString);

  //replace with document.getElementById later
  })
  .catch(error => {
      console.error('There was a problem with fetching the text file:', error);
  });
}
function showleaderboard(){

  if (shop.style.visibility == "hidden" && leaderboard.style.visibility == "hidden" && playmenu == false && chattalk.style.visibility == "hidden" && custoboard.style.visibility == "hidden"){

    //actuallyopentheleaderboard
    var leadButtons = document.querySelectorAll('.leadbutton');
    leadButtons.forEach(function(button) {
        button.classList.add("leadbut");
        button.style.visibility = 'visible';
    });
    leaderboard.classList.add("leaderopen");
    leaderboard.zIndex = "100";
    leaderboard.style.visibility = "visible";
    setTimeout(function(){
      leaderboard.classList.remove("leaderopen");
      leadButtons.forEach(function(button) {
          button.classList.remove("leadbut");
      });
    },500);

    var textLines = []
    fetch('leaderboard.txt')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        textLines = data.split('\n');
        console.log('Text file content:', textLines); 
        if(!textLines.includes(localStorage.getItem("name").toString())){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "save_value.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
            }
        };

        xhr.send("username=" + localStorage.getItem("name") +"\n" + localStorage.getItem("coins") + "\n" + localStorage.getItem("mobkills") + "\n" + localStorage.getItem("attrition") + "\n"+localStorage.getItem("health"));
        }
    })
    .catch(error => {
        console.error('There was a problem with fetching the text file:', error);
    });

    coinsleaderboard();
    section.innerHTML = "Coins";
    document.getElementById("coinslead").style.border = "2px solid lightgreen";
    document.getElementById("mobkilllead").style.border = "2px solid black";
    document.getElementById("attritionlead").style.border = "2px solid black";
    document.getElementById("healthlead").style.border = "2px solid black";

  }
}
function hideleaderboard(){
  if (leaderboard.style.visibility == "visible"){
    leaderboard.classList.add("leaderclose");
    var leadButtons = document.querySelectorAll('.leadbutton');
    leadButtons.forEach(function(button) {
        button.classList.add("leadbutdis");
    });
    setTimeout(function() {
      leaderboard.style.visibility = "hidden";
      leaderboard.zIndex = "-3";
      leaderboard.classList.remove("leaderclose");

      leadButtons.forEach(function(button) {
          button.style.visibility = 'hidden';
          button.classList.remove("leadbutdis");
      });
    }, 480);


  }
}
function buttonleaderboards(){
  leaderboardsave()
  debounce(() => {

    if (leaderboard.style.visibility == "hidden" && shop.style.visibility == "hidden" && health != 0 && chattalk.style.visibility == "hidden" && custoboard.style.visibility == "hidden") {

      showleaderboard();
      pause = true;
      backgroundmusic.pause();
    } else {
      if (health != 0 && shop.style.visibility == "hidden" && custoboard.style.visibility == "hidden"&& chattalk.style.visibility == "hidden"){
        hideleaderboard();
        pause = false;
        backgroundmusic.play();
      }

    }
  }, debounceDelay);
}
//chat
function chatsend(){

  if(document.getElementById("chatbox").value.trim()!=""){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "chat.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
          console.log(xhr.responseText);
      }

  };

  xhr.send("username=" + encodeURIComponent(localStorage.getItem("name")) + "\n" + encodeURIComponent(document.getElementById("chatbox").value))
  document.getElementById("chatbox").value = "";
    displaychat()
  }
}
function displaychat(){

  var textLines = []
  fetch('chat.txt')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text();
  })
  .then(data => {
    textLines = data.split('\n')
      var chat = [];
      for(i=1;i<textLines.length;i+=2){
        chat.push({ name: textLines[i-1], score: textLines[i] })
      }

    document.getElementById("innertable2").innerHTML = "";
    chat.forEach(function(player, index) {
      console.log(`${index + 1}. ${player.name}: ${player.score}`);
      var row = document.createElement('tr');
      //nameofbro
      var nameCell = document.createElement('td');
      nameCell.className = "namestuf";
      nameCell.innerHTML = player.name;
      nameCell.style.color = "red"
      if (player.name == localStorage.getItem("name")){
        nameCell.style.color = "lightgreen";
        nameCell.style.fontWeight = "bold";
      }
      row.appendChild(nameCell);
      //hisscore
      var coinsCell = document.createElement('td');
      coinsCell.innerHTML = player.score;
      row.appendChild(coinsCell);
      //plzworkdaddy
      document.getElementById("innertable2").appendChild(row);

      document.getElementById("innertable2").scrollTop = document.getElementById("innertable2").scrollHeight;
      //alert(document.getElementById("innertable2").innerHTML.split('\n'))
      // if(data.split('\n')!=document.getElementById("innertable2").innerHTML.split('\n')){
        //displaychat()
      // }
  })
})
  .catch(error => {
      console.error('There was a problem with fetching the text file:', error);
  });
}
function showchat(){
    chattalk.classList.add("leaderopen");
    chattalk.zIndex = "100";
    chattalk.style.visibility = "visible";
    setTimeout(function(){
      chattalk.classList.remove("leaderopen");
    },500);

   displaychat();
}
function hidechat(){
  if (chattalk.style.visibility == "visible"){
      chattalk.classList.add("leaderclose");

    setTimeout(function() {
      chattalk.style.visibility = "hidden";
      chattalk.zIndex = "-3";
      chattalk.classList.remove("leaderclose");
    }, 480);


  }
}
function showthechat(){
  debounce(() => {
    if (shop.style.visibility == "hidden" && health != 0 && leaderboard.style.visibility == "hidden" && chattalk.style.visibility == "hidden" && custoboard.style.visibility == "hidden"){
      showchat();
      pause = true;
      backgroundmusic.pause();
    } else {
      if (health != 0 && leaderboard.style.visibility == "hidden" && shop.style.visibility == "hidden" && custoboard.style.visibility == "hidden"){
        hidechat();
        pause = false;
        backgroundmusic.volume = 0.5;
        backgroundmusic.play();
      }

    }
  }, debounceDelay);
}

//img thingy
function checkImage(urlTocheck="", defaultValue=false){
    var image = new Image();
    image.src = urlTocheck;
    if (image.width == 0) {
       return defaultValue;
    } else {
       return urlTocheck;
    }
 }
function newimg(){
  if(document.getElementById("playerimgbox").value.trim()!=""&& checkImage(document.getElementById("playerimgbox").value.trim(),false) != false && localStorage.getItem("newplayerimg") != document.getElementById("playerimgbox").value.trim()){
    alert("playerimagechanged");
    localStorage.setItem("newplayerimg", document.getElementById("playerimgbox").value.trim());
    document.getElementById("playerimg").src = localStorage.getItem("newplayerimg");
  };
  if(document.getElementById("mobimgbox").value.trim()!=""&& checkImage(document.getElementById("mobimgbox").value.trim(),false) != false && localStorage.getItem("newmobimg") != document.getElementById("mobimgbox").value.trim()){
      alert("mobimagechanged");
    localStorage.setItem("newmobimg", document.getElementById("mobimgbox").value.trim());
    mobs = document.querySelectorAll('.mob1,.boss1');
      mobs.forEach(mob => {
      mob.style.backgroundImage = 'url('+localStorage.getItem("newmobimg")+')';
    });
  }
  if(document.getElementById("mobhurtimgbox").value.trim()!=""&& checkImage(document.getElementById("mobhurtimgbox").value.trim(),false) != false && localStorage.getItem("newmobhurtimg") != document.getElementById("mobhurtimgbox").value.trim()){

    localStorage.setItem("newmobhurtimg", document.getElementById("mobhurtimgbox").value.trim());


  }
  if(document.getElementById("playerhurtimgbox").value.trim()!=""&& checkImage(document.getElementById("playerhurtimgbox").value.trim(),false) != false && localStorage.getItem("newplayerhurtimg") != document.getElementById("playerhurtimgbox").value.trim()){

    localStorage.setItem("newplayerhurtimg", document.getElementById("playerhurtimgbox").value.trim());

  };


  if(document.getElementById("turretimgbox").value.trim()!=""&& checkImage(document.getElementById("turretimgbox").value.trim(),false) != false && localStorage.getItem("newturretimg") != document.getElementById("turretimgbox").value.trim()){
    alert("turretimagechanged");
    localStorage.setItem("newturretimg", document.getElementById("turretimgbox").value.trim());
      turrets = document.querySelectorAll(".turret1")
      turrets.forEach(turret =>{ 
      turret.style.backgroundImage = 'url('+localStorage.getItem("newturretimg")+')';
    });
  }
  //bosses
  //other gui items
  //texts maybe

}
function showcusto(){
    custoboard.classList.add("leaderopen");
    custoboard.zIndex = "100";
    custoboard.style.visibility = "visible";
    setTimeout(function(){
      custoboard.classList.remove("leaderopen");
    },500);

}
function hidecusto(){
  if (custoboard.style.visibility == "visible"){
      custoboard.classList.add("leaderclose");

    setTimeout(function() {
      custoboard.style.visibility = "hidden";
      custoboard.zIndex = "-3";
      custoboard.classList.remove("leaderclose");
    }, 480);
  }
}
function showcustoboard(){
  debounce(() => {
    if (shop.style.visibility == "hidden" && health != 0 && leaderboard.style.visibility == "hidden" && chattalk.style.visibility == "hidden" && custoboard.style.visibility == "hidden"){
      showcusto();
      pause = true;
      backgroundmusic.pause();
    } else {
      if (health != 0 && leaderboard.style.visibility == "hidden" && shop.style.visibility == "hidden" && chattalk.style.visibility == "hidden"){
        hidecusto();
        pause = false;
        backgroundmusic.volume = 0.5;
        backgroundmusic.play();
      }

    }
  }, debounceDelay);
}