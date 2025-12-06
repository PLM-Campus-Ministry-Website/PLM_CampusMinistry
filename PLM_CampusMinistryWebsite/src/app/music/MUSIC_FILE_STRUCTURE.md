# Music File Structure Guide

## Where to Place MP3 Files

All MP3 files should be placed in the `src/assets/music/` directory following this structure:

```
src/assets/music/
├── general/                          # General Mass Parts (All Seasons)
│   ├── entrance/
│   │   ├── papuri-sa-diyos.mp3
│   │   ├── purihin-ang-panginoon.mp3
│   │   ├── halina-t-magpuri.mp3
│   │   ├── awit-ng-paghilom.mp3
│   │   ├── sa-yo-lamang.mp3
│   │   └── come-let-us-worship.mp3
│   ├── kyrie/
│   │   ├── panginoon-maawa-ka-himig-heswita.mp3
│   │   └── panginoon-maawa-ka-mass-of-st-john.mp3
│   ├── gloria/
│   │   ├── papuri-sa-diyos-himig-heswita.mp3
│   │   ├── luwalhati-sa-diyos-bukas-palad.mp3
│   │   └── gloria-mass-of-christ-the-king.mp3
│   ├── psalm/
│   │   ├── psalm-23-pastol-ka-ng-bayan.mp3
│   │   ├── psalm-51-poon-kaawaan-mo-ako.mp3
│   │   └── psalm-95-halina-t-purihin-ang-diyos.mp3
│   ├── gospel/
│   │   ├── aleluya-traditional-filipino-chant.mp3
│   │   ├── aleluya-bukas-palad.mp3
│   │   └── aleluya-purihin-ang-diyos.mp3
│   ├── offertory/
│   │   ├── kunin-at-tanggapin.mp3
│   │   ├── narito-kami.mp3
│   │   ├── take-and-receive.mp3
│   │   ├── sa-bilang-ng-araw.mp3
│   │   └── paghahandog.mp3
│   ├── holy/
│   │   ├── santo-mass-of-st-john.mp3
│   │   ├── santo-santo-bukas-palad.mp3
│   │   └── santo-lent-mass-setting.mp3
│   ├── mystery/
│   │   ├── si-kristo-ay-namatay.mp3
│   │   └── when-we-eat-this-bread.mp3
│   ├── amen/
│   │   ├── amen-himig-heswita.mp3
│   │   └── amen-mass-for-peace.mp3
│   ├── lamb/
│   │   ├── kordero-ng-diyos-bukas-palad.mp3
│   │   └── kordero-ng-diyos-mass-of-st-john.mp3
│   ├── communion/
│   │   ├── kordero-ng-diyos-lamb-of-god-meditative.mp3
│   │   ├── huwag-mangamba.mp3
│   │   ├── tanging-yaman.mp3
│   │   ├── kahit-isang-saglit.mp3
│   │   ├── anima-christi-bukas-palad.mp3
│   │   ├── dakilang-pag-ibig.mp3
│   │   └── panalangin-sa-pagiging-bukas-palad.mp3
│   └── recessional/
│       ├── humayo-t-ihayag.mp3
│       ├── i-will-sing-forever.mp3
│       ├── ipagdiwang-si-kristo.mp3
│       ├── pananagutan.mp3
│       └── stand-by-me-still.mp3
│
├── advent/                           # Advent Season
│   ├── entrance/
│   │   ├── o-come-o-come-emmanuel.mp3
│   │   ├── halina-hesus-halina.mp3
│   │   └── bayan-magsaya.mp3
│   ├── offertory/
│   │   ├── sa-araw-ng-pasko-advent-version.mp3
│   │   └── paghahandog-ng-puso.mp3
│   ├── communion/
│   │   ├── emmanuel-bukas-palad.mp3
│   │   └── halina-jesus-halina-slow-version.mp3
│   └── recessional/
│       ├── magsiawit-sa-panginoon.mp3
│       └── tanda-ng-pag-asa.mp3
│
├── christmas/                        # Christmas Season
│   ├── entrance/
│   │   ├── pasko-na.mp3
│   │   ├── hark-the-herald-angels-sing.mp3
│   │   ├── o-come-all-ye-faithful.mp3
│   │   └── sa-maybahay-liturgical-version.mp3
│   ├── offertory/
│   │   ├── ang-pasko-ay-sumapit-liturgical.mp3
│   │   └── handog-ng-mga-pastol.mp3
│   ├── communion/
│   │   ├── silent-night.mp3
│   │   ├── o-holy-night.mp3
│   │   └── payapang-daigdig.mp3
│   └── recessional/
│       ├── joy-to-the-world.mp3
│       └── noche-buena-liturgical-adaptation.mp3
│
├── lent/                             # Lenten Season
│   ├── entrance/
│   │   ├── ako-y-magbabalik.mp3
│   │   ├── buksan-ang-aming-puso.mp3
│   │   ├── hosea-come-back-to-me.mp3
│   │   └── daghang-salamat-ginoo-visayan.mp3
│   ├── offertory/
│   │   ├── poon-narito-ako.mp3
│   │   ├── pag-ibig-mo-ama.mp3
│   │   └── ang-tanging-alay-ko.mp3
│   ├── communion/
│   │   ├── sa-yo-jesus.mp3
│   │   ├── dakilang-pag-ibig.mp3
│   │   └── paghilom.mp3
│   └── recessional/
│       ├── humayo-tayo-sa-kapayapaan.mp3
│       └── pananagutan.mp3
│
├── holyweek/                         # Holy Week
│   ├── palmsunday/
│   │   ├── hosanna-sa-anak-ni-david.mp3
│   │   └── hosanna-to-the-son-of-david.mp3
│   ├── holythursday/
│   │   ├── ubi-caritas.mp3
│   │   ├── where-charity-and-love-prevail.mp3
│   │   └── panunumpa-sa-pag-ibig-washing-of-the-feet.mp3
│   ├── goodfriday/
│   │   ├── pieta.mp3
│   │   ├── ama-namin-chant.mp3
│   │   ├── were-you-there.mp3
│   │   └── o-sacred-head-surrounded.mp3
│   └── eastervigil/
│       ├── exsultet-chant.mp3
│       ├── liwanag-ng-pasko-ng-pagkabuhay.mp3
│       └── alleluia-the-strife-is-oer.mp3
│
├── easter/                           # Easter Season
│   ├── entrance/
│   │   ├── jesus-christ-is-risen-today.mp3
│   │   ├── alleluia-let-the-holy-anthem-rise.mp3
│   │   └── sumigaw-sa-galak.mp3
│   ├── offertory/
│   │   ├── bulawanong-gasa-visayan.mp3
│   │   └── paghahandog.mp3
│   ├── communion/
│   │   ├── resucito.mp3
│   │   └── anima-christi-easter-melody.mp3
│   └── recessional/
│       ├── humayo-kay-kristo.mp3
│       └── i-will-sing-forever.mp3
│
├── pentecost/                        # Pentecost
│   ├── entrance/
│   │   ├── veni-sancte-spiritus.mp3
│   │   ├── come-holy-spirit.mp3
│   │   └── espiritu-santo-bayan-mo-y-gabayan.mp3
│   ├── offertory/
│   │   └── paghahandog-ng-puso.mp3
│   ├── communion/
│   │   ├── banal-na-espiritu-tanging-hiling.mp3
│   │   └── renew-me-o-spirit-of-the-lord.mp3
│   └── recessional/
│       ├── go-out-into-the-world.mp3
│       └── humayo-t-ihayag.mp3
│
├── ordinary/                         # Ordinary Time
│   ├── entrance/
│   │   ├── purihin-ang-panginoon.mp3
│   │   ├── halina-t-magpuri.mp3
│   │   └── bayan-magsiawit.mp3
│   ├── offertory/
│   │   ├── kunin-at-tanggapin.mp3
│   │   └── sa-iyong-mga-yapak.mp3
│   ├── communion/
│   │   ├── tanging-yaman.mp3
│   │   ├── huwag-mangamba.mp3
│   │   └── sa-yo-lamang.mp3
│   └── recessional/
│       ├── ipagdiwang-si-kristo.mp3
│       └── pananagutan.mp3
│
└── marian/                           # Marian Feasts & May Devotions
    ├── entrance/
    │   ├── ave-maria-bukas-palad.mp3
    │   ├── hail-mary-gentle-woman.mp3
    │   └── maria-bukang-liwayway.mp3
    ├── offertory/
    │   └── birheng-maria-ina-ng-diyos.mp3
    ├── communion/
    │   ├── sa-piling-mo-maria.mp3
    │   └── magnificat.mp3
    └── recessional/
        ├── regina-coeli.mp3
        └── salve-regina.mp3
```

