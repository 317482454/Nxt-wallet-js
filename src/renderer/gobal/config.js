import CryptoJS from "crypto-js";
import BigInteger from "biginteger";

require('./eac/crypto-min')
require('./eac/crypto-sha256')
require('./eac/crypto-sha256-hmac')
require('./eac/ripemd160')
require('./eac/jsbn')
require('./eac/ellipticcurve')
require('./eac/bitTrx')
require('./eac/eaclib')
require('./eac/sha256')

import NxtConverters from './nxt/converters'
import ArdrConverters from './ardr/converters'



let wallet = {
    eac(keyPress,state){
        let bytes = Crypto.SHA256(keyPress, { asBytes: true });
        let btcKey = new Bitcoin.ECKey(bytes);
        if(state==0){
            let Address = btcKey.getBitcoinAddress();
            return Address;
        }else {
            let pr = btcKey.getBitcoinWalletImportFormat();
            return pr;
        }

    },
    isNumber(val) {
        let regPos = /^\d+(\.\d+)?$/; //非负浮点数
        let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    },
    formatDateTime(timeStamp) {
        let date = new Date(timeStamp);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        let second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },
    setWallet(name, pass, phrase, txt, vue,backed) {
        let publickey=vue.$nxt.secretPhraseToPublicKey(phrase)
        let wallet = {
            name: name,
            backed:backed,
            phrase: this.encrypt(phrase, pass),
            ardrApi:'http://62.75.159.113:27876',
            list: [
                {
                    phrase: this.encrypt(phrase, pass),
                    publickey:publickey ,
                    address: vue.$nxt.publicKeyToAccountId(publickey,false),
                    txt: txt,
                    apikey:'nxt',
                    api: 'http://174.140.167.239:7876',
                }
            ]
        };
        vue.$store.commit('wallet',wallet);
    },
    setWalletAddr(name, pass, addr, txt, vue) {
        let publickey='';
        let wallet = {
            name: name,
            phrase: this.encrypt(addr, pass),
            ardrApi:'http://62.75.159.113:27876',
            list: [
                {
                    phrase: this.encrypt(addr, pass),
                    publickey:publickey ,
                    address: addr,
                    txt: txt,
                    api: 'http://174.140.167.239:7876',
                    apikey:'nxt'
                }
            ]
        };
        vue.$store.commit('wallet',wallet);
    },
    getAccount(vue, model) {
        return new Promise(function (resolve) {
            if (model.txt == "Eac") {
                let api = model.api;
                vue.$http.get('http://localhost:3000/eac/api.dws?q=getblockcount', {timeout: 5000}).then(height => {
                    vue.$http.get('http://localhost:3000/eac/api.dws?q=getbalance&key=8a2802e62c32&a='+model.address, {timeout: 5000}).then(v => {
                        if (v.status == 200 && v.data) {
                            resolve({balanceNQT: v.data*100000000,height:height.data});
                        }
                    }).catch(err => {
                        resolve('errorCode404')
                    })
                }).catch(err => {
                    resolve('errorCode404')

                })

            } else {
                let api = model.api;
                if (!model.chainId) {
                    api = api + '/' + model.apikey + '?requestType=getAccount&account=' + model.address;
                } else {
                    api = api + '/' + model.apikey + '?requestType=getBalance&account=' + model.address + '&chain=' + model.chainId;
                }
                vue.$http.get(model.api+'/'+ model.apikey+'?requestType=getBlock', {timeout: 5000}).then(item => {
                    vue.$http.get(api, {timeout: 5000}).then(v => {
                        if (v.status == 200 && v.data) {
                            v.data.height=item.data.height
                            if(model.txt=='Mtr'){
                                v.data.balanceNQT=v.data.balanceMQT
                            }
                            if(model.txt=='Apl'){
                                v.data.balanceNQT=v.data.balanceATM
                            }
                            resolve(v.data);
                        }
                    }).catch(err => {
                        resolve('errorCode404')
                    })
                }).catch(err => {
                    resolve('errorCode404')
                })

            }
        });
    },
    getBlockchainTransactions(vue, model) {
        let _this=this;
        return new Promise(function (resolve) {
            let api = model.api;
            if (!model.chainId) {
                api = api + '/'+model.apikey+'?requestType=getBlockchainTransactions&account=' + model.address+'&firstIndex='+(vue.currentPage-1)*14+'&lastIndex='+((vue.currentPage-1)*14+14);
            }else{
                api = api + '/'+model.apikey+'?requestType=getBlockchainTransactions&account=' + model.address+'&chain='+model.chainId+'&firstIndex='+(vue.currentPage-1)*14+'&lastIndex='+((vue.currentPage-1)*14+14);
            }
            _this.getUnconfirmedTransactions(vue, model).then(list=>{
                vue.$http.get(api,{timeout:5000}).then(v => {
                    if (v.status == 200 && v.data) {
                        resolve(list.concat(v.data.transactions))
                    }
                }).catch(error=>{
                    vue.modalVisible=false
                })
            })

        });
    },
    getUnconfirmedTransactions(vue, model){
        return new Promise(function (resolve) {
            let api = model.api;
            if (!model.chainId) {
                api = api + '/'+model.apikey+'?requestType=getUnconfirmedTransactions&account=' + model.address;
            }else{
                api = api + '/'+model.apikey+'?requestType=getUnconfirmedTransactions&account=' + model.address+'&chain='+model.chainId;
            }
            vue.$http.get(api,{timeout:5000}).then(v => {
                if (v.status == 200 && v.data) {
                    resolve(v.data.unconfirmedTransactions)
                }
            }).catch(error=>{
                vue.modalVisible=false
            })
        });
    },
    getWallet(vue) {
        let _this = this;
        return new Promise(function (resolve) {
            vue.$ons.notification.prompt({
                'inputType':'password',
                'title': vue.$t('l.prompt.title'),
                'message': vue.$t('l.prompt.password'),
                'callback': function (password) {
                    resolve(_this.decrypt(vue.$store.state.wallet.phrase, password))
                }
            });
        });
    },
    amount(sum){
        return (sum*0.00000001).toFixed(2);
    },
    encrypt(key, pass) {
        return CryptoJS.AES.encrypt(key, pass).toString()
    },
    decrypt(encryptPass, keyPass) {
        return new Promise(function (resolve) {
            let bytes = CryptoJS.AES.decrypt(encryptPass, keyPass);
            let plaintext;
            try {
                plaintext = bytes.toString(CryptoJS.enc.Utf8);
            } catch (e) {
                plaintext = ''
            }
            resolve({
                plaintext: plaintext,
                pass: keyPass
            });
        });
    },
    addrReplace(addr,type){
        let to='';
        addr.split('-').forEach((item,index)=>{
            if(index!=0){
                to=to+'-'+item;
            }else{
                to=type.toLocaleUpperCase()+to;
            }
        })
        return to;
    },
    verifyTransactionBytes(transactionBytes,model){
        delete model["message"]
        delete model["messageIsText"]
        delete model["messageIsPrunable"]
        delete model["referencedTransaction"]
        let transaction = {};
        if(!model.chain){
            let byteArray = NxtConverters.hexStringToByteArray(transactionBytes);
            transaction.requestType = this.getNxtType(byteArray[0],byteArray[1] & 0x0F);
            transaction.deadline = String(NxtConverters.byteArrayToSignedShort(byteArray, 6));
            transaction.publicKey = NxtConverters.byteArrayToHexString(byteArray.slice(8, 40));
            transaction.recipient = String(NxtConverters.byteArrayToBigInteger(byteArray, 40));
            transaction.amountNQT = String(NxtConverters.byteArrayToBigInteger(byteArray, 48));
            transaction.feeNQT = String(NxtConverters.byteArrayToBigInteger(byteArray, 56));
            if(model.period) {
                delete transaction["amountNQT"]
                let version = (byteArray[1] & 0xF0) >> 4;
                let pos = 0
                if (version > 0) {
                    pos = 177;
                } else {
                    pos = 160;
                }
                transaction.period = String(NxtConverters.byteArrayToSignedShort(byteArray, 177));
            }
        }
        else{
            let byteArray = ArdrConverters.hexStringToByteArray(transactionBytes);
            var pos = 0;
            transaction.chain = String(ArdrConverters.byteArrayToSignedInt32(byteArray, pos));
            pos += 4;
            let type = byteArray[pos++];
            // Patch until I find the official way of converting JS byte to signed byte
            if (type >= 128) {
                type -= 256;
            }
            let subtype = byteArray[pos++];
            transaction.requestType=this.getArdrType(type,subtype)
            let version = byteArray[pos++];
            pos += 4;
            transaction.deadline = String(ArdrConverters.byteArrayToSignedShort(byteArray, pos));
            pos += 2;
            transaction.publicKey = ArdrConverters.byteArrayToHexString(byteArray.slice(pos, pos + 32));
            pos += 32;
            transaction.recipient = String(ArdrConverters.byteArrayToBigInteger(byteArray, pos));
            pos += 8;
            transaction.amountNQT = String(ArdrConverters.byteArrayToBigInteger(byteArray, pos));
            pos += 8;
            transaction.feeNQT = String(ArdrConverters.byteArrayToBigInteger(byteArray, pos));
        }
        if(model.name=='Mtr'){
            let byteArray = NxtConverters.hexStringToByteArray(transactionBytes);
            transaction.requestType = this.getNxtType(byteArray[0],byteArray[1] & 0x0F);
            transaction.deadline = String(NxtConverters.byteArrayToSignedShort(byteArray, 10));
            transaction.publicKey = NxtConverters.byteArrayToHexString(byteArray.slice(12, 44));
            transaction.recipient = String(NxtConverters.byteArrayToBigIntegerMtr(byteArray, 44));
            transaction.amountMQT = String(NxtConverters.byteArrayToBigInteger(byteArray, 56));
            transaction.feeMQT = String(NxtConverters.byteArrayToBigInteger(byteArray, 64));
            delete transaction["feeNQT"]
            delete transaction["amountNQT"]
            delete model["feeNQT"]
        }
        if(model.name=="Apl"){
            transaction.amountATM =transaction.amountNQT;
            transaction.feeATM = transaction.feeNQT;
            delete transaction["feeNQT"]
            delete transaction["amountNQT"]
            delete model["feeNQT"]
        }
        delete model["name"]
        console.log(transaction,'transaction');
        console.log(model,'model');
        return this.isObjectValueEqual(transaction, model);
    },
    getNxtType(type,subtype){
        if (type === 0 && subtype === 0) {
            return 'sendMoney';
        }
        if (type === 1 && subtype === 0) {
            return 'sendMessage';
        }
        if (type === 4 && subtype === 0) {
            return 'leaseBalance';
        }
    },
    getArdrType(type,subtype){
        if (type === -2 && subtype === 0) {
            return 'sendMoney';
        }
        if (type === 0 && subtype === 0) {
            return 'sendMoney';
        }
    },
    isObjectValueEqual(a, b) {
        // Of course, we can do it use for in
        // Create arrays of property names
        let aProps = Object.getOwnPropertyNames(a);
        let bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    },
    generatePassPhrase() {
        let words = ["like", "just", "love", "know", "never", "want", "time", "out", "there", "make", "look", "eye", "down", "only", "think", "heart", "back", "then", "into", "about", "more", "away", "still", "them", "take", "thing", "even", "through", "long", "always", "world", "too", "friend", "tell", "try", "hand", "thought", "over", "here", "other", "need", "smile", "again", "much", "cry", "been", "night", "ever", "little", "said", "end", "some", "those", "around", "mind", "people", "girl", "leave", "dream", "left", "turn", "myself", "give", "nothing", "really", "off", "before", "something", "find", "walk", "wish", "good", "once", "place", "ask", "stop", "keep", "watch", "seem", "everything", "wait", "got", "yet", "made", "remember", "start", "alone", "run", "hope", "maybe", "believe", "body", "hate", "after", "close", "talk", "stand", "own", "each", "hurt", "help", "home", "god", "soul", "new", "many", "two", "inside", "should", "true", "first", "fear", "mean", "better", "play", "another", "gone", "change", "use", "wonder", "someone", "hair", "cold", "open", "best", "any", "behind", "happen", "water", "dark", "laugh", "stay", "forever", "name", "work", "show", "sky", "break", "came", "deep", "door", "put", "black", "together", "upon", "happy", "such", "great", "white", "matter", "fill", "past", "please", "burn", "cause", "enough", "touch", "moment", "soon", "voice", "scream", "anything", "stare", "sound", "red", "everyone", "hide", "kiss", "truth", "death", "beautiful", "mine", "blood", "broken", "very", "pass", "next", "forget", "tree", "wrong", "air", "mother", "understand", "lip", "hit", "wall", "memory", "sleep", "free", "high", "realize", "school", "might", "skin", "sweet", "perfect", "blue", "kill", "breath", "dance", "against", "fly", "between", "grow", "strong", "under", "listen", "bring", "sometimes", "speak", "pull", "person", "become", "family", "begin", "ground", "real", "small", "father", "sure", "feet", "rest", "young", "finally", "land", "across", "today", "different", "guy", "line", "fire", "reason", "reach", "second", "slowly", "write", "eat", "smell", "mouth", "step", "learn", "three", "floor", "promise", "breathe", "darkness", "push", "earth", "guess", "save", "song", "above", "along", "both", "color", "house", "almost", "sorry", "anymore", "brother", "okay", "dear", "game", "fade", "already", "apart", "warm", "beauty", "heard", "notice", "question", "shine", "began", "piece", "whole", "shadow", "secret", "street", "within", "finger", "point", "morning", "whisper", "child", "moon", "green", "story", "glass", "kid", "silence", "since", "soft", "yourself", "empty", "shall", "angel", "answer", "baby", "bright", "dad", "path", "worry", "hour", "drop", "follow", "power", "war", "half", "flow", "heaven", "act", "chance", "fact", "least", "tired", "children", "near", "quite", "afraid", "rise", "sea", "taste", "window", "cover", "nice", "trust", "lot", "sad", "cool", "force", "peace", "return", "blind", "easy", "ready", "roll", "rose", "drive", "held", "music", "beneath", "hang", "mom", "paint", "emotion", "quiet", "clear", "cloud", "few", "pretty", "bird", "outside", "paper", "picture", "front", "rock", "simple", "anyone", "meant", "reality", "road", "sense", "waste", "bit", "leaf", "thank", "happiness", "meet", "men", "smoke", "truly", "decide", "self", "age", "book", "form", "alive", "carry", "escape", "damn", "instead", "able", "ice", "minute", "throw", "catch", "leg", "ring", "course", "goodbye", "lead", "poem", "sick", "corner", "desire", "known", "problem", "remind", "shoulder", "suppose", "toward", "wave", "drink", "jump", "woman", "pretend", "sister", "week", "human", "joy", "crack", "grey", "pray", "surprise", "dry", "knee", "less", "search", "bleed", "caught", "clean", "embrace", "future", "king", "son", "sorrow", "chest", "hug", "remain", "sat", "worth", "blow", "daddy", "final", "parent", "tight", "also", "create", "lonely", "safe", "cross", "dress", "evil", "silent", "bone", "fate", "perhaps", "anger", "class", "scar", "snow", "tiny", "tonight", "continue", "control", "dog", "edge", "mirror", "month", "suddenly", "comfort", "given", "loud", "quickly", "gaze", "plan", "rush", "stone", "town", "battle", "ignore", "spirit", "stood", "stupid", "yours", "brown", "build", "dust", "hey", "kept", "pay", "phone", "twist", "although", "ball", "beyond", "hidden", "nose", "taken", "fail", "float", "pure", "somehow", "wash", "wrap", "angry", "cheek", "creature", "forgotten", "heat", "rip", "single", "space", "special", "weak", "whatever", "yell", "anyway", "blame", "job", "choose", "country", "curse", "drift", "echo", "figure", "grew", "laughter", "neck", "suffer", "worse", "yeah", "disappear", "foot", "forward", "knife", "mess", "somewhere", "stomach", "storm", "beg", "idea", "lift", "offer", "breeze", "field", "five", "often", "simply", "stuck", "win", "allow", "confuse", "enjoy", "except", "flower", "seek", "strength", "calm", "grin", "gun", "heavy", "hill", "large", "ocean", "shoe", "sigh", "straight", "summer", "tongue", "accept", "crazy", "everyday", "exist", "grass", "mistake", "sent", "shut", "surround", "table", "ache", "brain", "destroy", "heal", "nature", "shout", "sign", "stain", "choice", "doubt", "glance", "glow", "mountain", "queen", "stranger", "throat", "tomorrow", "city", "either", "fish", "flame", "rather", "shape", "spin", "spread", "ash", "distance", "finish", "image", "imagine", "important", "nobody", "shatter", "warmth", "became", "feed", "flesh", "funny", "lust", "shirt", "trouble", "yellow", "attention", "bare", "bite", "money", "protect", "amaze", "appear", "born", "choke", "completely", "daughter", "fresh", "friendship", "gentle", "probably", "six", "deserve", "expect", "grab", "middle", "nightmare", "river", "thousand", "weight", "worst", "wound", "barely", "bottle", "cream", "regret", "relationship", "stick", "test", "crush", "endless", "fault", "itself", "rule", "spill", "art", "circle", "join", "kick", "mask", "master", "passion", "quick", "raise", "smooth", "unless", "wander", "actually", "broke", "chair", "deal", "favorite", "gift", "note", "number", "sweat", "box", "chill", "clothes", "lady", "mark", "park", "poor", "sadness", "tie", "animal", "belong", "brush", "consume", "dawn", "forest", "innocent", "pen", "pride", "stream", "thick", "clay", "complete", "count", "draw", "faith", "press", "silver", "struggle", "surface", "taught", "teach", "wet", "bless", "chase", "climb", "enter", "letter", "melt", "metal", "movie", "stretch", "swing", "vision", "wife", "beside", "crash", "forgot", "guide", "haunt", "joke", "knock", "plant", "pour", "prove", "reveal", "steal", "stuff", "trip", "wood", "wrist", "bother", "bottom", "crawl", "crowd", "fix", "forgive", "frown", "grace", "loose", "lucky", "party", "release", "surely", "survive", "teacher", "gently", "grip", "speed", "suicide", "travel", "treat", "vein", "written", "cage", "chain", "conversation", "date", "enemy", "however", "interest", "million", "page", "pink", "proud", "sway", "themselves", "winter", "church", "cruel", "cup", "demon", "experience", "freedom", "pair", "pop", "purpose", "respect", "shoot", "softly", "state", "strange", "bar", "birth", "curl", "dirt", "excuse", "lord", "lovely", "monster", "order", "pack", "pants", "pool", "scene", "seven", "shame", "slide", "ugly", "among", "blade", "blonde", "closet", "creek", "deny", "drug", "eternity", "gain", "grade", "handle", "key", "linger", "pale", "prepare", "swallow", "swim", "tremble", "wheel", "won", "cast", "cigarette", "claim", "college", "direction", "dirty", "gather", "ghost", "hundred", "loss", "lung", "orange", "present", "swear", "swirl", "twice", "wild", "bitter", "blanket", "doctor", "everywhere", "flash", "grown", "knowledge", "numb", "pressure", "radio", "repeat", "ruin", "spend", "unknown", "buy", "clock", "devil", "early", "false", "fantasy", "pound", "precious", "refuse", "sheet", "teeth", "welcome", "add", "ahead", "block", "bury", "caress", "content", "depth", "despite", "distant", "marry", "purple", "threw", "whenever", "bomb", "dull", "easily", "grasp", "hospital", "innocence", "normal", "receive", "reply", "rhyme", "shade", "someday", "sword", "toe", "visit", "asleep", "bought", "center", "consider", "flat", "hero", "history", "ink", "insane", "muscle", "mystery", "pocket", "reflection", "shove", "silently", "smart", "soldier", "spot", "stress", "train", "type", "view", "whether", "bus", "energy", "explain", "holy", "hunger", "inch", "magic", "mix", "noise", "nowhere", "prayer", "presence", "shock", "snap", "spider", "study", "thunder", "trail", "admit", "agree", "bag", "bang", "bound", "butterfly", "cute", "exactly", "explode", "familiar", "fold", "further", "pierce", "reflect", "scent", "selfish", "sharp", "sink", "spring", "stumble", "universe", "weep", "women", "wonderful", "action", "ancient", "attempt", "avoid", "birthday", "branch", "chocolate", "core", "depress", "drunk", "especially", "focus", "fruit", "honest", "match", "palm", "perfectly", "pillow", "pity", "poison", "roar", "shift", "slightly", "thump", "truck", "tune", "twenty", "unable", "wipe", "wrote", "coat", "constant", "dinner", "drove", "egg", "eternal", "flight", "flood", "frame", "freak", "gasp", "glad", "hollow", "motion", "peer", "plastic", "root", "screen", "season", "sting", "strike", "team", "unlike", "victim", "volume", "warn", "weird", "attack", "await", "awake", "built", "charm", "crave", "despair", "fought", "grant", "grief", "horse", "limit", "message", "ripple", "sanity", "scatter", "serve", "split", "string", "trick", "annoy", "blur", "boat", "brave", "clearly", "cling", "connect", "fist", "forth", "imagination", "iron", "jock", "judge", "lesson", "milk", "misery", "nail", "naked", "ourselves", "poet", "possible", "princess", "sail", "size", "snake", "society", "stroke", "torture", "toss", "trace", "wise", "bloom", "bullet", "cell", "check", "cost", "darling", "during", "footstep", "fragile", "hallway", "hardly", "horizon", "invisible", "journey", "midnight", "mud", "nod", "pause", "relax", "shiver", "sudden", "value", "youth", "abuse", "admire", "blink", "breast", "bruise", "constantly", "couple", "creep", "curve", "difference", "dumb", "emptiness", "gotta", "honor", "plain", "planet", "recall", "rub", "ship", "slam", "soar", "somebody", "tightly", "weather", "adore", "approach", "bond", "bread", "burst", "candle", "coffee", "cousin", "crime", "desert", "flutter", "frozen", "grand", "heel", "hello", "language", "level", "movement", "pleasure", "powerful", "random", "rhythm", "settle", "silly", "slap", "sort", "spoken", "steel", "threaten", "tumble", "upset", "aside", "awkward", "bee", "blank", "board", "button", "card", "carefully", "complain", "crap", "deeply", "discover", "drag", "dread", "effort", "entire", "fairy", "giant", "gotten", "greet", "illusion", "jeans", "leap", "liquid", "march", "mend", "nervous", "nine", "replace", "rope", "spine", "stole", "terror", "accident", "apple", "balance", "boom", "childhood", "collect", "demand", "depression", "eventually", "faint", "glare", "goal", "group", "honey", "kitchen", "laid", "limb", "machine", "mere", "mold", "murder", "nerve", "painful", "poetry", "prince", "rabbit", "shelter", "shore", "shower", "soothe", "stair", "steady", "sunlight", "tangle", "tease", "treasure", "uncle", "begun", "bliss", "canvas", "cheer", "claw", "clutch", "commit", "crimson", "crystal", "delight", "doll", "existence", "express", "fog", "football", "gay", "goose", "guard", "hatred", "illuminate", "mass", "math", "mourn", "rich", "rough", "skip", "stir", "student", "style", "support", "thorn", "tough", "yard", "yearn", "yesterday", "advice", "appreciate", "autumn", "bank", "beam", "bowl", "capture", "carve", "collapse", "confusion", "creation", "dove", "feather", "girlfriend", "glory", "government", "harsh", "hop", "inner", "loser", "moonlight", "neighbor", "neither", "peach", "pig", "praise", "screw", "shield", "shimmer", "sneak", "stab", "subject", "throughout", "thrown", "tower", "twirl", "wow", "army", "arrive", "bathroom", "bump", "cease", "cookie", "couch", "courage", "dim", "guilt", "howl", "hum", "husband", "insult", "led", "lunch", "mock", "mostly", "natural", "nearly", "needle", "nerd", "peaceful", "perfection", "pile", "price", "remove", "roam", "sanctuary", "serious", "shiny", "shook", "sob", "stolen", "tap", "vain", "void", "warrior", "wrinkle", "affection", "apologize", "blossom", "bounce", "bridge", "cheap", "crumble", "decision", "descend", "desperately", "dig", "dot", "flip", "frighten", "heartbeat", "huge", "lazy", "lick", "odd", "opinion", "process", "puzzle", "quietly", "retreat", "score", "sentence", "separate", "situation", "skill", "soak", "square", "stray", "taint", "task", "tide", "underneath", "veil", "whistle", "anywhere", "bedroom", "bid", "bloody", "burden", "careful", "compare", "concern", "curtain", "decay", "defeat", "describe", "double", "dreamer", "driver", "dwell", "evening", "flare", "flicker", "grandma", "guitar", "harm", "horrible", "hungry", "indeed", "lace", "melody", "monkey", "nation", "object", "obviously", "rainbow", "salt", "scratch", "shown", "shy", "stage", "stun", "third", "tickle", "useless", "weakness", "worship", "worthless", "afternoon", "beard", "boyfriend", "bubble", "busy", "certain", "chin", "concrete", "desk", "diamond", "doom", "drawn", "due", "felicity", "freeze", "frost", "garden", "glide", "harmony", "hopefully", "hunt", "jealous", "lightning", "mama", "mercy", "peel", "physical", "position", "pulse", "punch", "quit", "rant", "respond", "salty", "sane", "satisfy", "savior", "sheep", "slept", "social", "sport", "tuck", "utter", "valley", "wolf", "aim", "alas", "alter", "arrow", "awaken", "beaten", "belief", "brand", "ceiling", "cheese", "clue", "confidence", "connection", "daily", "disguise", "eager", "erase", "essence", "everytime", "expression", "fan", "flag", "flirt", "foul", "fur", "giggle", "glorious", "ignorance", "law", "lifeless", "measure", "mighty", "muse", "north", "opposite", "paradise", "patience", "patient", "pencil", "petal", "plate", "ponder", "possibly", "practice", "slice", "spell", "stock", "strife", "strip", "suffocate", "suit", "tender", "tool", "trade", "velvet", "verse", "waist", "witch", "aunt", "bench", "bold", "cap", "certainly", "click", "companion", "creator", "dart", "delicate", "determine", "dish", "dragon", "drama", "drum", "dude", "everybody", "feast", "forehead", "former", "fright", "fully", "gas", "hook", "hurl", "invite", "juice", "manage", "moral", "possess", "raw", "rebel", "royal", "scale", "scary", "several", "slight", "stubborn", "swell", "talent", "tea", "terrible", "thread", "torment", "trickle", "usually", "vast", "violence", "weave", "acid", "agony", "ashamed", "awe", "belly", "blend", "blush", "character", "cheat", "common", "company", "coward", "creak", "danger", "deadly", "defense", "define", "depend", "desperate", "destination", "dew", "duck", "dusty", "embarrass", "engine", "example", "explore", "foe", "freely", "frustrate", "generation", "glove", "guilty", "health", "hurry", "idiot", "impossible", "inhale", "jaw", "kingdom", "mention", "mist", "moan", "mumble", "mutter", "observe", "ode", "pathetic", "pattern", "pie", "prefer", "puff", "rape", "rare", "revenge", "rude", "scrape", "spiral", "squeeze", "strain", "sunset", "suspend", "sympathy", "thigh", "throne", "total", "unseen", "weapon", "weary"]
        let crypto = window.crypto || window.msCrypto;
        if (crypto) {
            let bits = 128;
            let random = new Uint32Array(bits / 32);
            crypto.getRandomValues(random);
            let n = words.length;
            let phraseWords = [];
            let x, w1, w2, w3;

            for (let i = 0; i < random.length; i++) {
                x = random[i];
                w1 = x % n;
                w2 = (((x / n) >> 0) + w1) % n;
                w3 = (((((x / n) >> 0) / n) >> 0) + w2) % n;
                phraseWords.push(words[w1]);
                phraseWords.push(words[w2]);
                phraseWords.push(words[w3]);
            }

            let passPhrase = phraseWords.join(" ");
            crypto.getRandomValues(random);
            return passPhrase;
        } else {
            return '';
        }
    }
}

