<template>
    <div>
        <div class="personality-overview-wrapper">
          <div v-if="personalityResult && personalityResult.data && personalityResult.data.personality" class="personality-overview">
  
            <section class="hero">
              <h1>{{ personalityResult.data.personality.title }}</h1>
              <div class="hero-body">
                <img v-if="personalityResult.data.persChamp" class="portrait" :src="champImg(personalityResult.data.persChamp, 'loading')" :alt="personalityResult.data.persChamp" />
                <div v-else class="portrait" role="img" :aria-label="personalityResult.data.persChamp" />
                <p>{{ personalityResult.data.personality.description }}</p>
              </div>
            </section>

            <section class="report">
              <h2>Gameplay Report</h2>
              <div class="top">
                <div class="stats">
                  <StatBar label="Average Kill" :value="round1(gameplayResult.data.analysis.avgKill)" color="var(--purple)" />
                  <StatBar label="Average Death" :value="round1(gameplayResult.data.analysis.avgDeath)" color="var(--red)" />
                  <StatBar label="Average Assist" :value="round1(gameplayResult.data.analysis.avgAssist)" color="var(--green)" />
                </div>
                <div class="side">
                  <h3>Most Played Positions</h3>
                  <div class="pos">
                    <span v-for="p in gameplayResult.data.analysis.topPoss" :key="posName(p)" :title="posName(p)">
                      <img v-if="posIcon(p)" :src="posIcon(p)" :alt="posName(p)" />
                      <small v-else>{{ posName(p) }}</small>
                    </span>
                  </div>
                  <h3>Most Played Champions</h3>
                  <div class="champs">
                    <img v-for="c in gameplayResult.data.analysis.topChamps" :key="champName(c)"
                         :src="champImg(c)" :alt="champName(c)" :title="champName(c)" />
                  </div>
                </div>
              </div>
              <div class="scores">
                <ScoreRing v-for="s in scoreRings" :key="s.label" v-bind="s" />
              </div>
            </section>

            <section class="detail">
              <article>
                <h3>What Your Friends Call You</h3>
                <p>{{ personalityResult.data.personality.friend }}</p>
              </article>
              <article>
                <h3>Your Romance</h3>
                <p>{{ personalityResult.data.personality.romance }}</p>
              </article>
              <article>
                <h3>Recommended Game Genre</h3>
                <ul v-if="Array.isArray(personalityResult.data.personality.games)">
                  <li v-for="g in personalityResult.data.personality.games" :key="g">{{ g }}</li>
                </ul>
                <p v-else>{{ personalityResult.data.personality.games }}</p>
              </article>
            </section>

            <div class="actions">
              <div class="share-wrap">
                <div class="bubble">Share to your friends!</div>
                <button type="button" class="btn primary" @click="share">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
                  {{ copied ? 'Link copied!' : 'Share result' }}
                </button>
              </div>
              <button type="button" class="btn" @click="$router.push('/')">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                Back to home
              </button>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import { getGameplayInfo, getPersonalityInfo } from '@/services'
import StatBar from '@/components/StatBar.vue'
import ScoreRing from '@/components/ScoreRing.vue'

