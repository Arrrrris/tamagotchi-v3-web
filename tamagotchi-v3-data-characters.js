const characterProfiles = [
  {
    "id": "c001",
    "name": "Kuroteletchi",
    "stage": "baby",
    "gender": "any",
    "parity": "any",
    "rank": "any",
    "favoriteFoodIds": [
      "S023"
    ],
    "dislikedFoodIds": [
      "F013"
    ],
    "favoriteFoods": [
      "纸杯蛋糕"
    ],
    "dislikedFoods": [
      "玉米卷"
    ],
    "image": "./char-icons/Kuroteletchi.png",
    "note": "中文名：男羞羞吉；睡眠：一小时内长大，中间会睡一次"
  },
  {
    "id": "c002",
    "name": "Shiroteletchi",
    "stage": "baby",
    "gender": "any",
    "parity": "any",
    "rank": "any",
    "favoriteFoodIds": [
      "S023"
    ],
    "dislikedFoodIds": [
      "F013"
    ],
    "favoriteFoods": [
      "纸杯蛋糕"
    ],
    "dislikedFoods": [
      "玉米卷"
    ],
    "image": "./char-icons/Shiroteletchi.png",
    "note": "中文名：女羞羞吉；睡眠：一小时内长大，中间会睡一次"
  },
  {
    "id": "c005",
    "name": "Mizutamatchi",
    "stage": "child",
    "gender": "any",
    "parity": "any",
    "rank": "any",
    "favoriteFoodIds": [
      "S015"
    ],
    "dislikedFoodIds": [
      "F016"
    ],
    "favoriteFoods": [
      "樱桃"
    ],
    "dislikedFoods": [
      "汉堡"
    ],
    "image": "./char-icons/Mizutamatchi.png",
    "note": "中文名：水滴吉；睡眠：8~8"
  },
  {
    "id": "c006",
    "name": "Tamatchi",
    "stage": "child",
    "gender": "any",
    "parity": "any",
    "rank": "any",
    "favoriteFoodIds": [
      "S027"
    ],
    "dislikedFoodIds": [
      "S013"
    ],
    "favoriteFoods": [
      "菠萝"
    ],
    "dislikedFoods": [
      "薯条"
    ],
    "image": "./char-icons/Tamatchi.png",
    "note": "中文名：拓麻吉；睡眠：8~8"
  },
  {
    "id": "c011",
    "name": "Nikatchi",
    "stage": "teen",
    "gender": "any",
    "parity": "odd",
    "rank": "any",
    "favoriteFoodIds": [],
    "dislikedFoodIds": [
      "S021"
    ],
    "favoriteFoods": [],
    "dislikedFoods": [
      "蛋糕卷"
    ],
    "image": "./char-icons/Nikatchi.png",
    "note": "中文名：微笑吉；睡眠：9~10"
  },
  {
    "id": "c012",
    "name": "Piorirotchi",
    "stage": "teen",
    "gender": "any",
    "parity": "odd",
    "rank": "any",
    "favoriteFoodIds": [
      "S013"
    ],
    "dislikedFoodIds": [
      "S025"
    ],
    "favoriteFoods": [
      "薯条"
    ],
    "dislikedFoods": [
      "圣代"
    ],
    "image": "./char-icons/Piorirotchi.png",
    "note": "中文名：铃声吉；睡眠：9~10"
  },
  {
    "id": "c017",
    "name": "Hinotamatchi",
    "stage": "teen",
    "gender": "any",
    "parity": "even",
    "rank": "any",
    "favoriteFoodIds": [
      "F018"
    ],
    "dislikedFoodIds": [
      "S019"
    ],
    "favoriteFoods": [
      "煎蛋卷"
    ],
    "dislikedFoods": [
      "甜甜圈"
    ],
    "image": "./char-icons/Hinotamatchi.png",
    "note": "中文名：火球吉；睡眠：9~10"
  },
  {
    "id": "c018",
    "name": "Hashitamatchi",
    "stage": "teen",
    "gender": "any",
    "parity": "even",
    "rank": "any",
    "favoriteFoodIds": [
      "S019"
    ],
    "dislikedFoodIds": [
      "S024"
    ],
    "favoriteFoods": [
      "甜甜圈"
    ],
    "dislikedFoods": [
      "能量饮料"
    ],
    "image": "./char-icons/Hashitamatchi.png",
    "note": "中文名：小喙喙吉；睡眠：9~10"
  },
  {
    "id": "c048",
    "name": "Oyajitchi",
    "stage": "adult",
    "gender": "any",
    "parity": "any",
    "rank": "any",
    "favoriteFoodIds": [],
    "dislikedFoodIds": [
      "F013"
    ],
    "favoriteFoods": [],
    "dislikedFoods": [
      "玉米卷"
    ],
    "image": "./char-icons/Oyajitchi.png",
    "note": "中文名：大叔吉；睡眠：10.15~10"
  },
  {
    "id": "c049",
    "name": "Ojitchi",
    "stage": "elder",
    "gender": "any",
    "parity": "any",
    "rank": "any",
    "favoriteFoodIds": [
      "S021"
    ],
    "dislikedFoodIds": [],
    "favoriteFoods": [
      "蛋糕卷"
    ],
    "dislikedFoods": [],
    "image": "./char-icons/Ojitchi.png",
    "note": "中文名：爷爷吉；睡眠：8~7"
  },
  {
    "id": "c050",
    "name": "Otokitchi",
    "stage": "elder",
    "gender": "any",
    "parity": "any",
    "rank": "any",
    "favoriteFoodIds": [
      "S021"
    ],
    "dislikedFoodIds": [],
    "favoriteFoods": [
      "蛋糕卷"
    ],
    "dislikedFoods": [],
    "image": "./char-icons/Otokitchi.png",
    "note": "中文名：奶奶吉；睡眠：8~7"
  },
  {
    "id": "c022",
    "name": "Kuchipatchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "A",
    "favoriteFoodIds": [
      "F003"
    ],
    "dislikedFoodIds": [],
    "favoriteFoods": [
      "玉米"
    ],
    "dislikedFoods": [],
    "image": "./char-icons/Kuchipatchi.png",
    "note": "中文名：大嘴吉；睡眠：10~9"
  },
  {
    "id": "c023",
    "name": "Memetchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "A",
    "favoriteFoodIds": [
      "S023"
    ],
    "dislikedFoodIds": [
      "F007"
    ],
    "favoriteFoods": [
      "纸杯蛋糕"
    ],
    "dislikedFoods": [
      "奶酪"
    ],
    "image": "./char-icons/Memetchi.png",
    "note": "中文名：美眉吉；睡眠：10~9"
  },
  {
    "id": "c024",
    "name": "Billotchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "A",
    "favoriteFoodIds": [
      "F009"
    ],
    "dislikedFoodIds": [
      "S012"
    ],
    "favoriteFoods": [
      "竹签肠"
    ],
    "dislikedFoods": [
      "果汁"
    ],
    "image": "./char-icons/Billotchi.png",
    "note": "中文名：喙喙吉；睡眠：10~9"
  },
  {
    "id": "c036",
    "name": "Bunbutchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "A",
    "favoriteFoodIds": [
      "F009"
    ],
    "dislikedFoodIds": [
      "F012"
    ],
    "favoriteFoods": [
      "竹签肠"
    ],
    "dislikedFoods": [
      "热狗"
    ],
    "image": "./char-icons/Bunbutchi.png",
    "note": "中文名：兔兔吉；睡眠：10~9"
  },
  {
    "id": "c037",
    "name": "Hidatchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "A",
    "favoriteFoodIds": [],
    "dislikedFoodIds": [
      "S020"
    ],
    "favoriteFoods": [],
    "dislikedFoods": [
      "冰淇淋"
    ],
    "image": "./char-icons/Hidatchi.png",
    "note": "中文名：飞力吉；睡眠：10~9"
  },
  {
    "id": "c038",
    "name": "Debatchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "A",
    "favoriteFoodIds": [
      "S011"
    ],
    "dislikedFoodIds": [
      "F019"
    ],
    "favoriteFoods": [
      "梨"
    ],
    "dislikedFoods": [
      "意面"
    ],
    "image": "./char-icons/Debatchi.png",
    "note": "中文名：大牙吉；睡眠：10~9"
  },
  {
    "id": "c025",
    "name": "Mimiyoritchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "B",
    "favoriteFoodIds": [
      "S004"
    ],
    "dislikedFoodIds": [
      "F009"
    ],
    "favoriteFoods": [
      "哈密瓜"
    ],
    "dislikedFoods": [
      "竹签肠"
    ],
    "image": "./char-icons/Mimiyoritchi.png",
    "note": "中文名：耳朵吉；睡眠：10~8"
  },
  {
    "id": "c026",
    "name": "Tarakotchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "B",
    "favoriteFoodIds": [
      "F007"
    ],
    "dislikedFoodIds": [
      "F014"
    ],
    "favoriteFoods": [
      "奶酪"
    ],
    "dislikedFoods": [
      "三明治"
    ],
    "image": "./char-icons/Tarakotchi.png",
    "note": "中文名：鱼嘴吉；睡眠：10~8"
  },
  {
    "id": "c027",
    "name": "Paparatchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "B",
    "favoriteFoodIds": [
      "S013"
    ],
    "dislikedFoodIds": [
      "S015"
    ],
    "favoriteFoods": [
      "薯条"
    ],
    "dislikedFoods": [
      "樱桃"
    ],
    "image": "./char-icons/Paparatchi.png",
    "note": "中文名：狗仔吉；睡眠：10~8"
  },
  {
    "id": "c039",
    "name": "Drotchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "B",
    "favoriteFoodIds": [
      "S018"
    ],
    "dislikedFoodIds": [
      "S030"
    ],
    "favoriteFoods": [
      "玉米热狗"
    ],
    "dislikedFoods": [
      "苹果派"
    ],
    "image": "./char-icons/Drotchi.png",
    "note": "中文名：多罗吉；睡眠：10~8"
  },
  {
    "id": "c040",
    "name": "Bili",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "B",
    "favoriteFoodIds": [
      "F017"
    ],
    "dislikedFoodIds": [
      "S003"
    ],
    "favoriteFoods": [
      "牛肉碗"
    ],
    "dislikedFoods": [
      "葡萄"
    ],
    "image": "./char-icons/Bili.png",
    "note": "中文名：比尔吉；睡眠：10~8"
  },
  {
    "id": "c041",
    "name": "Pipotchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "B",
    "favoriteFoodIds": [
      "S025"
    ],
    "dislikedFoodIds": [
      "F009"
    ],
    "favoriteFoods": [
      "圣代"
    ],
    "dislikedFoods": [
      "竹签肠"
    ],
    "image": "./char-icons/Pipotchi.png",
    "note": "中文名：皮波吉；睡眠：10~8"
  },
  {
    "id": "c028",
    "name": "Hanatchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "C",
    "favoriteFoodIds": [
      "S003"
    ],
    "dislikedFoodIds": [
      "S018"
    ],
    "favoriteFoods": [
      "葡萄"
    ],
    "dislikedFoods": [
      "玉米热狗"
    ],
    "image": "./char-icons/Hanatchi.png",
    "note": "中文名：鼻毛吉；睡眠：9~9"
  },
  {
    "id": "c029",
    "name": "Hashizotchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "C",
    "favoriteFoodIds": [
      "F013"
    ],
    "dislikedFoodIds": [
      "F007"
    ],
    "favoriteFoods": [
      "玉米卷"
    ],
    "dislikedFoods": [
      "奶酪"
    ],
    "image": "./char-icons/Hashizotchi.png",
    "note": "中文名：大喙喙吉；睡眠：9~9"
  },
  {
    "id": "c030",
    "name": "Tsunotchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "C",
    "favoriteFoodIds": [
      "F007"
    ],
    "dislikedFoodIds": [
      "S014"
    ],
    "favoriteFoods": [
      "奶酪"
    ],
    "dislikedFoods": [
      "爆米花"
    ],
    "image": "./char-icons/Tsunotchi.png",
    "note": "中文名：喇叭吉；睡眠：9~9"
  },
  {
    "id": "c042",
    "name": "Teketchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "C",
    "favoriteFoodIds": [
      "S022"
    ],
    "dislikedFoodIds": [
      "S030"
    ],
    "favoriteFoods": [
      "苏打水"
    ],
    "dislikedFoods": [
      "苹果派"
    ],
    "image": "./char-icons/Teketchi.png",
    "note": "中文名：哒哒吉；睡眠：9~9"
  },
  {
    "id": "c043",
    "name": "Robotchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "C",
    "favoriteFoodIds": [
      "S024"
    ],
    "dislikedFoodIds": [
      "S022"
    ],
    "favoriteFoods": [
      "能量饮料"
    ],
    "dislikedFoods": [
      "苏打水"
    ],
    "image": "./char-icons/Robotchi.png",
    "note": "中文名：罗博吉；睡眠：9~9"
  },
  {
    "id": "c044",
    "name": "Wooltchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "C",
    "favoriteFoodIds": [
      "S030"
    ],
    "dislikedFoodIds": [
      "F018"
    ],
    "favoriteFoods": [
      "苹果派"
    ],
    "dislikedFoods": [
      "煎蛋卷"
    ],
    "image": "./char-icons/Wooltchi.png",
    "note": "中文名：羊毛吉；睡眠：9~9"
  },
  {
    "id": "c031",
    "name": "Maskutchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "D",
    "favoriteFoodIds": [
      "F016"
    ],
    "dislikedFoodIds": [
      "F002"
    ],
    "favoriteFoods": [
      "汉堡"
    ],
    "dislikedFoods": [
      "牛奶"
    ],
    "image": "./char-icons/Maskutchi.png",
    "note": "中文名：面具吉；睡眠：10.15~10"
  },
  {
    "id": "c032",
    "name": "Megatchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "D",
    "favoriteFoodIds": [
      "F012"
    ],
    "dislikedFoodIds": [
      "S027"
    ],
    "favoriteFoods": [
      "热狗"
    ],
    "dislikedFoods": [
      "菠萝"
    ],
    "image": "./char-icons/Megatchi.png",
    "note": "中文名：超大嘴吉；睡眠：10.15~10"
  },
  {
    "id": "c045",
    "name": "Gazarutchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "D",
    "favoriteFoodIds": [
      "F012"
    ],
    "dislikedFoodIds": [
      "S002"
    ],
    "favoriteFoods": [
      "热狗"
    ],
    "dislikedFoods": [
      "芝士蛋糕"
    ],
    "image": "./char-icons/Gazarutchi.png",
    "note": "中文名：忍者吉；睡眠：10.15~10"
  },
  {
    "id": "c046",
    "name": "Warusotchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "D",
    "favoriteFoodIds": [
      "F013"
    ],
    "dislikedFoodIds": [
      "S011"
    ],
    "favoriteFoods": [
      "玉米卷"
    ],
    "dislikedFoods": [
      "梨"
    ],
    "image": "./char-icons/Warusotchi.png",
    "note": "中文名：不良吉；睡眠：10.15~10"
  },
  {
    "id": "c047",
    "name": "Sekitoritchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "D",
    "favoriteFoodIds": [
      "F015"
    ],
    "dislikedFoodIds": [
      "F018"
    ],
    "favoriteFoods": [
      "BBQ"
    ],
    "dislikedFoods": [
      "煎蛋卷"
    ],
    "image": "./char-icons/Sekitoritchi.png",
    "note": "中文名：相扑吉；睡眠：10.15~10"
  },
  {
    "id": "c003",
    "name": "Kuchitamatchi",
    "stage": "child",
    "gender": "any",
    "parity": "any",
    "rank": "S",
    "favoriteFoodIds": [
      "S015"
    ],
    "dislikedFoodIds": [
      "F016"
    ],
    "favoriteFoods": [
      "樱桃"
    ],
    "dislikedFoods": [
      "汉堡"
    ],
    "image": "./char-icons/Kuchitamatchi.png",
    "note": "中文名：大嘴拓麻吉；睡眠：8~9"
  },
  {
    "id": "c004",
    "name": "Mohitamatchi",
    "stage": "child",
    "gender": "any",
    "parity": "any",
    "rank": "S",
    "favoriteFoodIds": [
      "S027"
    ],
    "dislikedFoodIds": [
      "S013"
    ],
    "favoriteFoods": [
      "菠萝"
    ],
    "dislikedFoods": [
      "薯条"
    ],
    "image": "./char-icons/Mohitamatchi.png",
    "note": "中文名：莫霍克吉；睡眠：8~9"
  },
  {
    "id": "c007",
    "name": "Youngmametchi",
    "stage": "teen",
    "gender": "any",
    "parity": "odd",
    "rank": "S",
    "favoriteFoodIds": [
      "F014"
    ],
    "dislikedFoodIds": [
      "F011"
    ],
    "favoriteFoods": [
      "三明治"
    ],
    "dislikedFoods": [
      "披萨"
    ],
    "image": "./char-icons/Youngmametchi.png",
    "note": "中文名：小麻美吉；睡眠：8~9"
  },
  {
    "id": "c008",
    "name": "Obotchi",
    "stage": "teen",
    "gender": "any",
    "parity": "odd",
    "rank": "S",
    "favoriteFoodIds": [
      "S012"
    ],
    "dislikedFoodIds": [
      "S019"
    ],
    "favoriteFoods": [
      "果汁"
    ],
    "dislikedFoods": [
      "甜甜圈"
    ],
    "image": "./char-icons/Obotchi.png",
    "note": "中文名：男孩吉；睡眠：8~9"
  },
  {
    "id": "c009",
    "name": "Batabatchi",
    "stage": "teen",
    "gender": "any",
    "parity": "odd",
    "rank": "S",
    "favoriteFoodIds": [
      "F016"
    ],
    "dislikedFoodIds": [
      "F019"
    ],
    "favoriteFoods": [
      "汉堡"
    ],
    "dislikedFoods": [
      "意面"
    ],
    "image": "./char-icons/Batabatchi.png",
    "note": "中文名：翅膀吉；睡眠：8~9"
  },
  {
    "id": "c010",
    "name": "Ringotchi",
    "stage": "teen",
    "gender": "any",
    "parity": "odd",
    "rank": "S",
    "favoriteFoodIds": [
      "S012"
    ],
    "dislikedFoodIds": [
      "S019"
    ],
    "favoriteFoods": [
      "果汁"
    ],
    "dislikedFoods": [
      "甜甜圈"
    ],
    "image": "./char-icons/Ringotchi.png",
    "note": "中文名：苹果吉；睡眠：8~9"
  },
  {
    "id": "c013",
    "name": "Youngmimitchi",
    "stage": "teen",
    "gender": "any",
    "parity": "even",
    "rank": "S",
    "favoriteFoodIds": [
      "S002"
    ],
    "dislikedFoodIds": [
      "F015"
    ],
    "favoriteFoods": [
      "芝士蛋糕"
    ],
    "dislikedFoods": [
      "BBQ"
    ],
    "image": "./char-icons/Youngmimitchi.png",
    "note": "中文名：小咪咪吉；睡眠：8~9"
  },
  {
    "id": "c014",
    "name": "Hinatchi",
    "stage": "teen",
    "gender": "any",
    "parity": "even",
    "rank": "S",
    "favoriteFoodIds": [
      "F011"
    ],
    "dislikedFoodIds": [
      "F003"
    ],
    "favoriteFoods": [
      "披萨"
    ],
    "dislikedFoods": [
      "玉米"
    ],
    "image": "./char-icons/Hinatchi.png",
    "note": "中文名：小鸟吉；睡眠：8~9"
  },
  {
    "id": "c015",
    "name": "Hikotchi",
    "stage": "teen",
    "gender": "any",
    "parity": "even",
    "rank": "S",
    "favoriteFoodIds": [
      "F002"
    ],
    "dislikedFoodIds": [],
    "favoriteFoods": [
      "牛奶"
    ],
    "dislikedFoods": [],
    "image": "./char-icons/Hikotchi.png",
    "note": "中文名：航空吉；睡眠：8~9"
  },
  {
    "id": "c016",
    "name": "Ichigotchi",
    "stage": "teen",
    "gender": "any",
    "parity": "even",
    "rank": "S",
    "favoriteFoodIds": [
      "F002"
    ],
    "dislikedFoodIds": [
      "F007"
    ],
    "favoriteFoods": [
      "牛奶"
    ],
    "dislikedFoods": [
      "奶酪"
    ],
    "image": "./char-icons/Ichigotchi.png",
    "note": "中文名：草莓吉；睡眠：8~9"
  },
  {
    "id": "c019",
    "name": "Mamechi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "S",
    "favoriteFoodIds": [
      "F018"
    ],
    "dislikedFoodIds": [
      "S026"
    ],
    "favoriteFoods": [
      "煎蛋卷"
    ],
    "dislikedFoods": [
      "香蕉"
    ],
    "image": "./char-icons/Mamechi.png",
    "note": "中文名：麻美吉；睡眠：9~8"
  },
  {
    "id": "c020",
    "name": "Pyonkotchi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "S",
    "favoriteFoodIds": [
      "S026"
    ],
    "dislikedFoodIds": [
      "F007"
    ],
    "favoriteFoods": [
      "香蕉"
    ],
    "dislikedFoods": [
      "奶酪"
    ],
    "image": "./char-icons/Pyonkotchi.png",
    "note": "中文名：砰砰吉；睡眠：9~8"
  },
  {
    "id": "c021",
    "name": "Furawatachi",
    "stage": "adult",
    "gender": "any",
    "parity": "odd",
    "rank": "S",
    "favoriteFoodIds": [
      "S030"
    ],
    "dislikedFoodIds": [
      "F015"
    ],
    "favoriteFoods": [
      "苹果派"
    ],
    "dislikedFoods": [
      "BBQ"
    ],
    "image": "./char-icons/Furawatachi.png",
    "note": "中文名：花花吉；睡眠：9~8"
  },
  {
    "id": "c033",
    "name": "Mimitchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "S",
    "favoriteFoodIds": [
      "S020"
    ],
    "dislikedFoodIds": [
      "F016"
    ],
    "favoriteFoods": [
      "冰淇淋"
    ],
    "dislikedFoods": [
      "汉堡"
    ],
    "image": "./char-icons/Mimitchi.png",
    "note": "中文名：咪咪吉；睡眠：9~8"
  },
  {
    "id": "c034",
    "name": "Chomametchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "S",
    "favoriteFoodIds": [
      "F019"
    ],
    "dislikedFoodIds": [
      "S013"
    ],
    "favoriteFoods": [
      "意面"
    ],
    "dislikedFoods": [
      "薯条"
    ],
    "image": "./char-icons/Chomametchi.png",
    "note": "中文名：超麻美吉；睡眠：9~8"
  },
  {
    "id": "c035",
    "name": "Dekotchi",
    "stage": "adult",
    "gender": "any",
    "parity": "even",
    "rank": "S",
    "favoriteFoodIds": [
      "F007"
    ],
    "dislikedFoodIds": [
      "F003"
    ],
    "favoriteFoods": [
      "奶酪"
    ],
    "dislikedFoods": [
      "玉米"
    ],
    "image": "./char-icons/Dekotchi.png",
    "note": "中文名：德科吉；睡眠：9~8"
  }
];
