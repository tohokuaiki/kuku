<template>
  <div class="container-fluid" ref="container">
    <div class="col-12 text-center" v-show='mode=="settings"'>
      <h2>れんしゅうする&nbsp;だん</h2>
      <div v-for="n in 3" :key="n" class="row mb-3 n-3buttons">
        <div v-for="m in 3" :key="m" class="col-4 d-flex">
          <button :class="{'dan-select btn btn-outline-dark':true , active: checkActive(n, m)}"
                  @click.stop="keyCheck($event, n,m)">{{  keyNumber(n,m) }} </button>
        </div>
      </div>
      <div class="row mb-3">
         <div class="col-12">
           <button :class="{'btn btn-warning mt-2 btn-reset-dan': true}" :disabled="dan.length == 0 " @click="dan=[];">↑えらびなおす</button>
         </div>
      </div>
<!--
      <h2>もんだい数</h2>
      <div class="row mb-3 n-3buttons">
        <div v-for="n in [10, 20, 50]" :key="n" class="col-4 d-flex">
          <button :class="{'btn btn-outline-dark num-select':true, 'active': qNum == n }" @click="qNum = n">{{ n }} </button>
        </div>
      </div>
-->
      <div class="row mb-3">
         <div class="col-12 n-button">
           <button :class="{'btn btn-primary n-button p-3 mt-5 btn-start': true}" :disabled="dan.length == 0 " @click="startKuku">スタート</button>
           </div>
      </div>
    </div>
    <div  class="col-12" v-show='mode=="practice"'>
      <div id="mondai" class="text-center">
        <div v-if="kuku_kekka > 0" class="kekka row">
          <span v-if="kuku_kekka==1" class="maru">○</span>
          <span v-if="kuku_kekka==2" class="batsu">×</span>
        </div>
        <div class="kuku-progress"><span>{{ keisan_index}} / {{ kuku.length }}</span></div>
          
        {{ kakerareru }} × {{ kakeru }}＝ {{ kotae_input }}
      </div>
      <div class="row mb-3 n-3buttons">
         <div class="col-4"><button class="dentaku btn btn-outline-dark" @click="checkAnswer(1)">1</button></div>
         <div class="col-4"><button class="dentaku btn btn-outline-dark" @click="checkAnswer(2)">2</button></div>
         <div class="col-4"><button class="dentaku btn btn-outline-dark" @click="checkAnswer(3)">3</button></div>
      </div>
      <div class="row mb-3 n-3buttons">
         <div class="col-4"><button class="dentaku btn btn-outline-dark" @click="checkAnswer(4)">4</button></div>
         <div class="col-4"><button class="dentaku btn btn-outline-dark" @click="checkAnswer(5)">5</button></div>
         <div class="col-4"><button class="dentaku btn btn-outline-dark" @click="checkAnswer(6)">6</button></div>
      </div>
      <div class="row mb-3 n-3buttons">
         <div class="col-4"><button class="dentaku btn btn-outline-dark" @click="checkAnswer(7)">7</button></div>
         <div class="col-4"><button class="dentaku btn btn-outline-dark" @click="checkAnswer(8)">8</button></div>
         <div class="col-4"><button class="dentaku btn btn-outline-dark" @click="checkAnswer(9)">9</button></div>
      </div>
      <div class="row mb-3 n-3buttons align-items-end">
         <div class="col-4"><button class="dentaku btn btn-outline-dark" @click="checkAnswer(0)">0</button></div>
         <div class="col-4"></div>
         <div class="col-3 offset-1"><button class="dentaku btn btn-danger restart" @click="restart99">やめる。</button></div>
      </div>
    </div>
    <div  class="col-12 text-center result" v-show='mode=="result"'>
      <h2>けっかはっぴょう</h2>
      <div class="row">
        <div class="col-10 offset-1 seikai-num">
           <p>{{ keisan_index }} もん中、{{ seikai }} もん正かい。</p>
           <div v-if="keisan_index==seikai">
             <p>かかった時間は、<span :class="{new_score: new_score}" >{{ keisan_time }} です。</span>
               <span v-if="new_score" class="new_score">(新きろく！)</span>
             </p>
           </div>
           <div v-else><p>ぜんぶ正かいするようにがんばろう。</p></div>
        </div>
      </div>
      <div class="row">
        <div class="col-8 offset-2"><button class="dentaku btn btn-danger restart" @click="restart99">はじめにもどる。</button></div>
      </div>
      <div class="row">
        <div class="col-8 offset-2 records">
          <h3 class="mt-3">これまでのきろく</h3>
          <table class="table"><tbody>
            <tr v-for="(value, key) in results" :key="key">
              <th class="text-right">{{ key }}のだん</th>
              <td class="text-left"><span v-if="value.m">{{ value.m }} 分</span> {{ value.s }}.{{ value.ms }} &nbsp;びょう</td>
            </tr>
          </tbody></table>  
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Timer } from 'timer-node';
const timer = new Timer({
  label: 'test-timer'
});

