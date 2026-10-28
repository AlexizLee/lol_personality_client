<template>
  <div>
    <h1 class="title">My League of Legend Personality</h1>
    <h2 style="margin: 10px">Which League Champion am I?</h2>
    <ul id="image-list">
        <li v-for="(tile, index) in tiles" :key="tile.id">
          <div v-if="index === questionIndex" class="tile question">?</div>
          <img v-else class="tile" :src="tile.src" :alt="tile.name">
        </li>
    </ul>
    <div class="search-form">
      <div class="field">
        <div class="input-title"> Region </div>
        <DropdownVue :menuTitle="selectedRegion.title">
          <div v-for="(item,index) in regions" :key="index">
            <div class="region-item" @click="chooseRegion(item)">
              {{ item.title }} </div>
          </div>
        </DropdownVue>
      </div>
      <div class="field">
        <div class="input-title"> Player Name </div>
        <input id="player-name-input" v-model="playerName"/>
      </div>
      <div class="field">
        <div class="input-title"> Tag </div>
        <input id="tag-line-input" v-model="tagLine"/>
      </div>
      <button id="search-button" @click="getData()"> → </button>
    </div>
    <div v-if="buttonClicked" class="spinner-wrapper"> Loading...
      <div class="spinner">   
          <span class="loading-square"></span>
      </div>
    </div>
  </div>
</template>

<script>
import DropdownVue from '../components/Dropdown'

export default {
  name: 'LeaguePersonality',
  components: {
    DropdownVue, 
  },
  data(){ 
    return {
      playerName: "",
      // 10 fixed squares, each with its own champion; the "?" covers one at a time
      tiles: Array.from({ length: 10 }, (_, id) => ({
        id,
        src: '/images/empty.png',
        name: 'empty',
      })),
      questionIndex: 0,
      shuffleTimer: null,
      regions: [{title: "Korea", code:"KR"}, {title:"North America", code:"NA"}],
      selectedRegion: {title: "Korea", code:"KR"},
      tagLine: "KR1",
      buttonClicked: false
    }
  },
  async mounted() {
    this.shuffleTimer = setInterval(this.moveQuestion, 1500)
    await this.loadChampions()
  },
  beforeUnmount() {
    clearInterval(this.shuffleTimer)
  },
  methods:{
    async loadChampions() {
      const dd = 'https://ddragon.leagueoflegends.com'
      try {
        const [version] = await (await fetch(`${dd}/api/versions.json`)).json()
        const { data } = await (await fetch(`${dd}/cdn/${version}/data/en_US/champion.json`)).json()
        const champs = Object.values(data)
        // Fisher-Yates shuffle, then take 10 random champions
        for (let i = champs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [champs[i], champs[j]] = [champs[j], champs[i]]
        }
        const picks = champs.slice(0, this.tiles.length)
        this.tiles.forEach((tile, i) => {
          tile.name = picks[i].name
          tile.src = `${dd}/cdn/${version}/img/champion/${picks[i].id}.png`
        })
      } catch (err) {
        console.error('Failed to load champions', err)
      }
    },
    // move the "?" to a random other square
    moveQuestion() {
      let to = Math.floor(Math.random() * (this.tiles.length - 1))
      if (to >= this.questionIndex) to++
      this.questionIndex = to
    },
    async getData(){
      // const params = {gameName: this.summonerName.split(",")[0], tagLine:"KR1"};
      // const res = getAccountInfo(params);
      this.buttonClicked = true;
      this.$router.push({path: '/results', query: { region: this.selectedRegion.code, gameName: this.playerName, tagLine: this.tagLine }});
      
    },
    chooseRegion(item){
      this.selectedRegion = item;
      if (item.code === "KR") this.tagLine = "KR1"
      else if (item.code === "NA") this.tagLine = "NA1"
      else this.tagLine = ""
    },
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spinner-wrapper {
  text-align: center;
  font-size: 20px;
  color: #868686;
  margin-top: 20px;
  .spinner {
    height: fit-content;
    width: fit-content;
    margin: auto;
    margin-top: 15px;
    animation: spin 3s infinite linear;
    .loading-square {
      height: 20px;
      width: 20px;
      background-color: #ffffff;
      border:5px solid #d5d5d5;
      display: inline-block;
    }
  }
}
@keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
}
.title { font-size: 50px; margin-top: 100px; padding: 0 16px; }

/* 5x2 grid that shrinks with the screen; tiles cap at 100px */
#image-list {
  margin: 80px auto 50px auto;
  width: 100%;
  max-width: 650px;
  padding: 0 16px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  list-style: none;
}
#image-list li { display: grid; place-items: center; }
.tile { width: 100%; max-width: 100px; aspect-ratio: 1; height: auto; border-radius: 8px; object-fit: cover; }
.question {
  display: grid;
  place-items: center;
  background: #52ACFF;
  color: #fff;
  font-size: clamp(28px, 9vw, 56px);
  font-weight: 700;
}

.search-form { display: flex; justify-content: center; }
input::placeholder {
  color: #D9D9D9;
  font-size: 25px;
}
input:focus{
    outline: transparent;
    box-shadow: 0 0 10px #93bae5;
}
.input-title {
  color:#52ACFF;
  font-size: 20px;
  height: 20px;
  margin-bottom: 10px;
  text-align: left;
  margin-left: 10px;
}


#player-name-input {
  border: 5px solid #52ACFF;
  border-radius: 20px;
  height:70px;
  width: 300px;
  margin-right: 15px; 
  padding:0;
  padding-left: 15px;
  font-size: 25px;
}
#tag-line-input {
  border: 5px solid #52ACFF;
  border-radius: 20px;
  height:70px;
  width: 150px;
  padding:0;
  padding-left: 15px;
  font-size: 25px;
}
#search-button {
  color: #ffffff;
  background-color: #52ACFF;
  border: 0;
  padding: 0;
  border-radius: 20px;
  margin-top: 25px;
  margin-left:15px;
  width: 80px;
  height: 80px;
  font-size:25px;
}

#search-button:hover {
  background-color: #4085c5;
  cursor: pointer;
}

.region-item {
  height: 40px;
  font-size: 20px;
  line-height: 40px;
  cursor: pointer;
  /* border-bottom: 1px solid #d9d9d9; */
}

.region-item:hover {
  background-color: #efefef;

  
}

text {
  margin-top: 15px;
  margin-bottom: 15px;
}

@media (max-width: 860px) {
  .title { font-size: 32px; margin-top: 40px; }
  #image-list { margin: 40px auto 30px auto; }
  /* stack the form: region, name, tag, then a full-width search button */
  .search-form { flex-direction: column; align-items: center; padding: 0 16px; }
  .field { width: 100%; max-width: 320px; margin-bottom: 12px; }
  #player-name-input, #tag-line-input {
    width: 100%;
    height: 56px;
    border-width: 4px;
    border-radius: 16px;
    box-sizing: border-box;
    margin-right: 0;
    font-size: 20px;
  }
  /* keep the button a rounded square instead of stretching */
  #search-button { width: 64px; height: 64px; margin: 6px 0 0 0; border-radius: 16px; }
}

</style>
