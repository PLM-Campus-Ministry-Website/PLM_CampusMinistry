import { Component } from '@angular/core';

interface SongResult {
  name: string;
  category: string;
  season: string;
  filePath?: string; // Path to MP3 file (e.g., 'assets/music/general/entrance/papuri-sa-diyos.mp3')
}

@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
export class MusicPage {
  openFolders: Set<string> = new Set();
  openSubfolders: Map<string, Set<string>> = new Map();
  searchQuery: string = '';
  filteredSongs: SongResult[] = [];
  allSongs: SongResult[] = [];

  generalMassParts = [
    {
      key: 'entrance',
      name: 'Entrance / Opening Hymns',
      songs: [
        { name: 'Papuri sa Diyos', filePath: 'assets/music/general/entrance/papuri-sa-diyos.mp3' },
        { name: 'Purihin ang Panginoon', filePath: 'assets/music/general/entrance/purihin-ang-panginoon.mp3' },
        { name: 'Halina\'t Magpuri', filePath: 'assets/music/general/entrance/halina-t-magpuri.mp3' },
        { name: 'Awit ng Paghilom (for healing liturgies)', filePath: 'assets/music/general/entrance/awit-ng-paghilom.mp3' },
        { name: 'Sa\'Yo Lamang', filePath: 'assets/music/general/entrance/sa-yo-lamang.mp3' },
        { name: 'Come, Let Us Worship', filePath: 'assets/music/general/entrance/come-let-us-worship.mp3' }
      ]
    },
    {
      key: 'kyrie',
      name: 'Kyrie (Panginoon Maawa Ka)',
      songs: [
        { name: 'Panginoon Maawa Ka (Himig Heswita)', filePath: 'assets/music/general/kyrie/panginoon-maawa-ka-himig-heswita.mp3' },
        { name: 'Panginoon Maawa Ka (Mass of St. John)', filePath: 'assets/music/general/kyrie/panginoon-maawa-ka-mass-of-st-john.mp3' }
      ]
    },
    {
      key: 'gloria',
      name: 'Gloria',
      songs: [
        { name: 'Papuri sa Diyos (Himig Heswita)', filePath: 'assets/music/general/gloria/papuri-sa-diyos-himig-heswita.mp3' },
        { name: 'Luwalhati sa Diyos (Bukas Palad)', filePath: 'assets/music/general/gloria/luwalhati-sa-diyos-bukas-palad.mp3' },
        { name: 'Gloria (Mass of Christ the King)', filePath: 'assets/music/general/gloria/gloria-mass-of-christ-the-king.mp3' }
      ]
    },
    {
      key: 'psalm',
      name: 'Responsorial Psalm',
      songs: [
        { name: 'Psalm 23 – Pastol Ka ng Bayan', filePath: 'assets/music/general/psalm/psalm-23-pastol-ka-ng-bayan.mp3' },
        { name: 'Psalm 51 – Poon, Kaawaan Mo Ako', filePath: 'assets/music/general/psalm/psalm-51-poon-kaawaan-mo-ako.mp3' },
        { name: 'Psalm 95 – Halina\'t Purihin ang Diyos', filePath: 'assets/music/general/psalm/psalm-95-halina-t-purihin-ang-diyos.mp3' }
      ]
    },
    {
      key: 'gospel',
      name: 'Gospel Acclamation',
      songs: [
        { name: 'Aleluya (Traditional Filipino Chant)', filePath: 'assets/music/general/gospel/aleluya-traditional-filipino-chant.mp3' },
        { name: 'Aleluya! (Bukas Palad)', filePath: 'assets/music/general/gospel/aleluya-bukas-palad.mp3' },
        { name: 'Aleluya, Purihin ang Diyos', filePath: 'assets/music/general/gospel/aleluya-purihin-ang-diyos.mp3' }
      ]
    },
    {
      key: 'offertory',
      name: 'Offertory',
      songs: [
        { name: 'Kunin at Tanggapin', filePath: 'assets/music/general/offertory/kunin-at-tanggapin.mp3' },
        { name: 'Narito Kami', filePath: 'assets/music/general/offertory/narito-kami.mp3' },
        { name: 'Take and Receive', filePath: 'assets/music/general/offertory/take-and-receive.mp3' },
        { name: 'Sa Bilang ng Araw', filePath: 'assets/music/general/offertory/sa-bilang-ng-araw.mp3' },
        { name: 'Paghahandog', filePath: 'assets/music/general/offertory/paghahandog.mp3' }
      ]
    },
    {
      key: 'holy',
      name: 'Holy (Santo)',
      songs: [
        { name: 'Santo (Mass of St. John)', filePath: 'assets/music/general/holy/santo-mass-of-st-john.mp3' },
        { name: 'Santo, Santo (Bukas Palad)', filePath: 'assets/music/general/holy/santo-santo-bukas-palad.mp3' },
        { name: 'Santo (Lent Mass Setting – no Gloria)', filePath: 'assets/music/general/holy/santo-lent-mass-setting-no-gloria.mp3' }
      ]
    },
    {
      key: 'mystery',
      name: 'Mystery of Faith',
      songs: [
        { name: 'Si Kristo ay Namatay', filePath: 'assets/music/general/mystery/si-kristo-ay-namatay.mp3' },
        { name: 'When We Eat This Bread', filePath: 'assets/music/general/mystery/when-we-eat-this-bread.mp3' }
      ]
    },
    {
      key: 'amen',
      name: 'Great Amen',
      songs: [
        { name: 'Amen (Himig Heswita)', filePath: 'assets/music/general/amen/amen-himig-heswita.mp3' },
        { name: 'Amen (Mass for Peace)', filePath: 'assets/music/general/amen/amen-mass-for-peace.mp3' }
      ]
    },
    {
      key: 'lamb',
      name: 'Lamb of God (Kordero ng Diyos)',
      songs: [
        { name: 'Kordero ng Diyos (Bukas Palad)', filePath: 'assets/music/general/lamb/kordero-ng-diyos-bukas-palad.mp3' },
        { name: 'Kordero ng Diyos (Mass of St. John)', filePath: 'assets/music/general/lamb/kordero-ng-diyos-mass-of-st-john.mp3' }
      ]
    },
    {
      key: 'communion',
      name: 'Communion Hymns',
      songs: [
        { name: 'Kordero ng Diyos / Lamb of God meditative', filePath: 'assets/music/general/communion/kordero-ng-diyos-lamb-of-god-meditative.mp3' },
        { name: 'Huwag Mangamba', filePath: 'assets/music/general/communion/huwag-mangamba.mp3' },
        { name: 'Tanging Yaman', filePath: 'assets/music/general/communion/tanging-yaman.mp3' },
        { name: 'Kahit Isang Saglit', filePath: 'assets/music/general/communion/kahit-isang-saglit.mp3' },
        { name: 'Anima Christi (Bukas Palad)', filePath: 'assets/music/general/communion/anima-christi-bukas-palad.mp3' },
        { name: 'Dakilang Pag-ibig', filePath: 'assets/music/general/communion/dakilang-pag-ibig.mp3' },
        { name: 'Panalangin sa Pagiging Bukas Palad', filePath: 'assets/music/general/communion/panalangin-sa-pagiging-bukas-palad.mp3' }
      ]
    },
    {
      key: 'recessional',
      name: 'Recessional',
      songs: [
        { name: 'Humayo\'t Ihayag', filePath: 'assets/music/general/recessional/humayo-t-ihayag.mp3' },
        { name: 'I Will Sing Forever', filePath: 'assets/music/general/recessional/i-will-sing-forever.mp3' },
        { name: 'Ipagdiwang si Kristo', filePath: 'assets/music/general/recessional/ipagdiwang-si-kristo.mp3' },
        { name: 'Pananagutan', filePath: 'assets/music/general/recessional/pananagutan.mp3' },
        { name: 'Stand By Me Still', filePath: 'assets/music/general/recessional/stand-by-me-still.mp3' }
      ]
    }
  ];

