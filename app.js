function getRandomValue(min, max, modifier) {
  if (modifier) {
    return Math.floor(Math.random() * (max - min)) + min * modifier
  } else {
    return Math.floor(Math.random() * (max - min)) + min
  }
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      playerMaxHealth: 100,
      playerDamageModifier: 1,
      playerHealingModifier: 1,
      playerXP: 0,
      playerLevel: 1,
      monsterHealth: 50,
      monsterMaxHealth: 50,
      monsterDamageModifier: 0.5,
      monsterHealingModifier: 1,
      monsterCanHeal: false,
      monsterXPValue: 15,
      monsterType: 'Slime',
      monsterTypeValues: {
        Slime: 0,
        Goblin: 1,
        Ranger: 2,
        Apprentice: 3,
        Orc: 4,
        Wizard: 5,
        Ogre: 6,
      },
      currentRound: 0,
      winner: null,
      logMessages: [],
    }
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: '0%' }
      }
      return { width: (this.monsterHealth / this.monsterMaxHealth * 100) + '%' }
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: '0%' }
      }
      return { width: (this.playerHealth / this.playerMaxHealth * 100) + '%' }
    },
    canSpecialAttack() {
      return this.currentRound % 3 !== 0
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = 'draw'
      } else if (value <= 0) {
        this.winner = 'monster'
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = 'draw'
      } else if (value <= 0) {
        this.winner = 'player'
        this.playerXP += this.monsterXPValue
        console.log('Player XP: ', this.playerXP)
      }
    },
    playerXP(value) {
        if(value > 100) {
            this.levelUpPlayer('damage')
        }
    }
  },
  methods: {
    startGame() {
      this.playerHealth = this.playerMaxHealth
      this.setMonsterType(this.playerLevel)
      this.winner = null
      this.currentRound = 0
      this.logMessages = []
    },
    setMonsterType(playerLevel) {
      let monsterValue = null
      if (playerLevel <= 4) {
        monsterValue = getRandomValue(0, 1)
      } else if (playerLevel >= 5 && playerLevel < 9) {
        monsterValue = getRandomValue(0, 2)
      } else if (playerLevel >= 9 && playerLevel < 13) {
        monsterValue = getRandomValue(1, 3)
      } else if (playerLevel >= 13 && playerLevel < 17) {
        monsterValue = getRandomValue(2, 4)
      } else if (playerLevel >= 17 && playerLevel < 21) {
        monsterValue = getRandomValue(3,5)
      } else if (playerLevel >=21 && playerLevel <= 24) {
        monsterValue = getRandomValue(4,5)
      } else if (playerLevel >= 25) {
        monsterValue = 6
      }
      let monsterTypes = Object.keys(this.monsterTypeValues)
      this.monsterType = monsterTypes[monsterValue]
      if (this.monsterType === 'Slime') {
        this.monsterHealth = 50
        this.monsterMaxHealth = 50
        this.monsterDamageModifier = 0.5
        this.monsterHealingModifier = 1
        this.monsterXPValue = 15
        this.monsterCanHeal = false
      } else if (this.monsterType === 'Goblin') {
        this.monsterHealth = 75
        this.monsterMaxHealth = 75
        this.monsterDamageModifier = 1
        this.monsterHealingModifier = 1
        this.monsterXPValue = 35
        this.monsterCanHeal = false
      } else if (this.monsterType === 'Ranger') {
        this.monsterMaxHealth = getRandomValue(90, 110)
        this.monsterHealth = this.monsterMaxHealth
        this.monsterDamageModifier = 1.2
        this.monsterHealingModifier = 1
        this.monsterXPValue = 50
        this.monsterCanHeal = false
      } else if (this.monsterType === 'Apprentice') {
        this.monsterMaxHealth = getRandomValue(65, 80)
        this.monsterHealth = this.monsterMaxHealth
        this.monsterDamageModifier = 1.3
        this.monsterHealingModifier = 1
        this.monsterXPValue = 60
        this.monsterCanHeal = true
      } else if (this.monsterType === 'Wizard') {
        this.monsterMaxHealth = getRandomValue(70, 95)
        this.monsterHealth = this.monsterMaxHealth
        this.monsterDamageModifier = 1.6
        this.monsterHealingModifier = 1.2
        this.monsterXPValue = 80
        this.monsterCanHeal = true
      } else if (this.monsterType === 'Orc') {
        this.monsterMaxHealth = getRandomValue(100, 120)
        this.monsterHealth = this.monsterMaxHealth
        this.monsterDamageModifier = 1.4
        this.monsterHealingModifier = 1
        this.monsterXPValue = 75
        this.monsterCanHeal = false
      } else if (this.monsterType === 'Ogre') {
        this.monsterMaxHealth = 200
        this.monsterHealth = 200
        this.monsterDamageModifier = 1.7
        this.monsterHealingModifier = 1
        this.monsterXPValue = 90
        this.monsterCanHeal = false
      }
    },
    attackMonster() {
      this.currentRound++
      const attackValue = getRandomValue(5, 12)
      this.monsterHealth -= attackValue
      this.addLogMessage('player', 'attacks', attackValue)
      console.log(this.monsterHealth, this.monsterMaxHealth)
      this.attackPlayer()
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15)
      this.playerHealth -= attackValue
      this.addLogMessage('monster', 'attacks', attackValue)
    },
    specialAttackMonster() {
      this.currentRound++
      const attackValue = getRandomValue(10, 25)
      this.monsterHealth -= attackValue
      this.addLogMessage('player', 'attacks', attackValue)
      this.attackPlayer()
    },
    healPlayer() {
      this.currentRound++
      const healValue = getRandomValue(8, 20)
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100
      } else {
        this.playerHealth += healValue
      }
      this.addLogMessage('player', 'heals', healValue)
      this.attackPlayer()
    },
    surrender() {
      this.winner = 'monster'
      this.addLogMessage('player', 'surrenders', null)
    },
    addLogMessage(who, what, value) {
      if (what === 'surrenders')
        this.logMessages.unshift({
          actionBy: who,
          actionType: what,
        })
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      })
    },
    levelUpPlayer(choice) {
        console.log('hello')
      this.playerXP -= 100
      if (choice === 'damage') {
        this.playerDamageModifier += 1
      } else if (choice === 'maxHealth') {
        this.playerMaxHealth
      } else if (choice === 'healingSkill') {
        this.playerHealingModifier += 1
      }
    },
  },
})

app.mount('#game')
