function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: []
    }
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: '0%' }
      }
      return { width: this.monsterHealth + '%' }
    },
    playerBarStyles() {
        if (this.playerHealth < 0) {
            return { width: '0%'}
        }
      return { width: this.playerHealth + '%' }
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
      }
    },
  },
  methods: {
    startGame() {
        this.playerHealth = 100
        this.monsterHealth = 100
        this.winner = null
        this.currentRound = 0
        this.logMessages = []
    },
    attackMonster() {
      this.currentRound++
      const attackValue = getRandomValue(5, 12)
      this.monsterHealth -= attackValue
      this.addLogMessage('player', 'attacks', attackValue)
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
            actionType: what
        })
        this.logMessages.unshift({
            actionBy: who,
            actionType: what,
            actionValue: value
        })
    }
  },
})

app.mount('#game')