const cookie_name = 'kuku99_result';

export default {
  name: 'KukuPractice',
  props: {
  },
  data(){
      return {
        mode: 'settings',
/*        mode: 'practice', */
        dan: [],
        qNum: 10,
        kuku: [],
        kakerareru: 0,
        kakeru: 0,
        kotae_input: "", 
        keisan_index: 0,
        seikai: 0,
        seikai_delay: 100,
        kuku_kekka: 0,
        keisan_time: '',
        new_score: false,
        results: {}
      }
  },
  mounted(){
      this.results = this.$cookies.get(cookie_name);
      if (!this.results) {
          this.results = {};
      }
      console.log(this.results); 
      console.log('mounted'); 
  },
  methods: {
      initPrams() {
          this.dan = [];
          this.qNum = 10;
          this.kuku = [];
          this.kakerareru = 0;
          this.kakeru = 0;
          this.kotae_input = "";
          this.keisan_index = 0;
          this.seikai = 0;
          this.seikai_delay = 700;
          this.kuku_kekka = 0;
          this.kakerareru = 0;
          this.kakeru = 0;
          this.keisan_time = '';
          this.new_score = false;
      },
      keyNumber(n, m){
          return (n-1) * 3 +  m;
      },
      keyCheck($event, n, m){
          let key = this.keyNumber(n, m);
          let index = this.dan.indexOf(key);
          if (index < 0){
              this.dan.push(key);
              this.dan.sort();
          }
      },
      checkActive(n, m){
          let key = this.keyNumber(n, m);
          let index = this.dan.indexOf(key);
          return index >= 0;
      },
      startKuku(){
          timer.start();

          this.mode = 'practice';
          /* 九九一覧の配列を作る */
          this.kuku = []; 
          for (let i=0; i<this.dan.length; i++){
              for (let j=1; j<=9; j++){
                  this.kuku.push([this.dan[i], j]);
              }
          }
          const shuffle = (array) => {
              const clone = [...array];
                for (let i = clone.length - 1; i >= 0; i--) {
                    let rand = Math.floor(Math.random() * (i + 1));
                    /*  配列の要素の順番を入れ替える */
                    let tmpStorage = clone[i];
                    clone[i] = clone[rand];
                    clone[rand] = tmpStorage;
                }
              return clone;
          };
          this.kuku = shuffle(this.kuku);
          this.setQuestion();
      },
      setQuestion(){
          this.kuku_kekka = 0;
          if (this.kuku.length > this.keisan_index){
              this.kakerareru = this.kuku[this.keisan_index][0];
              this.kakeru = this.kuku[this.keisan_index][1];
          }
          else {
              /* 結果表示へ */
              this.showResult();
          }
          this.kotae_input = '';
      },
      async checkAnswer(key){
          if (timer.isPaused()){
              return ;
          }
          
          let numKey = "" + key;
          this.kotae_input += numKey;
          
          let kotae = "" + (this.kakerareru * this.kakeru) ;
          if (kotae.length === 1){
              if (this.kotae_input.charAt(0) == kotae.charAt(0)){
                  this.seikai++;
                  this.kuku_kekka = 1;
              }
          }
          else if (kotae.length === 2){
              if (this.kotae_input.length === 1){
                  if (this.kotae_input.charAt(0) == kotae.charAt(0)){
                      return ;
                  }
              }
              else if (this.kotae_input.length === 2){
                  if (this.kotae_input.charAt(0) == kotae.charAt(0) &&
                      this.kotae_input.charAt(1) == kotae.charAt(1)){
                      this.seikai++;
                      this.kuku_kekka = 1;
                  }
              }
          }
          if (this.kuku_kekka != 1){
              this.kuku_kekka = 2;
          }
          this.keisan_index++;
          timer.pause();
          setTimeout(()=> {
              timer.resume();
              this.setQuestion(); 
          }, this.seikai_delay);
      },
      restart99(){
          this.initPrams();
          this.mode = 'settings';
      },
      showResult(){
          if (this.mode !== 'result'){
              this.mode = 'result';
              timer.stop();
              let time = timer.time();
              if (time.m){
                  this.keisan_time = time.m + '分';
              }
              this.keisan_time += time.s + '.'+ time.ms + 'びょう';
              if (this.keisan_index == this.seikai){
                  this.saveResult(time);
              }
          }
      },
      saveResult(time) {
          /* 記録を保存 */
          console.log(this.results); 
          let key = this.dan.join(',');
          console.log(key, typeof(this.results[key])); 
          if (typeof(this.results[key]) !== 'undefined'){
              let time_p = this.results[key];
              console.log('============='); 
              console.log(time_p); 
              console.log('============='); 
              let time_p_int =
                time_p.h * 60 * 60 * 1000 +
                time_p.m * 60 * 1000 +
                time_p.s * 1000 +
                time_p.ms ;
              let time_int =
                time.h * 60 * 60 * 1000 +
                time.m * 60 * 1000 +
                time.s * 1000 +
                time.ms ;
              console.log(time_p_int , time_int); 
              if (time_p_int > time_int){
                  time.new_score = true;
                  this.results[key] = time;
                  console.log('aaaaaaaaaaaaaaaaaa'); 
              }
              else {
                  this.results[key].new_score = false;
              }
          }
          else {
              time.new_score = false;
              this.results[key] = time;
              console.log('bbbbbbbbbbbbbbbbbbbbb'); 
          }
          console.log(this.results[key]); 
          this.new_score = this.results[key].new_score;
          this.$cookies.config(60 * 60 * 24 * 60,'/kuku99');
          this.$cookies.set(cookie_name, this.results);
      }
  }
}
</script>
<style scoped>
h2{
    padding: 2vh;
    text-align: center;
}
.n-button{
  font-size: 10vh;
}
.btn.btn-reset-dan{
  width: 70%;
}
.n-button .btn.btn-start{
  height: 12vh;
  font-size: 6vh;
  width: 70%;
}
.n-3buttons .btn{
  width: 100%;
  height: 16vh;
  font-size: 10vh;
}
.n-3buttons .btn.dentaku {
  height: 13vh;
  font-size: 8vh;
}
.n-3buttons .btn.dan-select{
  height: 10vh;
  font-size: 6vh;
}
.n-3buttons .btn.num-select{
  height: 10vh;
  font-size: 6vh;
}
.n-3buttons .btn.restart{
    height: 5vh;
    font-size: 2vh;
}
.result .btn.restart{
    width: 100%;
    font-size: 5vh;
}
.result .seikai-num p{
    font-size: 5vh;
    
}
.result .new_score{
    font-weight: bold;
    color: #dc3545;
}
#mondai{
   position: relative;
   font-size:16vw;
}
.btn-outline-dark:hover{
    color: #212529;
    background-color: transparent;
}
#mondai .kekka{
    position: absolute;
    padding: 0 40%;
    background-color: #ffffff;
    opacity: 0.8;
    font-size: 150%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);    
}
#mondai .kekka .maru{
    color: #ff4242;
}
#mondai .kekka .batsu{
    color: #5f42ff;
}
#mondai .kuku-progress{
    position: absolute;
    right: 0;
    top: 0;
    font-size: 4vh;
}
</style>
