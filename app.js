function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyles() {
      // if (this.monsterHealth < 72) {
      //     return { background: "#4d7" };
      // }
      if (this.monsterHealth <= 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    useSpecialAttack() {
      return this.currentRound % 5 !== 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0) {
        this.winner = "player";
      }
    },
  },
  methods: {
    restartGame() {
      (this.playerHealth = 100),
        (this.monsterHealth = 100),
        (this.currentRound = 0),
        (this.winner = null),
        (this.logMessages = []);
    },
    playerAttack() {
      this.currentRound++;
      const attackValue = getRandomValue(6, 15);
      setTimeout((this.monsterHealth -= attackValue), 6000);
      this.addLogMessage("player", "attack", attackValue);
      setTimeout(this.monsterTurn, 600);
    },
    monsterTurn() {
      const healOrAttack = 1 * Math.random();
      if (healOrAttack < 0.1 || this.monsterHealth <= 15 && !(this.playerHealth <= 15)) {
        const healValue = getRandomValue(12, 21);
        if (this.monsterHealth + healValue > 100) {
          this.monsterHealth = 100;
        } else if (this.monsterHealth <= 0) {
          this.monsterHealth = 0;
        } else {
          this.monsterHealth += healValue;
        }
        this.addLogMessage("monster", "heal", healValue);
      } else if (this.monsterHealth > 0) {
        const attackValue = getRandomValue(15, 24);
        this.playerHealth -= attackValue;
        this.addLogMessage("monster", "attack", attackValue);
      }
    },
    specialAttack() {
      this.currentRound++;
      const attackValue = getRandomValue(15, 24);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "special-attack", attackValue);

      //////
      const monsterStunned = 1 * Math.random();
      if (monsterStunned < 0.3) {
        setTimeout(this.monsterTurn, 600);
      } else {
        this.currentRound++;
      }
      ///////
    },
    playerHeal() {
      this.currentRound++;
      const healValue = getRandomValue(24, 30);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessage("player", "heal", healValue);
      setTimeout(this.monsterTurn, 300);
    },
    surrender() {
      this.playerHealth -= getRandomValue(1, 99);
      this.currentRound++;
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