let transaction={
    verification(_this,model,sum){
        if(!model.to||model.to.length!=_this.$store.state.pageText.model.address.length){
            _this.$ons.notification.alert({
                'title':  _this.$t('l.prompt.title'),
                'message': _this.$t('l.error.addr')
            })
            return;
        }
        if (isNaN(parseFloat(model.count))||(parseFloat(model.count))>parseFloat(sum)
            ||(parseFloat(model.count))<1) {
            _this.$ons.notification.alert({
                'title':  _this.$t('l.prompt.title'),
                'message': _this.$t('l.error.amount')
            })
            return;
        }
        if (model.count != '' && model.to != '' ) {
            return true;
        }else{
            _this.$ons.notification.alert({
                'title':  _this.$t('l.prompt.title'),
                'message': _this.$t('l.error.message')
            })
        }

    },
    getPhrase(_this,publickey){
        return new Promise(function (resolve) {
            if (publickey != '') {
                _this.$g.wallet.getWallet(_this)
                    .then(model => {
                        if (model.plaintext != '') {
                            resolve({
                                phrase: model.plaintext,
                                publickey: publickey
                            })
                        }else{
                            _this.$ons.notification.alert({
                                'title': _this.$t('l.prompt.title'),
                                'message': '密码错误'
                            })
                        }
                    })
                    .catch(error => {
                        _this.$ons.notification.alert({
                            'title': _this.$t('l.prompt.title'),
                            'message': '密码错误'
                        })
                    })
            }
            else {
                _this.$ons.notification.prompt({
                    'inputType': 'password',
                    'title': _this.$t('l.prompt.title'),
                    'message': _this.$t('l.prompt.phrase'),
                    'callback': function (phrase) {
                        if (phrase != '') {
                            let publickey = _this.$nxt.secretPhraseToPublicKey(phrase)
                            let addr = _this.$nxt.publicKeyToAccountId(publickey, false).split('-');
                            addr.splice(0, 1)
                            let addr2 = _this.$store.state.wallet.list[0].address.split('-')
                            addr2.splice(0, 1)
                            if (addr.toString() == addr2.toString()) {
                                resolve({
                                    phrase: phrase,
                                    publickey: publickey
                                })
                            } else {
                                _this.$ons.notification.alert({
                                    title: _this.$t('l.prompt.title'),
                                    message: _this.$t('l.error.phrase'),
                                    buttonLabels: _this.$t('l.prompt.buttonLabels')[1],
                                })
                            }
                        }
                    }
                });
            }
        });
    },
    sendMoney(_this,account,model,coin){
        let formData = new FormData();
        formData.append("requestType", "sendMoney");
        formData.append("publicKey", account.publickey);
        formData.append("recipient", model.to);
        if(coin.txt=='Mtr'){
            formData.append("amountMQT", model.count * 100000000);
            formData.append("feeMQT", 0);
        }else if(coin.txt=='Apl'){
            formData.append("amountATM", model.count * 100000000);
            formData.append("feeATM", 0);
        } else {
            formData.append("amountNQT", model.count * 100000000);
            formData.append("feeNQT", 0);
        }
        if(coin.chainId){
            formData.append("chain", coin.chainId);
            formData.append("deadline", 15);
        }
        else{
            formData.append("deadline", 1440);
        }
        if(model.message.trim()!=''){
            formData.append("message", model.message);
            if(coin.chainId){
                formData.append("messageIsText",true);
                formData.append("messageIsPrunable",true);
                formData.append("referencedTransaction",'');
            }
        }
        return new Promise(function (resolve) {
            resolve(_this.$g.transaction.send(_this, account, coin, formData));
        });
    },
    leaseBalance(_this,account,model,coin){
        let formData = new FormData();
        formData.append("requestType", "leaseBalance");
        formData.append("publicKey", account.publickey);
        formData.append("period", model.period);
        formData.append("deadline", '60');
        formData.append("recipient", model.recipient);
        formData.append("feeNQT", 0);
        return new Promise(function (resolve) {
            resolve(_this.$g.transaction.send(_this, account, coin, formData));
        });
    },
    send(_this,account,coin,formData){
        return new Promise(function (resolve) {
            _this.$http.post(coin.api + '/' + coin.apikey, formData).then(v => {
                if (v.status == 200) {
                    if (v.data.errorDescription) {
                        _this.$ons.notification.alert({
                            'title': _this.$t('l.prompt.title'),
                            'message': v.data.errorDescription
                        })
                    }
                    else {
                        //Verification transaction
                        let objData = {};
                        objData.name=coin.txt
                        formData.forEach((value, key) => objData[key] = value);
                        objData.feeNQT = v.data.transactionJSON.feeNQT ? v.data.transactionJSON.feeNQT : v.data.minimumFeeFQT

                        if(coin.txt=='Mtr') {
                            objData.feeMQT = v.data.transactionJSON.feeMQT
                            objData.recipient = _this.$mtr.rsConvert(objData.recipient).account
                        }else if(coin.txt=='Apl') {
                            objData.feeATM = v.data.transactionJSON.feeATM
                            objData.recipient = _this.$nxt.rsConvert(_this.$g.wallet.addrReplace(objData.recipient, 'Nxt')).account
                        }else{
                            objData.recipient = _this.$nxt.rsConvert(_this.$g.wallet.addrReplace(objData.recipient, 'Nxt')).account
                        }

                        let t = _this.$g.wallet.verifyTransactionBytes(v.data.unsignedTransactionBytes, objData);

                         if (t) {
                            let transactionBytes = ''
                            if (coin.chainId) {
                                transactionBytes = {
                                    prunableAttachmentJSON: v.data.transactionJSON.attachment,
                                    transactionBytes: _this.$ardor.signTransactionBytes(v.data.unsignedTransactionBytes, account.phrase)
                                };
                            }
                            else {
                                transactionBytes = _this.$nxt.signTransactionBytes(v.data.unsignedTransactionBytes, account.phrase);
                            }
                             if(coin.txt=='Mtr'){
                                 transactionBytes = _this.$mtr.signTransactionBytes(v.data.unsignedTransactionBytes, account.phrase);
                             }
                            resolve({
                                data: v.data,
                                transactionBytes: transactionBytes
                            })
                        }
                        else {
                             _this.$ons.notification.alert({
                                 'title': _this.$t('l.prompt.title'),
                                 'message': '交易信息对比有误，请切换节点再次尝试'
                             })
                         }
                    }
                }
                else {
                    _this.$ons.notification.alert({
                        'title': _this.$t('l.prompt.title'),
                        'message': _this.$t('l.error.sent')
                    })
                }
            });
        });
    },
    broadcastTransaction(_this,coin,transactionBytes){
        let signed = new FormData();
        signed.append("requestType", "broadcastTransaction");
        if(coin.chainId) {
            signed.append("transactionBytes", transactionBytes.transactionBytes);
            signed.append("prunableAttachmentJSON", JSON.stringify(transactionBytes.prunableAttachmentJSON));
        }
        else {
            signed.append("transactionBytes",transactionBytes);
        }

        return new Promise(function (resolve) {
            _this.$http.post(coin.api + '/'+coin.apikey, signed).then(v => {
                if(v.data.error){
                    _this.$ons.notification.alert({
                        'title': this.$t('l.prompt.title'),
                        'message': v.data.errorDescription,
                    })
                    resolve(false);
                    return;
                }
                resolve(v.data);
            }).
            catch(error => {
                resolve(false);
                _this.$ons.notification.alert({
                    'title': _this.$t('l.prompt.title'),
                    'message': _this.$t('l.error.sent')
                })
            })
        });

    },
    getTransaction(_this,coin,transaction){
        return new Promise(function (resolve) {
            _this.$http.get(coin.api + '/'+coin.apikey+'?requestType=getTransaction&transaction='+transaction).then(v => {
                resolve(v.data);
            })
        })
    }
}

