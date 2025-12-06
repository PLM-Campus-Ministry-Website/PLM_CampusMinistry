import { Injectable } from '@angular/core';

export interface PrayerText {
  title: string;
  text: string;
}

export interface RosaryPrayers {
  signOfTheCross: PrayerText;
  apostlesCreed: PrayerText;
  ourFather: PrayerText;
  hailMary: PrayerText;
  gloryBe: PrayerText;
  fatimaPrayer: PrayerText;
  hailHolyQueen: PrayerText;
  mysteries: {
    joyful: string[];
    luminous: string[];
    sorrowful: string[];
    glorious: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class RosaryDataService {
  
  getPrayers(language: 'english' | 'tagalog' | 'latin'): RosaryPrayers {
    switch (language) {
      case 'english':
        return this.getEnglishPrayers();
      case 'tagalog':
        return this.getTagalogPrayers();
      case 'latin':
        return this.getLatinPrayers();
      default:
        return this.getEnglishPrayers();
    }
  }

  private getEnglishPrayers(): RosaryPrayers {
    return {
      signOfTheCross: {
        title: 'Sign of the Cross',
        text: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.'
      },
      apostlesCreed: {
        title: 'The Apostles\' Creed',
        text: 'I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.'
      },
      ourFather: {
        title: 'Our Father',
        text: 'Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.'
      },
      hailMary: {
        title: 'Hail Mary',
        text: 'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.'
      },
      gloryBe: {
        title: 'Glory Be',
        text: 'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.'
      },
      fatimaPrayer: {
        title: 'Fatima Prayer',
        text: 'O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those who have most need of Thy mercy. Amen.'
      },
      hailHolyQueen: {
        title: 'Hail, Holy Queen',
        text: 'Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.'
      },
      mysteries: {
        joyful: [
          'The Annunciation',
          'The Visitation',
          'The Nativity',
          'The Presentation',
          'The Finding of Jesus in the Temple'
        ],
        luminous: [
          'The Baptism of Jesus',
          'The Wedding at Cana',
          'The Proclamation of the Kingdom',
          'The Transfiguration',
          'The Institution of the Eucharist'
        ],
        sorrowful: [
          'The Agony in the Garden',
          'The Scourging at the Pillar',
          'The Crowning with Thorns',
          'The Carrying of the Cross',
          'The Crucifixion'
        ],
        glorious: [
          'The Resurrection',
          'The Ascension',
          'The Descent of the Holy Spirit',
          'The Assumption',
          'The Coronation of Mary'
        ]
      }
    };
  }

  private getTagalogPrayers(): RosaryPrayers {
    return {
      signOfTheCross: {
        title: 'Pag-aantanda',
        text: 'Sa ngalan ng Ama, at ng Anak, at ng Espiritu Santo. Amen.'
      },
      apostlesCreed: {
        title: 'Sumasampalataya',
        text: 'Sumasampalataya ako sa Diyos Amang makapangyarihan sa lahat, na maylalang ng langit at lupa. At kay Hesukristo, kaisa-isang Anak niya, Panginoon natin. Na ipinaglihi sa kapangyarihan ng Espiritu Santo, ipinanganak ni Maria Birhen, nagtiis sa ilalim ni Poncio Pilato, ipinako sa krus, namatay at inilibing. Bumaba sa lugar ng mga patay. Nang ikatlong araw ay muling nabuhay. Umakyat sa langit, nakaupo sa kanan ng Diyos Amang makapangyarihan sa lahat. Mula doon ay darating upang humatol sa mga buhay at patay. Sumasampalataya ako sa Espiritu Santo, sa Banal na Simbahang Katolika, sa pakikipag-isa ng mga banal, sa kapatawaran ng mga kasalanan, sa pagkabuhay na mag-uli ng katawan, at sa buhay na walang hanggan. Amen.'
      },
      ourFather: {
        title: 'Ama Namin',
        text: 'Ama namin, sumasalangit Ka, sambahin ang ngalan Mo, mapasaamin ang kaharian Mo, sundin ang loob Mo, dito sa lupa para nang sa langit. Bigyan Mo kami ngayon ng aming kakanin sa araw-araw, at patawarin Mo kami sa aming mga sala, para nang pagpapatavad namin sa mga nagkakasala sa amin. At huwag Mo kaming ipahintulot sa tukso, at iadya Mo kami sa lahat ng masama. Amen.'
      },
      hailMary: {
        title: 'Aba Ginoong Maria',
        text: 'Aba Ginoong Maria, napupuno ka ng grasiya, ang Panginoong Diyos ay sumasaiyo. Bukod kang pinagpala sa babaeng lahat, at pinagpala naman ang iyong Anak na si Hesus. Santa Maria, Ina ng Diyos, ipanalangin mo kami na makasalanan, ngayon at kung kami mamamatay. Amen.'
      },
      gloryBe: {
        title: 'Luwalhati',
        text: 'Luwalhati sa Ama, at sa Anak, at sa Espiritu Santo. Kapara nang noong una, ngayon, at magpakailanman, at sa mga walang hanggang panahon. Amen.'
      },
      fatimaPrayer: {
        title: 'Panalangin ng Fatima',
        text: 'O aking Hesus, patawarin Mo kami sa aming mga kasalanan, iligtas Mo kami sa apoy ng impiyerno, at dalhin Mo sa langit ang lahat ng kaluluwa, lalong-lalo na ang mga lubhang nangangailangan ng Iyong awa. Amen.'
      },
      hailHolyQueen: {
        title: 'Aba, Mahal na Birhen',
        text: 'Aba, Mahal na Birhen, Ina ng awa, buhay, katamisan at pag-asa namin, ikaw ang aming dinadalanginan. Ikaw ang aming hinihingan ng tulong, mga anak ni Eba na nangabubuhay sa lupa. Sa iyo kami nananangis, humihibik at tumatangis sa lalong mapait na lambak ng luha. Kaya, ikaw na aming tagapamagitan, itingin mo sa amin ang iyong mga matang maawain. At pagkatapos ng aming pagkabihag, ipakita mo sa amin si Hesus, ang pinagpalang bunga ng iyong sinapupunan. O maawain, o mapagmahal, o matamis na Birheng Maria. Ipanalangin mo kami, O banal na Ina ng Diyos, upang kami ay maging karapat-dapat sa mga pangako ni Kristo. Amen.'
      },
      mysteries: {
        joyful: [
          'Ang Pagpapahayag',
          'Ang Pagdalaw',
          'Ang Pagsilang',
          'Ang Pagpapakita',
          'Ang Pagkakatagpo kay Hesus sa Templo'
        ],
        luminous: [
          'Ang Pagbibinyag ni Hesus',
          'Ang Kasal sa Cana',
          'Ang Pahayag ng Kaharian',
          'Ang Pagbabagong-anyo',
          'Ang Pagtatatag ng Eukaristiya'
        ],
        sorrowful: [
          'Ang Paghihirap sa Hardin',
          'Ang Paghampas sa Haligi',
          'Ang Pagpuputong ng Tinik',
          'Ang Pagpapasan ng Krus',
          'Ang Pagpapako sa Krus'
        ],
        glorious: [
          'Ang Muling Pagkabuhay',
          'Ang Pag-akyat sa Langit',
          'Ang Pagbaba ng Espiritu Santo',
          'Ang Pag-aakyat ni Maria',
          'Ang Pagkokorona kay Maria'
        ]
      }
    };
  }

  private getLatinPrayers(): RosaryPrayers {
    return {
      signOfTheCross: {
        title: 'Signum Crucis',
        text: 'In nomine Patris, et Filii, et Spiritus Sancti. Amen.'
      },
      apostlesCreed: {
        title: 'Symbolum Apostolorum',
        text: 'Credo in Deum Patrem omnipotentem, Creatorem caeli et terrae. Et in Iesum Christum, Filium eius unicum, Dominum nostrum, qui conceptus est de Spiritu Sancto, natus ex Maria Virgine, passus sub Pontio Pilato, crucifixus, mortuus, et sepultus, descendit ad inferos, tertia die resurrexit a mortuis, ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis, inde venturus est iudicare vivos et mortuos. Credo in Spiritum Sanctum, sanctam Ecclesiam catholicam, sanctorum communionem, remissionem peccatorum, carnis resurrectionem, vitam aeternam. Amen.'
      },
      ourFather: {
        title: 'Pater Noster',
        text: 'Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie, et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.'
      },
      hailMary: {
        title: 'Ave Maria',
        text: 'Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.'
      },
      gloryBe: {
        title: 'Gloria Patri',
        text: 'Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.'
      },
      fatimaPrayer: {
        title: 'Oratio Fatimae',
        text: 'O mi Iesu, dimitte nobis debita nostra, libera nos ab igne inferni, perduc in caelum omnes animas, praesertim eas quae maxime indigent misericordia tua. Amen.'
      },
      hailHolyQueen: {
        title: 'Salve Regina',
        text: 'Salve Regina, Mater misericordiae, vita, dulcedo, et spes nostra, salve. Ad te clamamus, exsules filii Hevae. Ad te suspiramus, gementes et flentes in hac lacrimarum valle. Eia ergo, advocata nostra, illos tuos misericordes oculos ad nos converte. Et Iesum, benedictum fructum ventris tui, nobis post hoc exilium ostende. O clemens, o pia, o dulcis Virgo Maria. Ora pro nobis, sancta Dei Genitrix, ut digni efficiamur promissionibus Christi. Amen.'
      },
      mysteries: {
        joyful: [
          'Annuntiatio',
          'Visitatio',
          'Nativitas',
          'Praesentatio',
          'Inventio in Templo'
        ],
        luminous: [
          'Baptismus Iesu',
          'Nuptiae in Cana',
          'Proclamatio Regni',
          'Transfiguratio',
          'Institutio Eucharistiae'
        ],
        sorrowful: [
          'Agonia in Horto',
          'Flagellatio',
          'Coronatio Spinis',
          'Baiulatio Crucis',
          'Crucifixio'
        ],
        glorious: [
          'Resurrectio',
          'Ascensio',
          'Descensus Spiritus Sancti',
          'Assumptio',
          'Coronatio Mariae'
        ]
      }
    };
  }
}



