<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>replit</title>
  <link rel="icon"href="playersword.png">
  <link href="style.css" rel="stylesheet" type="text/css" />
</head>

<body oncontextmenu="return false;" oncopy="return false;">
  <div id="background"></div>

  <div class = "Container" id="coinContainer">
      <img src="coin.png" width="35" height="35">
      <h2 id="coinint">0</h2>
  </div>
  <div class = "Container" id = "restartContainer">
    <button onclick = gameRESTART()><img src = "reset.png" width = 70 height = 70></button>
  </div>
  <div class = "Container" id = "leaderboardContainer">
    <button onclick = buttonleaderboards()><img src = "leaderboardbut.png" width = 70 height = 70></button>
  </div>
  <div class = "Container" id = "chatContainer">
    <button onclick = showthechat()><img src = "chatbut.png" width = 65 height = 65></button>
  </div>
  <div class = "Container" id = "shopContainer">
    <button onclick = touchscreenshop()><img src = "shop.png" width = 70 height = 70></button>
  </div>
  <div class = "Container" id = "custoContainer">
    <button onclick = showcustoboard()><img src = "custbut.png" width = 65 height = 65></button>
  </div>
  <div class = "Container" id="attritionContainer">
      <img src="attrition.png" width="35" height="35">
      <h2 id="attritionint">0</h2>
  </div>
  <div class = "Container" id="heartContainer">
      <img src="heart.png" width="35" height="35">
      <h2 id="healthint">100</h2>
      <div id = "regencont"><img src = "regensign.png" width = 20 height = 20></div>
  </div>
  <div class = "Container" id="killsContainer">
      <img src="skull.png" width="35" height="35">
      <h2 id="killint">0</h2>
  </div>

  <div id="player">
    <div id="playercontainer">
      <div id="tip"></div>
      <div id="playerhitbox"></div>
      <img id="playerimg" src="playersword.png">
    </div>
  </div>
  <div id = "shop">
    <div id = "shoptextpos"><h1 id = "shoptext">SHOP: </h1></div>
    <div id = "upgradetablecontainer"><table id = "upgradetable">
      <tr>
        <td class = "bordpr">‎</td>
        <td class = "bordpr">‎</td>
        <td class = "bordpr">‎</td>
      </tr>
      <tr> <!--Prices1-3!-->
        <td class = "prices" id = "priceone">$</td>
        <td class = "prices" id = "priceseven">$</td>
        <td class = "prices" id = "pricethree">$</td>
      </tr>
      <tr><!--Upgrades1-3 (attack, movementspeed, turrets)!-->
        <td class = "buttons"><button id="attack" onclick = buyAttack()><img width="30%" height="60%"
          src="playersword.png"><br>ATTACK</button></td>
        <td class = "buttons"><button id="cperenemey" onclick = buycperenemey()><img src = "cperenemey.png" width = "43%" height = "50%"><br>+Coins Per Kill</button></td>
        <td class = "buttons"><button id="turret"  onclick = buyturret()><img width="43%" height="50%" src="sawblade.png"><br>Turret</button></td>
      </tr>
      <tr><!--levels1-3!-->
        <td class = "levels" id = "levelone">LVL: 0</td>
        <td class = "levels" id = "levelseven"> LVL: 0</td>
        <td class = "levels" id = "levelthree"> LVL: 0</td>
      </tr>
      <tr> <!--Prices4-6!-->
        <td class = "prices" id = "pricefour">$</td>
        <td class = "prices" id = "priceeight">$</td>
        <td class = "prices" id = "pricenine">$</td>
      </tr>
      <tr><!--Upgrades4-6 (regeneration x4, starting health x5, starting coins,5)!-->
        <td class = "buttons"><button id="regeneration" onclick = buyregeneration()><img width="43%" height="50%" src="heartregen.png"><br>Regeneration</button></td>
        <td class = "buttons"><button id="critdamage" onclick = buycritdamage()><img src = "critdamage.png" width = "43%" height = "50%"><br>Crit Damage</button></td>
        <td class = "buttons"><button id="critpercent" onclick = buycritpercent()><img src = "critpercent.png" width = "43%" height = "50%"><br>Crit Chance</button></td>
      </tr>
      <tr><!--levels4-6!-->
        <td class = "levels" id = "levelfour">LVL: 0</td>
        <td class = "levels" id = "leveleight"> LVL: 0</td>
        <td class = "levels" id = "levelnine"> Chance: 0</td>
      </tr>
      <tr> <!--Prices7-9!-->
        <<td class = "prices" id = "pricetwo">$</td>
          <td class = "prices" id = "price???">$</td>
        <td class = "prices" id = "price???">$</td>
      </tr>
      <tr><!--Upgrades1-3 (attack, movementspeed, turrets)!-->
        <td class = "buttons"><button id="movementspeed"  onclick = buymovement()><img width="48%" height="54%" src="guyrunning.gif"><br>Movement</button></td>
        <td class = "buttons"><button id="tbd1">???</button></td>
        <td class = "buttons"><button id="tbd2">???</button></td>
      </tr>
      <tr><!--levels4-6!-->
        <td class = "levels" id = "leveltwo"> LVL: 0</td>
        <td class = "levels" id = "level???"">LVL: 0</td>
        <td class = "levels" id = "level???"> Lvl: 0</td>
      </tr>
      <tr>
        <td class = "bordpr">‎</td>
        <td class = "bordpr">‎</td>
        <td class = "bordpr">‎</td>
      </tr>
      <tr>#
        <td id = "shoptext2pos" colspan = "3">Permanent Upgrades:</td>
      </tr>
      <tr>
        <td class = "bordpr">‎</td>
        <td class = "bordpr">‎</td>
        <td class = "bordpr">‎</td>
      </tr>    
      <tr> <!--Prices10-12!-->
        <td class = "prices" id = "priceten">$</td>
        <td class = "prices" id = "pricefive">$</td>
        <td class = "prices" id = "pricesix">$</td>
      </tr>
      <tr><!--Upgrades10-12 (dmg mult, )!-->
        <td class = "buttons"><button id="damagemult" onclick = buydmgmult()><img src = "damagemult.png" width = "43%" height = "50%"><br>Start Damage Mult</button></td>
        <td class = "buttons"><button id="starthealth" onclick = buystarthealth()><img src = "maxhealth.png" width = "43%" height = "50%"><br>Start Health</button></td>
        <td class = "buttons"><button id="startcoin" onclick = buystartcoin()><img src = "morecoins.png" width = "43%" height = "50%"><br>Start Coins</button></td>
      </tr>
      <tr><!--levels10-12!-->
        <td class = "levels" id = "levelten"">LVL: 0</td>
        <td class = "levels" id = "levelfive"> LVL: 0</td>
        <td class = "levels" id = "levelsix"> LVL: 0</td>
      </tr>
    </table>
  </div>
  </div>


  <div class="containertable" id="leaderboard">
    <div class="header-container">
      <div class="header">#</div>
      <div class="header">Name</div>
      <div class="header" id = "section">Coins</div>
    </div>
    <table id="innertable">
      <!-- Table content here -->
    </table>
  </div>

  <div class="containertable" id="custoboard">
    <div class="header-container">
    <div class="header">Customization Settings</div>
    </div>
    <table id="innertable3">
       <tr>
         <td class = "linkformb">Player</td>
         <td class = "linkforma"><input type="text" class = "custbox" id="playerimgbox" name="name" placeholder ="Enter your Image Link:" value = "playersword.png"></td>
       </tr>
      <tr>
        <td class = "linkformb">Mob</td>
        <td class = "linkforma"><input type="text" id="mobimgbox" class = "custbox" name="name" value = "enemy1.png" placeholder ="Enter your Image Link:"></td>
      </tr>
      <tr>
        <td class = "linkformb">Turret</td>
        <td class = "linkforma"><input type="text" id="turretimgbox" class = "custbox" value = "sawblade.png" name="name" placeholder ="Enter your Image Link:"></td>
      </tr>
      <tr>
        <td class = "linkformb">Hurt Mob</td>
        <td class = "linkforma"><input type="text" id="mobhurtimgbox" class = "custbox" value = "enemy1hurt.png" name="name" placeholder ="Enter your Image Link:"></td>
      </tr>
      <tr>
        <td class = "linkformb">Hurt Player</td>
        <td class = "linkforma"><input type="text" id="playerhurtimgbox" class = "custbox" value = "playerhurt.png" name="name" placeholder ="Enter your Image Link:"></td>
      </tr>
      <tr>
        <td><div id= "custobutcont"><button id = "custobut" onclick = newimg()>Apply</button></div></td>
      </tr>
    </table>
  </div>
  <div class="containertable" id="chatboard">
    <div class="header-container">
      <div class="header">Name</div>
      <div class="header" id = "section">Messages</div>
    </div>
    <table id="innertable2">
      <!-- Table content here -->
    </table>
    <div id = "chat"><form id = "chatform" onsubmit="return false">
      <input type="text" id="chatbox" name="name" placeholder ="Enter your message:">
    </form></div>
    <div id= "chatbutcont"><button id = "chatbut" onclick = "chatsend(); displaychat();">Send</button></div>
  </div>

  <div id = "leadbuttons">
    <div class = "leadbutton" id = "coinslead" onclick = "coinsleaderboard()"></div>
    <div class = "leadbutton" id = "mobkilllead" onclick = "mobkillsleaderboard()"></div>
    <div class = "leadbutton" id = "attritionlead" onclick = "attritionleaderboard()"></div>
    <div class = "leadbutton" id = "healthlead" onclick = "healthleaderboard()"></div>
  </div>  
  <div id = "playscreen">
    <div id = "title"><img src = "title.png"></div>
    <div id = "usernamer"><form id = "usernamerform" onsubmit="return false">
      <input type="text" id="name" name="name" placeholder = "Name:"><br>
    </form></div>
    <div id= "playbutcont"><button id = "playbut" onclick = playamenu()>PLAY</button></div>
  </div>
  <div id = "deathscreen">
    <div id = "otherstuf">
      <div id = "deathtitle" class = "deathtext"><h1 id = "deathtext">YOU DIED</h1></div>
      <div class = "deathtext"><h2 id = "deathcoins">Coins (Rank): </h2></div>
      <div class = "deathtext"><h2 id = "deathattrition">Attrition (Rank): </h2></div>
      <div class = "deathtext"><h2 id = "deathkills">Kills (Rank): </h2></div>
      <div class = "deathtext"><h1>Click Anywhere to Play AGAIN</h1></div>
    </div>
  </div>
  <div id = "cov">
    <img src = "loadinggif.gif" width = 90 height = 90>
  </div>
  <script src="script.js"></script>

</body>

</html>