  seasons = [
    {
      key: 'advent',
      name: 'ADVENT',
      categories: [
        {
          key: 'entrance',
          name: 'Entrance',
          songs: [
            { name: 'O Come, O Come Emmanuel', filePath: 'assets/music/advent/entrance/o-come-o-come-emmanuel.mp3' },
            { name: 'Halina Hesus, Halina', filePath: 'assets/music/advent/entrance/halina-hesus-halina.mp3' },
            { name: 'Bayan, Magsaya!', filePath: 'assets/music/advent/entrance/bayan-magsaya.mp3' }
          ]
        },
        {
          key: 'offertory',
          name: 'Offertory',
          songs: [
            { name: 'Sa Araw ng Pasko (Advent version)', filePath: 'assets/music/advent/offertory/sa-araw-ng-pasko-advent-version.mp3' },
            { name: 'Paghahandog ng Puso', filePath: 'assets/music/advent/offertory/paghahandog-ng-puso.mp3' }
          ]
        },
        {
          key: 'communion',
          name: 'Communion',
          songs: [
            { name: 'Emmanuel (Bukas Palad)', filePath: 'assets/music/advent/communion/emmanuel-bukas-palad.mp3' },
            { name: 'Halina Jesus, Halina (slow version)', filePath: 'assets/music/advent/communion/halina-jesus-halina-slow-version.mp3' }
          ]
        },
        {
          key: 'recessional',
          name: 'Recessional',
          songs: [
            { name: 'Magsiawit sa Panginoon', filePath: 'assets/music/advent/recessional/magsiawit-sa-panginoon.mp3' },
            { name: 'Tanda ng Pag-asa', filePath: 'assets/music/advent/recessional/tanda-ng-pag-asa.mp3' }
          ]
        }
      ]
    },
    {
      key: 'christmas',
      name: 'CHRISTMAS SEASON',
      categories: [
        {
          key: 'entrance',
          name: 'Entrance',
          songs: [
            { name: 'Pasko Na!', filePath: 'assets/music/christmas/entrance/pasko-na.mp3' },
            { name: 'Hark! The Herald Angels Sing', filePath: 'assets/music/christmas/entrance/hark-the-herald-angels-sing.mp3' },
            { name: 'O Come All Ye Faithful', filePath: 'assets/music/christmas/entrance/o-come-all-ye-faithful.mp3' },
            { name: 'Sa Maybahay (Liturgical version)', filePath: 'assets/music/christmas/entrance/sa-maybahay-liturgical-version.mp3' }
          ]
        },
        {
          key: 'offertory',
          name: 'Offertory',
          songs: [
            { name: 'Ang Pasko ay Sumapit (Liturgical)', filePath: 'assets/music/christmas/offertory/ang-pasko-ay-sumapit-liturgical.mp3' },
            { name: 'Handog ng mga Pastol', filePath: 'assets/music/christmas/offertory/handog-ng-mga-pastol.mp3' }
          ]
        },
        {
          key: 'communion',
          name: 'Communion',
          songs: [
            { name: 'Silent Night', filePath: 'assets/music/christmas/communion/silent-night.mp3' },
            { name: 'O Holy Night', filePath: 'assets/music/christmas/communion/o-holy-night.mp3' },
            { name: 'Payapang Daigdig', filePath: 'assets/music/christmas/communion/payapang-daigdig.mp3' }
          ]
        },
        {
          key: 'recessional',
          name: 'Recessional',
          songs: [
            { name: 'Joy to the World', filePath: 'assets/music/christmas/recessional/joy-to-the-world.mp3' },
            { name: 'Noche Buena (Liturgical adaptation)', filePath: 'assets/music/christmas/recessional/noche-buena-liturgical-adaptation.mp3' }
          ]
        }
      ]
    },
    {
      key: 'lent',
      name: 'LENTEN SEASON',
      categories: [
        {
          key: 'entrance',
          name: 'Entrance',
          songs: [
            { name: 'Ako\'y Magbabalik', filePath: 'assets/music/lent/entrance/ako-y-magbabalik.mp3' },
            { name: 'Buksan ang Aming Puso', filePath: 'assets/music/lent/entrance/buksan-ang-aming-puso.mp3' },
            { name: 'Hosea (Come Back to Me)', filePath: 'assets/music/lent/entrance/hosea-come-back-to-me.mp3' },
            { name: 'Daghang Salamat Ginoo (Visayan)', filePath: 'assets/music/lent/entrance/daghang-salamat-ginoo-visayan.mp3' }
          ]
        },
        {
          key: 'offertory',
          name: 'Offertory',
          songs: [
            { name: 'Poon, Narito Ako', filePath: 'assets/music/lent/offertory/poon-narito-ako.mp3' },
            { name: 'Pag-ibig Mo Ama', filePath: 'assets/music/lent/offertory/pag-ibig-mo-ama.mp3' },
            { name: 'Ang Tanging Alay Ko', filePath: 'assets/music/lent/offertory/ang-tanging-alay-ko.mp3' }
          ]
        },
        {
          key: 'communion',
          name: 'Communion',
          songs: [
            { name: 'Sa \'Yo Jesus', filePath: 'assets/music/lent/communion/sa-yo-jesus.mp3' },
            { name: 'Dakilang Pag-ibig', filePath: 'assets/music/lent/communion/dakilang-pag-ibig.mp3' },
            { name: 'Paghilom', filePath: 'assets/music/lent/communion/paghilom.mp3' }
          ]
        },
        {
          key: 'recessional',
          name: 'Recessional',
          songs: [
            { name: 'Humayo Tayo sa Kapayapaan', filePath: 'assets/music/lent/recessional/humayo-tayo-sa-kapayapaan.mp3' },
            { name: 'Pananagutan', filePath: 'assets/music/lent/recessional/pananagutan.mp3' }
          ]
        }
      ]
    },
    {
      key: 'holyweek',
      name: 'HOLY WEEK',
      categories: [
        {
          key: 'palmsunday',
          name: 'Palm Sunday',
          songs: [
            { name: 'Hosanna sa Anak ni David', filePath: 'assets/music/holyweek/palmsunday/hosanna-sa-anak-ni-david.mp3' },
            { name: 'Hosanna to the Son of David', filePath: 'assets/music/holyweek/palmsunday/hosanna-to-the-son-of-david.mp3' }
          ]
        },
        {
          key: 'holythursday',
          name: 'Holy Thursday',
          songs: [
            { name: 'Ubi Caritas', filePath: 'assets/music/holyweek/holythursday/ubi-caritas.mp3' },
            { name: 'Where Charity and Love Prevail', filePath: 'assets/music/holyweek/holythursday/where-charity-and-love-prevail.mp3' },
            { name: 'Panunumpa sa Pag-ibig (Washing of the Feet)', filePath: 'assets/music/holyweek/holythursday/panunumpa-sa-pag-ibig-washing-of-the-feet.mp3' }
          ]
        },
        {
          key: 'goodfriday',
          name: 'Good Friday',
          songs: [
            { name: 'Pieta', filePath: 'assets/music/holyweek/goodfriday/pieta.mp3' },
            { name: 'Ama Namin (chant)', filePath: 'assets/music/holyweek/goodfriday/ama-namin-chant.mp3' },
            { name: 'Were You There', filePath: 'assets/music/holyweek/goodfriday/were-you-there.mp3' },
            { name: 'O Sacred Head Surrounded', filePath: 'assets/music/holyweek/goodfriday/o-sacred-head-surrounded.mp3' }
          ]
        },
        {
          key: 'eastervigil',
          name: 'Easter Vigil',
          songs: [
            { name: 'Exsultet chant', filePath: 'assets/music/holyweek/eastervigil/exsultet-chant.mp3' },
            { name: 'Liwanag ng Pasko ng Pagkabuhay', filePath: 'assets/music/holyweek/eastervigil/liwanag-ng-pasko-ng-pagkabuhay.mp3' },
            { name: 'Alleluia! The Strife is O\'er', filePath: 'assets/music/holyweek/eastervigil/alleluia-the-strife-is-oer.mp3' }
          ]
        }
      ]
    },
    {
      key: 'easter',
      name: 'EASTER SEASON',
      categories: [
        {
          key: 'entrance',
          name: 'Entrance',
          songs: [
            { name: 'Jesus Christ Is Risen Today', filePath: 'assets/music/easter/entrance/jesus-christ-is-risen-today.mp3' },
            { name: 'Alleluia! Let the Holy Anthem Rise', filePath: 'assets/music/easter/entrance/alleluia-let-the-holy-anthem-rise.mp3' },
            { name: 'Sumigaw sa Galak', filePath: 'assets/music/easter/entrance/sumigaw-sa-galak.mp3' }
          ]
        },
        {
          key: 'offertory',
          name: 'Offertory',
          songs: [
            { name: 'Bulawanong Gasa (Visayan)', filePath: 'assets/music/easter/offertory/bulawanong-gasa-visayan.mp3' },
            { name: 'Paghahandog', filePath: 'assets/music/easter/offertory/paghahandog.mp3' }
          ]
        },
        {
          key: 'communion',
          name: 'Communion',
          songs: [
            { name: 'Resucitó', filePath: 'assets/music/easter/communion/resucito.mp3' },
            { name: 'Anima Christi (Easter melody)', filePath: 'assets/music/easter/communion/anima-christi-easter-melody.mp3' }
          ]
        },
        {
          key: 'recessional',
          name: 'Recessional',
          songs: [
            { name: 'Humayo kay Kristo', filePath: 'assets/music/easter/recessional/humayo-kay-kristo.mp3' },
            { name: 'I Will Sing Forever', filePath: 'assets/music/easter/recessional/i-will-sing-forever.mp3' }
          ]
        }
      ]
    },
    {
      key: 'pentecost',
      name: 'PENTECOST',
      categories: [
        {
          key: 'entrance',
          name: 'Entrance',
          songs: [
            { name: 'Veni Sancte Spiritus', filePath: 'assets/music/pentecost/entrance/veni-sancte-spiritus.mp3' },
            { name: 'Come Holy Spirit', filePath: 'assets/music/pentecost/entrance/come-holy-spirit.mp3' },
            { name: 'Espiritu Santo, Bayan Mo\'y Gabayan', filePath: 'assets/music/pentecost/entrance/espiritu-santo-bayan-mo-y-gabayan.mp3' }
          ]
        },
        {
          key: 'offertory',
          name: 'Offertory',
          songs: [
            { name: 'Paghahandog ng Puso', filePath: 'assets/music/pentecost/offertory/paghahandog-ng-puso.mp3' }
          ]
        },
        {
          key: 'communion',
          name: 'Communion',
          songs: [
            { name: 'Banal na Espiritu, Tanging Hiling', filePath: 'assets/music/pentecost/communion/banal-na-espiritu-tanging-hiling.mp3' },
            { name: 'Renew Me O Spirit of the Lord', filePath: 'assets/music/pentecost/communion/renew-me-o-spirit-of-the-lord.mp3' }
          ]
        },
        {
          key: 'recessional',
          name: 'Recessional',
          songs: [
            { name: 'Go Out Into the World', filePath: 'assets/music/pentecost/recessional/go-out-into-the-world.mp3' },
            { name: 'Humayo\'t Ihayag', filePath: 'assets/music/pentecost/recessional/humayo-t-ihayag.mp3' }
          ]
        }
      ]
    },
    {
      key: 'ordinary',
      name: 'ORDINARY TIME',
      categories: [
        {
          key: 'entrance',
          name: 'Entrance',
          songs: [
            { name: 'Purihin ang Panginoon', filePath: 'assets/music/ordinary/entrance/purihin-ang-panginoon.mp3' },
            { name: 'Halina\'t Magpuri', filePath: 'assets/music/ordinary/entrance/halina-t-magpuri.mp3' },
            { name: 'Bayan, Magsiawit', filePath: 'assets/music/ordinary/entrance/bayan-magsiawit.mp3' }
          ]
        },
        {
          key: 'offertory',
          name: 'Offertory',
          songs: [
            { name: 'Kunin at Tanggapin', filePath: 'assets/music/ordinary/offertory/kunin-at-tanggapin.mp3' },
            { name: 'Sa Iyong mga Yapak', filePath: 'assets/music/ordinary/offertory/sa-iyong-mga-yapak.mp3' }
          ]
        },
        {
          key: 'communion',
          name: 'Communion',
          songs: [
            { name: 'Tanging Yaman', filePath: 'assets/music/ordinary/communion/tanging-yaman.mp3' },
            { name: 'Huwag Mangamba', filePath: 'assets/music/ordinary/communion/huwag-mangamba.mp3' },
            { name: 'Sa\'Yo Lamang', filePath: 'assets/music/ordinary/communion/sa-yo-lamang.mp3' }
          ]
        },
        {
          key: 'recessional',
          name: 'Recessional',
          songs: [
            { name: 'Ipagdiwang si Kristo', filePath: 'assets/music/ordinary/recessional/ipagdiwang-si-kristo.mp3' },
            { name: 'Pananagutan', filePath: 'assets/music/ordinary/recessional/pananagutan.mp3' }
          ]
        }
      ]
    },
    {
      key: 'marian',
      name: 'MARIAN FEASTS & MAY DEVOTIONS',
      categories: [
        {
          key: 'entrance',
          name: 'Entrance',
          songs: [
            { name: 'Ave Maria (Bukas Palad)', filePath: 'assets/music/marian/entrance/ave-maria-bukas-palad.mp3' },
            { name: 'Hail Mary, Gentle Woman', filePath: 'assets/music/marian/entrance/hail-mary-gentle-woman.mp3' },
            { name: 'Maria, Bukang Liwayway', filePath: 'assets/music/marian/entrance/maria-bukang-liwayway.mp3' }
          ]
        },
        {
          key: 'offertory',
          name: 'Offertory',
          songs: [
            { name: 'Birheng Maria, Ina ng Diyos', filePath: 'assets/music/marian/offertory/birheng-maria-ina-ng-diyos.mp3' }
          ]
        },
        {
          key: 'communion',
          name: 'Communion',
          songs: [
            { name: 'Sa Piling Mo Maria', filePath: 'assets/music/marian/communion/sa-piling-mo-maria.mp3' },
            { name: 'Magnificat', filePath: 'assets/music/marian/communion/magnificat.mp3' }
          ]
        },
        {
          key: 'recessional',
          name: 'Recessional',
          songs: [
            { name: 'Regina Coeli', filePath: 'assets/music/marian/recessional/regina-coeli.mp3' },
            { name: 'Salve Regina', filePath: 'assets/music/marian/recessional/salve-regina.mp3' }
          ]
        }
      ]
    }
  ];