let app={
    scan(){
        document.getElementById('ding').style.display = 'block';
        document.getElementById('ding_selected').style.display = 'none';
        let _this=this;
        return new Promise(function (resolve) {
            let load = {
                initialize: function () {
                    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
                },
                onDeviceReady: function () {
                    QRScanner.prepare(onDone); // show the prompt
                    function onDone(err, status) {
                        if (err) {
                            // here we can handle errors and clean up any loose ends.
                            console.error(err);
                        }
                        if (status.authorized) {
                            var callback = function (err, contents) {
                                if (err) {
                                    console.error(err._message);
                                }
                                QRScanner.destroy(function(status){
                                    console.log(status);
                                });
                                document.getElementById('app').style.display = 'block';
                                document.getElementById('scan').style.display = 'none';
                                QRScanner.disableLight(function (err, status) {
                                    err && console.error(err);
                                    console.log(status);
                                });
                                QRScanner.hide(function (status) {
                                    console.log(status);
                                });
                                resolve(_this.isJSON(contents))

                            };

                            QRScanner.scan(callback);
                            QRScanner.show(function (status) {
                                console.log(status,'status');
                                document.getElementById('ding').onclick = function () {
                                    QRScanner.enableLight(function (err, status) {
                                        err && console.error(err);
                                        document.getElementById('ding_selected').style.display = 'block'
                                        document.getElementById('ding').style.display = 'none'
                                    });
                                };
                                document.getElementById('scan_cancel').onclick = function () {
                                    QRScanner.disableLight(function (err, status) {
                                        err && console.error(err);
                                        console.log(status);
                                    });
                                    QRScanner.hide(function(status){
                                        console.log('hide');
                                        console.log(status);
                                    });
                                    QRScanner.destroy(function(status){
                                        console.log(status);
                                    });
                                    document.getElementById('app').style.display = 'block'
                                    document.getElementById('scan').style.display = 'none'

                                }
                                document.getElementById('ding_selected').onclick = function () {
                                    QRScanner.disableLight(function (err, status) {
                                        err && console.error(err);
                                        console.log(status);
                                    });
                                    document.getElementById('ding').style.display = 'block'
                                    document.getElementById('ding_selected').style.display = 'none'
                                };
                                document.getElementById('app').style.display = 'none'
                                document.getElementById('scan').style.display = 'block'

                            });
                        } else if (status.denied) {
                            QRScanner.openSettings()
                        }
                        else {
                            // we didn't get permission, but we didn't get permanently denied. (On
                            // Android, a denial isn't permanent unless the user checks the "Don't
                            // ask again" box.) We can ask again at the next relevant opportunity.
                        }
                    }
                },
            }
            load.initialize();
        });
    },
    isJSON (str) {
        if (typeof str == 'string') {
            try {
                return  JSON.parse(str);
            } catch(e) {
                return str;
            }
        }
    }
}
export default {
    wallet,
    transaction,
    app
}