## File Naming Convention

1. **Use lowercase letters**
2. **Replace spaces with hyphens (-)**
3. **Remove special characters** (parentheses, apostrophes, etc.)
4. **Use hyphens for compound words**
5. **Keep file extensions as `.mp3`**

### Examples:
- "Papuri sa Diyos" → `papuri-sa-diyos.mp3`
- "O Come, O Come Emmanuel" → `o-come-o-come-emmanuel.mp3`
- "Psalm 23 – Pastol Ka ng Bayan" → `psalm-23-pastol-ka-ng-bayan.mp3`
- "Sa'Yo Lamang" → `sa-yo-lamang.mp3`

## File Path Template

The file path format in the code follows this pattern:

```
assets/music/{season}/{category}/{filename}.mp3
```

Where:
- `{season}` = general, advent, christmas, lent, holyweek, easter, pentecost, ordinary, marian
- `{category}` = entrance, kyrie, gloria, psalm, gospel, offertory, holy, mystery, amen, lamb, communion, recessional, palmsunday, holythursday, goodfriday, eastervigil
- `{filename}` = lowercase, hyphenated version of the song name

## How to Add MP3 Files

1. Create the folder structure in `src/assets/music/` if it doesn't exist
2. Place your MP3 files in the appropriate folders
3. Ensure file names match the `filePath` property in `music.page.ts`
4. The file paths are automatically generated based on the song structure

## Notes

- All file paths are relative to the `src/assets/` directory
- Angular will automatically include files from `src/assets/` in the build
- File paths in the code use forward slashes (`/`) even on Windows
- The code will display "MP3 Coming Soon" if no file path is provided