  toggleFolder(folderKey: string) {
    if (this.openFolders.has(folderKey)) {
      this.openFolders.delete(folderKey);
      this.openSubfolders.delete(folderKey);
    } else {
      this.openFolders.add(folderKey);
    }
  }

  toggleSubfolder(folderKey: string, subfolderKey: string) {
    const key = `${folderKey}-${subfolderKey}`;
    if (!this.openSubfolders.has(folderKey)) {
      this.openSubfolders.set(folderKey, new Set());
    }
    const subfolders = this.openSubfolders.get(folderKey)!;
    if (subfolders.has(subfolderKey)) {
      subfolders.delete(subfolderKey);
    } else {
      subfolders.add(subfolderKey);
    }
  }

  isOpen(folderKey: string): boolean {
    return this.openFolders.has(folderKey);
  }

  isSubfolderOpen(folderKey: string, subfolderKey: string): boolean {
    const subfolders = this.openSubfolders.get(folderKey);
    return subfolders ? subfolders.has(subfolderKey) : false;
  }

  constructor() {
    this.initializeAllSongs();
  }

  /**
   * Helper function to generate file path for a song
   * Template: assets/music/{season}/{category}/{filename}.mp3
   */
  generateFilePath(season: string, category: string, songName: string): string {
    // Convert season name to folder name
    const seasonFolder = season.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/&/g, '')
      .replace(/-/g, '');
    