export default {
  name: 'ResultsVue',
  components: { StatBar, ScoreRing },
  data() {
    return {
      gameplayResult: null,
      personalityResult: null,
      copied: false,
      ddVersion: '',
      champIds: {},
    }
  },
  async mounted() {
    const dd = 'https://ddragon.leagueoflegends.com'
    try {
      const [version] = await (await fetch(`${dd}/api/versions.json`)).json()
      const { data } = await (await fetch(`${dd}/cdn/${version}/data/en_US/champion.json`)).json()
      // display name -> Data Dragon id, e.g. "Wukong" -> "MonkeyKing"
      this.champIds = Object.fromEntries(Object.values(data).map(c => [c.name, c.id]))
      this.ddVersion = version
    } catch (err) {
      console.error('Failed to load Data Dragon', err)
    }
  },
  async beforeRouteEnter(to, from, next) {
    try {
      const gameplayParams = {region: to.query.region, gameName: to.query.gameName, tagLine: to.query.tagLine}
      const gameplayRes = await getGameplayInfo(gameplayParams)
      if (gameplayRes && gameplayRes.success && gameplayRes.data && gameplayRes.data.analysis){
        const personalityParams = gameplayRes.data.analysis;
        const personalityRes = await getPersonalityInfo(personalityParams);
        if (personalityRes && personalityRes.success && personalityRes.data){
          next(vm=>vm.setResults(gameplayRes, personalityRes))
          return;
        }
      }
      next(vm=>vm.setResults(false, false))
    } catch (err) {
      console.error(err)
      next(vm=>vm.setResults(false, false))
    }
  },
  computed: {
    scoreRings() {
      const colors = ['var(--red)', 'var(--orange)', 'var(--purple)', 'var(--green)', 'var(--blue)']
      const scores = this.gameplayResult.data.analysis.scores || {}
      return Object.entries(scores).map(([key, score], i) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        score: Math.round(Number(score)),
        color: colors[i % colors.length],
      }))
    },
  },
  methods: {
    champName(c) {
      return typeof c === 'string' ? c : c.name
    },
    async share() {
      const title = this.personalityResult.data.personality.title
      const resultUrl = window.location.href
      const homeUrl = `${window.location.origin}/`
      const text = `I got "${title}" on LoL Personality! See my result: ${resultUrl}\nTry it yourself: ${homeUrl}`
      try {
        if (navigator.share) {
          await navigator.share({ title: 'LoL Personality', text })
          return
        }
        await navigator.clipboard.writeText(text)
        this.copied = true
        setTimeout(() => { this.copied = false }, 2000)
      } catch (err) {
        // the user dismissing the share sheet rejects with AbortError; nothing to do
        if (err.name !== 'AbortError') console.error(err)
      }
    },
    round1(n) {
      return Math.round(Number(n) * 10) / 10
    },
    posName(p) {
      return typeof p === 'string' ? p : p.name
    },
    // APEX and NONE have no icon, so they fall back to text
    posIcon(p) {
      const files = { TOP: 'top', JUNGLE: 'jungle', MIDDLE: 'middle', BOTTOM: 'bottom', UTILITY: 'utility' }
      const file = files[String(this.posName(p)).toUpperCase()]
      return file
        ? `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-${file}.svg`
        : ''
    },
    // type: 'icon' (square, versioned) or 'loading' (tall art, unversioned)
    champImg(c, type = 'icon') {
      if (!this.ddVersion) return ''
      const name = this.champName(c)
      const id = this.champIds[name] || name.replace(/[^A-Za-z0-9]/g, '')
      const dd = 'https://ddragon.leagueoflegends.com/cdn'
      return type === 'loading'
        ? `${dd}/img/champion/loading/${id}_0.jpg`
        : `${dd}/${this.ddVersion}/img/champion/${id}.png`
    },
    setResults(gameplayResult, personalityResult){
      this.gameplayResult = gameplayResult;
      this.personalityResult = personalityResult;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hero { background: var(--gray); padding-top: 90px; padding-bottom: 90px; }
.hero h1 { font-size: 36px; text-align: center; margin-bottom: 40px; }
.hero-body { display: flex; gap: 48px; align-items: center; justify-content: center; flex-wrap: wrap; }
.portrait { width: 308px; aspect-ratio: 308 / 560; max-width: 100%; object-fit: cover; flex: none; background: linear-gradient(135deg, #6b8ea8, #2a3b4a); }
.hero p { max-width: 500px; }

.report { padding-top: 70px; padding-bottom: 70px; }
.top { display: flex; gap: 60px; flex-wrap: wrap; justify-content: space-between; }
.stats { flex: 1; min-width: 320px; max-width: 480px; }
.side h3 { font-weight: 400; font-size: 20px; margin-bottom: 12px; }
.pos, .champs { display: flex; gap: 14px; margin-bottom: 24px; }
.pos span { width: 44px; height: 44px; background: #1e2328; border-radius: 6px; display: grid; place-items: center; }
.pos img { width: 28px; height: 28px; }
.pos small { font-size: 9px; color: #c8aa6e; }
.champs img { width: 57px; height: 57px; border-radius: 50%; object-fit: cover; background: linear-gradient(135deg, #6b8ea8, #2a3b4a); }
.scores { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-top: 30px; }

.detail { background: var(--gray); padding-top: 70px; padding-bottom: 70px; }
.detail h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
.detail article { margin-bottom: 36px; }
.detail ul { margin-top: 24px; padding-left: 32px; }

.actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 90px; }
.share-wrap { position: relative; }
.bubble {
  position: absolute; bottom: calc(100% + 14px); left: 50%; transform: translateX(-50%);
  white-space: nowrap; padding: 8px 16px; border-radius: 14px;
  background: #1f2d3a; color: #fff; font-size: 14px; font-weight: 600;
  animation: bob 2s ease-in-out infinite;
}
/* tail pointing down at the button */
.bubble::after {
  content: ''; position: absolute; top: 100%; left: 50%; margin-left: -8px;
  border: 8px solid transparent; border-top-color: #1f2d3a;
}
@keyframes bob {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-4px); }
}
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 14px 32px; border-radius: 999px;
  font-family: 'Cinzel', Georgia, serif; font-size: 16px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  border: 3px solid #52ACFF; background: #fff; color: #52ACFF;
  cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, color 0.15s ease;
}
.btn svg { width: 20px; height: 20px; fill: currentColor; flex: none; }
.btn:hover { background: #52ACFF; color: #fff; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(82, 172, 255, 0.4); }
.btn:active { transform: translateY(0); box-shadow: none; }
.btn.primary { background: linear-gradient(135deg, #52ACFF, #3a86d9); border-color: transparent; color: #fff; box-shadow: 0 4px 14px rgba(82, 172, 255, 0.45); }
.btn.primary:hover { background: linear-gradient(135deg, #63b6ff, #4690e3); }

.personality-overview-wrapper { text-align: left; background-color: #f2f2f2; padding: 50px; }
.personality-description { margin-top: 20px; }
.personality-img { display: inline-block; vertical-align: middle; margin-right: 50px; }
.personality-text { display: inline-block; vertical-align: middle; width: 100%; max-width: 700px; }

@media (max-width: 700px) {
  .personality-overview-wrapper { padding: 16px; }
  .hero { padding-top: 40px; padding-bottom: 40px; padding-left: 16px; padding-right: 16px; }
  .hero h1 { font-size: 28px; margin-bottom: 24px; }
  .hero-body { gap: 24px; }
  .report { padding-top: 40px; padding-bottom: 40px; }
  .top { gap: 30px; }
  .stats { min-width: 0; width: 100%; max-width: none; }
  .scores { justify-content: center; gap: 24px 12px; }
  .detail { padding: 40px 16px; }
  .actions { margin-top: 70px; }
  .actions > .btn, .share-wrap { flex: 1 1 100%; }
  .share-wrap .btn { width: 100%; }
}

</style>