    // Convert category name to folder name
    const categoryFolder = category.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/–/g, '-')
      .replace(/\//g, '-');
    
    // Convert song name to filename
    const filename = songName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/['"]/g, '')
      .replace(/–/g, '-')
      .replace(/\//g, '-')
      .replace(/\./g, '')
      .replace(/,/g, '');
    
    return `assets/music/${seasonFolder}/${categoryFolder}/${filename}.mp3`;
  }

  /**
   * Helper function to convert string song to song object with filePath
   */
  createSongObject(song: string | { name: string; filePath?: string }, category: string, season: string): SongResult {
    if (typeof song === 'string') {
      return {
        name: song,
        category: category,
        season: season,
        filePath: this.generateFilePath(season, category, song)
      };
    } else {
      return {
        name: song.name,
        category: category,
        season: season,
        filePath: song.filePath || this.generateFilePath(season, category, song.name)
      };
    }
  }

  initializeAllSongs() {
    // Add General Mass Parts songs
    this.generalMassParts.forEach(category => {
      category.songs.forEach(song => {
        const songObj = this.createSongObject(song, category.name, 'General Mass Parts');
        this.allSongs.push(songObj);
      });
    });

    // Add Seasonal songs
    this.seasons.forEach(season => {
      season.categories.forEach(category => {
        category.songs.forEach(song => {
          const songObj = this.createSongObject(song, category.name, season.name);
          this.allSongs.push(songObj);
        });
      });
    });
  }

  onSearch() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredSongs = [];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredSongs = this.allSongs.filter(song => 
      song.name.toLowerCase().includes(query) ||
      song.category.toLowerCase().includes(query) ||
      song.season.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredSongs = [];
  }

  /**
   * Helper function to get song name (handles both string and object formats)
   */
  getSongName(song: string | { name: string; filePath?: string }): string {
    return typeof song === 'string' ? song : song.name;
  }

  /**
   * Helper function to get song file path (handles both string and object formats)
   */
  getSongFilePath(song: string | { name: string; filePath?: string }): string | null {
    if (typeof song === 'string') {
      return null; // No file path for string songs
    }
    return song.filePath || null;
  }
}
