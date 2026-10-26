window.DATASET_BUNDLE = {
  "stats": {
    "train": {
      "num_samples": 30,
      "shapes": [
        [
          256,
          256
        ]
      ],
      "total_buildings": 372,
      "avg_buildings_per_image": 12.4,
      "building_damage_counts": {
        "1": 125,
        "2": 96,
        "3": 106,
        "4": 45
      },
      "damage_pixel_counts": {
        "0": 1708107,
        "1": 86364,
        "2": 67392,
        "3": 73808,
        "4": 30409
      },
      "loc_pixel_counts": {
        "0": 1708107,
        "255": 257973
      }
    },
    "test": {
      "num_samples": 10,
      "shapes": [
        [
          256,
          256
        ]
      ],
      "total_buildings": 109,
      "avg_buildings_per_image": 10.9,
      "building_damage_counts": {
        "1": 37,
        "2": 25,
        "3": 33,
        "4": 14
      },
      "damage_pixel_counts": {
        "0": 578860,
        "1": 26275,
        "2": 17018,
        "3": 22614,
        "4": 10593
      },
      "loc_pixel_counts": {
        "0": 578860,
        "255": 76500
      }
    }
  },
  "train_samples": [
    {
      "id": "disaster_train_000",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_000_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_000_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_000_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_000_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            79,
            104,
            23,
            20
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            68,
            146,
            35,
            24
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 2,
          "bbox": [
            213,
            188,
            26,
            26
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 3,
          "bbox": [
            13,
            48,
            36,
            37
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            74,
            67,
            36,
            24
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 5,
          "bbox": [
            204,
            75,
            27,
            25
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            54,
            65,
            19,
            36
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 7,
          "bbox": [
            120,
            213,
            37,
            30
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 8,
          "bbox": [
            113,
            152,
            20,
            23
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 9,
          "bbox": [
            113,
            92,
            32,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 10,
          "bbox": [
            17,
            71,
            31,
            19
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 11,
          "bbox": [
            184,
            117,
            32,
            19
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 12,
          "bbox": [
            69,
            69,
            34,
            19
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 13,
          "bbox": [
            72,
            35,
            28,
            26
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 14,
          "bbox": [
            111,
            116,
            35,
            25
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 15,
          "bbox": [
            18,
            200,
            27,
            27
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_train_001",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_001_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_001_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_001_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_001_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            15,
            158,
            23,
            37
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 1,
          "bbox": [
            117,
            115,
            23,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            44,
            107,
            33,
            28
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            90,
            75,
            27,
            31
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            11,
            96,
            29,
            37
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 5,
          "bbox": [
            194,
            151,
            32,
            22
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            187,
            161,
            20,
            25
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            91,
            96,
            29,
            19
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 8,
          "bbox": [
            98,
            129,
            30,
            36
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 9,
          "bbox": [
            162,
            153,
            22,
            32
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 10,
          "bbox": [
            99,
            58,
            36,
            36
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 11,
          "bbox": [
            227,
            191,
            18,
            33
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 12,
          "bbox": [
            67,
            213,
            26,
            22
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 13,
          "bbox": [
            89,
            196,
            25,
            27
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_train_002",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_002_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_002_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_002_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_002_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            41,
            112,
            34,
            29
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 1,
          "bbox": [
            147,
            36,
            36,
            37
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            182,
            202,
            19,
            33
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            177,
            147,
            33,
            30
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            98,
            209,
            26,
            36
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 5,
          "bbox": [
            83,
            170,
            19,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            171,
            179,
            19,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            59,
            154,
            31,
            27
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_train_003",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_003_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_003_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_003_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_003_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            11,
            178,
            19,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            120,
            87,
            24,
            25
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            152,
            175,
            34,
            28
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 3,
          "bbox": [
            67,
            138,
            27,
            36
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            88,
            73,
            24,
            28
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 5,
          "bbox": [
            126,
            53,
            34,
            22
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            41,
            77,
            21,
            20
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 7,
          "bbox": [
            143,
            116,
            19,
            36
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 8,
          "bbox": [
            174,
            112,
            34,
            21
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 9,
          "bbox": [
            191,
            58,
            37,
            29
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 10,
          "bbox": [
            14,
            178,
            18,
            29
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 11,
          "bbox": [
            100,
            10,
            24,
            30
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 12,
          "bbox": [
            40,
            182,
            20,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 13,
          "bbox": [
            141,
            176,
            23,
            30
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 14,
          "bbox": [
            47,
            172,
            23,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 15,
          "bbox": [
            113,
            86,
            20,
            27
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_train_004",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_004_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_004_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_004_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_004_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            72,
            112,
            35,
            19
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            20,
            103,
            27,
            28
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            110,
            133,
            30,
            22
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            172,
            168,
            23,
            30
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            100,
            150,
            28,
            21
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            78,
            44,
            26,
            22
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 6,
          "bbox": [
            107,
            82,
            37,
            30
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            78,
            45,
            28,
            27
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 8,
          "bbox": [
            213,
            28,
            26,
            28
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 9,
          "bbox": [
            58,
            133,
            25,
            23
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 10,
          "bbox": [
            174,
            190,
            33,
            20
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 11,
          "bbox": [
            11,
            190,
            37,
            36
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 12,
          "bbox": [
            152,
            44,
            25,
            33
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 13,
          "bbox": [
            124,
            73,
            36,
            22
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 14,
          "bbox": [
            82,
            194,
            18,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_train_005",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_005_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_005_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_005_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_005_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            126,
            55,
            33,
            19
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 1,
          "bbox": [
            111,
            190,
            35,
            35
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            202,
            174,
            31,
            19
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            104,
            175,
            22,
            24
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            161,
            51,
            32,
            24
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            197,
            116,
            33,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 6,
          "bbox": [
            185,
            80,
            32,
            28
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            138,
            99,
            20,
            28
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 8,
          "bbox": [
            92,
            153,
            21,
            26
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 9,
          "bbox": [
            24,
            67,
            18,
            18
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 10,
          "bbox": [
            168,
            171,
            32,
            24
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 11,
          "bbox": [
            46,
            47,
            31,
            34
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 12,
          "bbox": [
            119,
            106,
            24,
            37
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 13,
          "bbox": [
            108,
            118,
            32,
            28
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_train_006",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_006_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_006_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_006_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_006_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            180,
            206,
            18,
            33
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            69,
            132,
            31,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            89,
            145,
            34,
            37
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 3,
          "bbox": [
            130,
            206,
            26,
            28
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            109,
            131,
            23,
            22
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 5,
          "bbox": [
            79,
            37,
            29,
            35
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 6,
          "bbox": [
            58,
            34,
            30,
            24
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 7,
          "bbox": [
            25,
            224,
            34,
            20
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 8,
          "bbox": [
            193,
            66,
            22,
            29
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 9,
          "bbox": [
            133,
            175,
            20,
            30
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 10,
          "bbox": [
            217,
            202,
            19,
            34
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 11,
          "bbox": [
            53,
            172,
            24,
            18
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 12,
          "bbox": [
            92,
            128,
            29,
            19
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 13,
          "bbox": [
            88,
            156,
            29,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 14,
          "bbox": [
            88,
            121,
            29,
            28
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        }
      ]
    },
    {
      "id": "disaster_train_007",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_007_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_007_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_007_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_007_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            49,
            211,
            23,
            30
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            177,
            169,
            26,
            27
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            37,
            84,
            33,
            34
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            143,
            160,
            19,
            18
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 4,
          "bbox": [
            159,
            112,
            35,
            32
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 5,
          "bbox": [
            58,
            55,
            19,
            29
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            136,
            151,
            36,
            18
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            209,
            125,
            36,
            24
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 8,
          "bbox": [
            142,
            199,
            20,
            24
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 9,
          "bbox": [
            169,
            139,
            24,
            24
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 10,
          "bbox": [
            106,
            180,
            22,
            19
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 11,
          "bbox": [
            178,
            156,
            24,
            33
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 12,
          "bbox": [
            54,
            211,
            31,
            21
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        }
      ]
    },
    {
      "id": "disaster_train_008",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_008_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_008_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_008_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_008_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            162,
            198,
            22,
            23
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            198,
            33,
            25,
            24
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 2,
          "bbox": [
            98,
            201,
            25,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            41,
            59,
            37,
            21
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            199,
            184,
            27,
            28
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            155,
            67,
            18,
            26
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            170,
            101,
            28,
            24
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 7,
          "bbox": [
            150,
            41,
            36,
            31
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        }
      ]
    },
    {
      "id": "disaster_train_009",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_009_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_009_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_009_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_009_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            94,
            38,
            23,
            34
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            189,
            32,
            19,
            18
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            109,
            48,
            28,
            22
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            165,
            193,
            25,
            21
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 4,
          "bbox": [
            21,
            44,
            27,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            81,
            111,
            37,
            22
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            193,
            165,
            23,
            29
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            177,
            138,
            22,
            20
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 8,
          "bbox": [
            77,
            193,
            20,
            26
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 9,
          "bbox": [
            93,
            25,
            24,
            18
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 10,
          "bbox": [
            93,
            125,
            27,
            19
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 11,
          "bbox": [
            107,
            39,
            31,
            34
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 12,
          "bbox": [
            141,
            46,
            27,
            18
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 13,
          "bbox": [
            214,
            48,
            22,
            18
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 14,
          "bbox": [
            162,
            129,
            23,
            32
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 15,
          "bbox": [
            168,
            72,
            27,
            27
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        }
      ]
    },
    {
      "id": "disaster_train_010",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_010_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_010_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_010_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_010_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            75,
            130,
            19,
            28
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            151,
            211,
            20,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            14,
            52,
            21,
            37
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 3,
          "bbox": [
            192,
            42,
            29,
            24
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            64,
            123,
            25,
            33
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            191,
            171,
            19,
            23
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            51,
            15,
            33,
            27
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 7,
          "bbox": [
            52,
            215,
            27,
            22
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 8,
          "bbox": [
            83,
            144,
            30,
            33
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 9,
          "bbox": [
            85,
            59,
            33,
            31
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        }
      ]
    },
    {
      "id": "disaster_train_011",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_011_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_011_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_011_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_011_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            183,
            171,
            22,
            35
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            90,
            74,
            36,
            19
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 2,
          "bbox": [
            110,
            192,
            24,
            19
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            175,
            101,
            37,
            22
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            53,
            42,
            25,
            29
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 5,
          "bbox": [
            215,
            129,
            26,
            28
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 6,
          "bbox": [
            139,
            87,
            27,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            190,
            202,
            23,
            35
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 8,
          "bbox": [
            146,
            111,
            36,
            19
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 9,
          "bbox": [
            109,
            66,
            32,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 10,
          "bbox": [
            146,
            163,
            32,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_train_012",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_012_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_012_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_012_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_012_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            198,
            145,
            27,
            36
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 1,
          "bbox": [
            78,
            93,
            27,
            35
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 2,
          "bbox": [
            193,
            69,
            28,
            22
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            117,
            18,
            26,
            27
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            27,
            188,
            28,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            36,
            55,
            21,
            27
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 6,
          "bbox": [
            86,
            68,
            28,
            31
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 7,
          "bbox": [
            20,
            80,
            30,
            35
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 8,
          "bbox": [
            150,
            133,
            31,
            26
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 9,
          "bbox": [
            75,
            47,
            21,
            33
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 10,
          "bbox": [
            154,
            223,
            20,
            22
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 11,
          "bbox": [
            182,
            138,
            27,
            30
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 12,
          "bbox": [
            86,
            124,
            26,
            24
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        }
      ]
    },
    {
      "id": "disaster_train_013",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_013_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_013_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_013_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_013_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            60,
            33,
            33,
            20
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            213,
            202,
            28,
            27
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            106,
            166,
            27,
            35
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 3,
          "bbox": [
            97,
            43,
            33,
            23
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            213,
            160,
            26,
            29
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 5,
          "bbox": [
            201,
            70,
            18,
            23
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            81,
            90,
            23,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            78,
            128,
            37,
            33
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 8,
          "bbox": [
            143,
            43,
            32,
            29
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 9,
          "bbox": [
            196,
            194,
            30,
            19
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 10,
          "bbox": [
            221,
            157,
            20,
            32
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 11,
          "bbox": [
            108,
            87,
            22,
            30
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 12,
          "bbox": [
            32,
            145,
            29,
            21
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_train_014",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_014_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_014_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_014_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_014_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            143,
            186,
            20,
            20
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            19,
            154,
            31,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            131,
            47,
            18,
            33
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            141,
            64,
            24,
            37
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            70,
            152,
            23,
            23
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 5,
          "bbox": [
            49,
            70,
            25,
            19
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            15,
            128,
            28,
            25
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            77,
            30,
            25,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 8,
          "bbox": [
            201,
            105,
            28,
            21
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 9,
          "bbox": [
            95,
            33,
            18,
            30
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 10,
          "bbox": [
            170,
            130,
            23,
            28
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 11,
          "bbox": [
            73,
            91,
            31,
            37
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 12,
          "bbox": [
            65,
            123,
            24,
            19
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 13,
          "bbox": [
            51,
            196,
            22,
            18
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 14,
          "bbox": [
            173,
            212,
            26,
            28
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        }
      ]
    },
    {
      "id": "disaster_train_015",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_015_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_015_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_015_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_015_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            16,
            103,
            25,
            21
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            194,
            139,
            37,
            37
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 2,
          "bbox": [
            145,
            181,
            31,
            34
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            98,
            139,
            30,
            28
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            89,
            163,
            36,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            79,
            46,
            31,
            30
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            109,
            149,
            26,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            218,
            139,
            27,
            21
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 8,
          "bbox": [
            185,
            26,
            29,
            34
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 9,
          "bbox": [
            17,
            224,
            34,
            19
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 10,
          "bbox": [
            138,
            149,
            35,
            23
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 11,
          "bbox": [
            206,
            195,
            22,
            32
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 12,
          "bbox": [
            199,
            193,
            35,
            18
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 13,
          "bbox": [
            153,
            52,
            29,
            22
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 14,
          "bbox": [
            76,
            85,
            36,
            30
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 15,
          "bbox": [
            88,
            168,
            26,
            35
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        }
      ]
    },
    {
      "id": "disaster_train_016",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_016_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_016_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_016_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_016_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            194,
            189,
            19,
            30
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            15,
            102,
            26,
            34
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            70,
            183,
            35,
            23
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            194,
            20,
            22,
            24
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 4,
          "bbox": [
            109,
            179,
            36,
            27
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 5,
          "bbox": [
            32,
            68,
            31,
            18
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 6,
          "bbox": [
            106,
            60,
            31,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            165,
            139,
            36,
            37
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 8,
          "bbox": [
            71,
            88,
            25,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_train_017",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_017_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_017_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_017_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_017_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            24,
            167,
            37,
            31
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            141,
            143,
            26,
            36
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 2,
          "bbox": [
            131,
            146,
            25,
            33
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            183,
            111,
            26,
            20
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            14,
            127,
            25,
            35
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            47,
            59,
            35,
            37
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            66,
            52,
            21,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            13,
            23,
            24,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 8,
          "bbox": [
            138,
            46,
            19,
            36
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 9,
          "bbox": [
            168,
            120,
            27,
            36
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 10,
          "bbox": [
            64,
            201,
            37,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 11,
          "bbox": [
            133,
            74,
            26,
            30
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 12,
          "bbox": [
            205,
            41,
            28,
            28
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_train_018",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_018_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_018_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_018_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_018_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            162,
            135,
            27,
            28
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            177,
            163,
            18,
            24
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            80,
            120,
            28,
            24
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            90,
            192,
            36,
            33
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 4,
          "bbox": [
            32,
            187,
            22,
            20
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            72,
            174,
            27,
            27
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 6,
          "bbox": [
            54,
            202,
            32,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            75,
            208,
            28,
            33
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 8,
          "bbox": [
            18,
            70,
            25,
            25
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 9,
          "bbox": [
            137,
            19,
            36,
            23
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 10,
          "bbox": [
            114,
            11,
            23,
            25
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 11,
          "bbox": [
            34,
            212,
            23,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 12,
          "bbox": [
            138,
            209,
            22,
            18
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 13,
          "bbox": [
            93,
            171,
            36,
            37
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 14,
          "bbox": [
            168,
            139,
            27,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_train_019",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_019_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_019_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_019_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_019_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            173,
            84,
            20,
            37
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            98,
            202,
            24,
            19
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 2,
          "bbox": [
            114,
            151,
            19,
            21
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            147,
            130,
            23,
            35
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 4,
          "bbox": [
            84,
            157,
            30,
            35
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 5,
          "bbox": [
            201,
            67,
            33,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            203,
            163,
            19,
            30
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 7,
          "bbox": [
            11,
            83,
            28,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 8,
          "bbox": [
            67,
            148,
            24,
            29
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 9,
          "bbox": [
            69,
            104,
            23,
            25
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 10,
          "bbox": [
            167,
            201,
            31,
            18
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 11,
          "bbox": [
            191,
            148,
            25,
            24
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 12,
          "bbox": [
            89,
            41,
            26,
            25
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 13,
          "bbox": [
            73,
            216,
            22,
            23
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_train_020",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_020_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_020_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_020_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_020_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            185,
            99,
            19,
            20
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            104,
            50,
            34,
            28
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 2,
          "bbox": [
            146,
            50,
            34,
            29
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 3,
          "bbox": [
            75,
            131,
            35,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            20,
            215,
            34,
            22
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 5,
          "bbox": [
            92,
            205,
            30,
            27
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            182,
            209,
            27,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            35,
            180,
            20,
            30
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_train_021",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_021_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_021_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_021_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_021_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            18,
            59,
            23,
            36
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 1,
          "bbox": [
            124,
            37,
            37,
            24
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            50,
            211,
            30,
            31
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 3,
          "bbox": [
            191,
            180,
            33,
            34
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            132,
            201,
            28,
            27
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 5,
          "bbox": [
            59,
            165,
            19,
            21
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            85,
            74,
            22,
            36
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 7,
          "bbox": [
            83,
            101,
            25,
            23
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 8,
          "bbox": [
            12,
            41,
            37,
            22
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_train_022",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_022_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_022_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_022_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_022_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            160,
            103,
            25,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            148,
            89,
            31,
            33
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            47,
            39,
            33,
            27
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            36,
            123,
            36,
            35
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            63,
            11,
            35,
            21
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 5,
          "bbox": [
            38,
            156,
            33,
            19
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            61,
            17,
            33,
            23
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            11,
            22,
            28,
            24
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 8,
          "bbox": [
            111,
            121,
            18,
            37
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 9,
          "bbox": [
            106,
            128,
            18,
            22
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 10,
          "bbox": [
            27,
            101,
            37,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 11,
          "bbox": [
            29,
            131,
            34,
            31
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 12,
          "bbox": [
            44,
            38,
            29,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 13,
          "bbox": [
            171,
            172,
            27,
            32
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 14,
          "bbox": [
            162,
            207,
            26,
            21
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 15,
          "bbox": [
            159,
            79,
            26,
            19
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_train_023",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_023_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_023_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_023_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_023_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            197,
            41,
            30,
            27
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 1,
          "bbox": [
            188,
            87,
            34,
            23
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 2,
          "bbox": [
            119,
            100,
            29,
            34
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 3,
          "bbox": [
            15,
            161,
            31,
            24
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 4,
          "bbox": [
            75,
            135,
            30,
            30
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            182,
            79,
            18,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            40,
            31,
            32,
            24
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            136,
            82,
            35,
            26
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 8,
          "bbox": [
            34,
            49,
            19,
            28
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 9,
          "bbox": [
            25,
            104,
            29,
            25
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_train_024",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_024_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_024_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_024_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_024_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            189,
            19,
            19,
            32
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 1,
          "bbox": [
            107,
            113,
            24,
            36
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 2,
          "bbox": [
            210,
            159,
            34,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            113,
            198,
            21,
            22
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            30,
            18,
            37,
            32
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            18,
            150,
            30,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 6,
          "bbox": [
            178,
            185,
            26,
            28
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            75,
            115,
            33,
            32
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 8,
          "bbox": [
            60,
            209,
            32,
            28
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 9,
          "bbox": [
            157,
            72,
            35,
            34
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 10,
          "bbox": [
            26,
            83,
            31,
            24
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 11,
          "bbox": [
            76,
            160,
            27,
            20
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 12,
          "bbox": [
            82,
            13,
            23,
            33
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 13,
          "bbox": [
            55,
            32,
            19,
            18
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 14,
          "bbox": [
            16,
            222,
            26,
            21
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        }
      ]
    },
    {
      "id": "disaster_train_025",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_025_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_025_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_025_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_025_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            73,
            170,
            35,
            33
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            207,
            42,
            19,
            33
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 2,
          "bbox": [
            88,
            25,
            28,
            32
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            214,
            153,
            26,
            33
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 4,
          "bbox": [
            24,
            98,
            34,
            31
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 5,
          "bbox": [
            56,
            73,
            21,
            37
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            20,
            105,
            30,
            34
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            75,
            80,
            33,
            30
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_train_026",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_026_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_026_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_026_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_026_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            212,
            187,
            19,
            19
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            133,
            196,
            26,
            19
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            127,
            141,
            31,
            25
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 3,
          "bbox": [
            87,
            60,
            19,
            30
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 4,
          "bbox": [
            125,
            142,
            30,
            20
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 5,
          "bbox": [
            115,
            39,
            36,
            25
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 6,
          "bbox": [
            56,
            75,
            30,
            32
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 7,
          "bbox": [
            153,
            172,
            19,
            20
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 8,
          "bbox": [
            57,
            126,
            24,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 9,
          "bbox": [
            125,
            207,
            27,
            21
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 10,
          "bbox": [
            159,
            133,
            33,
            30
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        }
      ]
    },
    {
      "id": "disaster_train_027",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_027_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_027_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_027_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_027_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            15,
            186,
            37,
            19
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            214,
            188,
            23,
            30
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            107,
            134,
            24,
            32
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            196,
            116,
            34,
            27
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 4,
          "bbox": [
            130,
            126,
            32,
            33
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 5,
          "bbox": [
            49,
            37,
            26,
            32
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            10,
            80,
            21,
            30
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 7,
          "bbox": [
            163,
            145,
            33,
            26
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_train_028",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_028_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_028_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_028_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_028_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            158,
            197,
            36,
            30
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 1,
          "bbox": [
            89,
            214,
            30,
            27
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            107,
            178,
            20,
            22
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 3,
          "bbox": [
            129,
            179,
            26,
            19
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 4,
          "bbox": [
            125,
            125,
            24,
            18
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            23,
            178,
            22,
            30
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            170,
            24,
            29,
            18
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 7,
          "bbox": [
            205,
            160,
            27,
            35
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_train_029",
      "split": "train",
      "pre_image": "data/train/images/disaster_train_029_pre_disaster.png",
      "post_image": "data/train/images/disaster_train_029_post_disaster.png",
      "loc_target": "data/train/targets/disaster_train_029_target_loc.png",
      "dmg_target": "data/train/targets/disaster_train_029_target_dmg.png",
      "comparison": null,
      "buildings": [
        {
          "id": 0,
          "bbox": [
            16,
            181,
            27,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 1,
          "bbox": [
            125,
            68,
            27,
            21
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            87,
            27,
            29,
            28
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            162,
            170,
            34,
            35
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 4,
          "bbox": [
            76,
            178,
            34,
            37
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 5,
          "bbox": [
            61,
            117,
            32,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            117,
            49,
            32,
            37
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 7,
          "bbox": [
            139,
            135,
            19,
            33
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 8,
          "bbox": [
            143,
            150,
            23,
            18
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 9,
          "bbox": [
            26,
            12,
            29,
            27
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 10,
          "bbox": [
            132,
            101,
            23,
            32
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 11,
          "bbox": [
            18,
            61,
            21,
            33
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 12,
          "bbox": [
            217,
            41,
            24,
            27
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 13,
          "bbox": [
            182,
            93,
            35,
            34
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 14,
          "bbox": [
            93,
            115,
            25,
            20
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        }
      ]
    }
  ],
  "test_samples": [
    {
      "id": "disaster_test_000",
      "split": "test",
      "pre_image": "data/test/images/disaster_test_000_pre_disaster.png",
      "post_image": "data/test/images/disaster_test_000_post_disaster.png",
      "loc_target": "data/test/targets/disaster_test_000_target_loc.png",
      "dmg_target": "data/test/targets/disaster_test_000_target_dmg.png",
      "comparison": "../outputs/predictions/disaster_test_000_comparison.png",
      "buildings": [
        {
          "id": 0,
          "bbox": [
            15,
            163,
            25,
            23
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            57,
            111,
            32,
            24
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            176,
            66,
            29,
            37
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 3,
          "bbox": [
            21,
            180,
            37,
            26
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            149,
            113,
            27,
            35
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 5,
          "bbox": [
            23,
            196,
            24,
            37
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            41,
            62,
            19,
            27
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            42,
            116,
            35,
            32
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 8,
          "bbox": [
            160,
            90,
            24,
            34
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 9,
          "bbox": [
            23,
            50,
            28,
            27
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 10,
          "bbox": [
            186,
            122,
            27,
            22
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 11,
          "bbox": [
            160,
            214,
            19,
            22
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        }
      ]
    },
    {
      "id": "disaster_test_001",
      "split": "test",
      "pre_image": "data/test/images/disaster_test_001_pre_disaster.png",
      "post_image": "data/test/images/disaster_test_001_post_disaster.png",
      "loc_target": "data/test/targets/disaster_test_001_target_loc.png",
      "dmg_target": "data/test/targets/disaster_test_001_target_dmg.png",
      "comparison": "../outputs/predictions/disaster_test_001_comparison.png",
      "buildings": [
        {
          "id": 0,
          "bbox": [
            131,
            29,
            18,
            28
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            56,
            29,
            34,
            36
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            82,
            83,
            33,
            20
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 3,
          "bbox": [
            148,
            43,
            21,
            36
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            79,
            189,
            20,
            25
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            60,
            58,
            32,
            22
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 6,
          "bbox": [
            201,
            147,
            37,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            210,
            111,
            25,
            37
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 8,
          "bbox": [
            14,
            65,
            28,
            33
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 9,
          "bbox": [
            12,
            121,
            24,
            21
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 10,
          "bbox": [
            170,
            13,
            21,
            19
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_test_002",
      "split": "test",
      "pre_image": "data/test/images/disaster_test_002_pre_disaster.png",
      "post_image": "data/test/images/disaster_test_002_post_disaster.png",
      "loc_target": "data/test/targets/disaster_test_002_target_loc.png",
      "dmg_target": "data/test/targets/disaster_test_002_target_dmg.png",
      "comparison": "../outputs/predictions/disaster_test_002_comparison.png",
      "buildings": [
        {
          "id": 0,
          "bbox": [
            138,
            70,
            24,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 1,
          "bbox": [
            111,
            115,
            25,
            24
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            152,
            22,
            22,
            33
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 3,
          "bbox": [
            85,
            212,
            27,
            19
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 4,
          "bbox": [
            123,
            55,
            31,
            21
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            55,
            218,
            35,
            25
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 6,
          "bbox": [
            74,
            206,
            24,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            105,
            126,
            25,
            22
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 8,
          "bbox": [
            126,
            185,
            33,
            25
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 9,
          "bbox": [
            21,
            113,
            32,
            27
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 10,
          "bbox": [
            131,
            146,
            26,
            35
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 11,
          "bbox": [
            109,
            208,
            34,
            25
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        }
      ]
    },
    {
      "id": "disaster_test_003",
      "split": "test",
      "pre_image": "data/test/images/disaster_test_003_pre_disaster.png",
      "post_image": "data/test/images/disaster_test_003_post_disaster.png",
      "loc_target": "data/test/targets/disaster_test_003_target_loc.png",
      "dmg_target": "data/test/targets/disaster_test_003_target_dmg.png",
      "comparison": "../outputs/predictions/disaster_test_003_comparison.png",
      "buildings": [
        {
          "id": 0,
          "bbox": [
            108,
            143,
            32,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            17,
            31,
            21,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            38,
            142,
            25,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            13,
            109,
            23,
            34
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            12,
            43,
            27,
            19
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            150,
            58,
            25,
            27
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            25,
            121,
            22,
            18
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            53,
            169,
            30,
            21
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 8,
          "bbox": [
            47,
            115,
            29,
            28
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 9,
          "bbox": [
            119,
            35,
            25,
            18
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 10,
          "bbox": [
            11,
            163,
            18,
            21
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 11,
          "bbox": [
            200,
            45,
            31,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_test_004",
      "split": "test",
      "pre_image": "data/test/images/disaster_test_004_pre_disaster.png",
      "post_image": "data/test/images/disaster_test_004_post_disaster.png",
      "loc_target": "data/test/targets/disaster_test_004_target_loc.png",
      "dmg_target": "data/test/targets/disaster_test_004_target_dmg.png",
      "comparison": "../outputs/predictions/disaster_test_004_comparison.png",
      "buildings": [
        {
          "id": 0,
          "bbox": [
            189,
            79,
            32,
            19
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 1,
          "bbox": [
            134,
            128,
            20,
            28
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            97,
            112,
            25,
            28
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 3,
          "bbox": [
            179,
            157,
            26,
            31
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 4,
          "bbox": [
            74,
            19,
            36,
            29
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 5,
          "bbox": [
            20,
            184,
            30,
            34
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            199,
            106,
            24,
            18
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            188,
            159,
            35,
            33
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 8,
          "bbox": [
            167,
            33,
            27,
            24
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 9,
          "bbox": [
            207,
            169,
            30,
            26
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        }
      ]
    },
    {
      "id": "disaster_test_005",
      "split": "test",
      "pre_image": "data/test/images/disaster_test_005_pre_disaster.png",
      "post_image": "data/test/images/disaster_test_005_post_disaster.png",
      "loc_target": "data/test/targets/disaster_test_005_target_loc.png",
      "dmg_target": "data/test/targets/disaster_test_005_target_dmg.png",
      "comparison": "../outputs/predictions/disaster_test_005_comparison.png",
      "buildings": [
        {
          "id": 0,
          "bbox": [
            96,
            184,
            25,
            28
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            222,
            43,
            23,
            28
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            143,
            90,
            25,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            175,
            212,
            21,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 4,
          "bbox": [
            99,
            209,
            19,
            20
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            199,
            65,
            35,
            27
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 6,
          "bbox": [
            173,
            28,
            26,
            19
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 7,
          "bbox": [
            115,
            175,
            36,
            33
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 8,
          "bbox": [
            110,
            84,
            26,
            22
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 9,
          "bbox": [
            166,
            66,
            26,
            35
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 10,
          "bbox": [
            88,
            202,
            18,
            35
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 11,
          "bbox": [
            64,
            208,
            33,
            32
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 12,
          "bbox": [
            207,
            137,
            27,
            22
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_test_006",
      "split": "test",
      "pre_image": "data/test/images/disaster_test_006_pre_disaster.png",
      "post_image": "data/test/images/disaster_test_006_post_disaster.png",
      "loc_target": "data/test/targets/disaster_test_006_target_loc.png",
      "dmg_target": "data/test/targets/disaster_test_006_target_dmg.png",
      "comparison": "../outputs/predictions/disaster_test_006_comparison.png",
      "buildings": [
        {
          "id": 0,
          "bbox": [
            115,
            10,
            34,
            35
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 1,
          "bbox": [
            114,
            12,
            19,
            24
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 2,
          "bbox": [
            171,
            27,
            30,
            35
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 3,
          "bbox": [
            13,
            167,
            37,
            34
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 4,
          "bbox": [
            180,
            84,
            22,
            36
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            61,
            28,
            18,
            29
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            216,
            66,
            21,
            20
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            18,
            90,
            26,
            36
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 8,
          "bbox": [
            32,
            13,
            18,
            22
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 9,
          "bbox": [
            79,
            178,
            37,
            27
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 10,
          "bbox": [
            57,
            182,
            19,
            24
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    },
    {
      "id": "disaster_test_007",
      "split": "test",
      "pre_image": "data/test/images/disaster_test_007_pre_disaster.png",
      "post_image": "data/test/images/disaster_test_007_post_disaster.png",
      "loc_target": "data/test/targets/disaster_test_007_target_loc.png",
      "dmg_target": "data/test/targets/disaster_test_007_target_dmg.png",
      "comparison": "../outputs/predictions/disaster_test_007_comparison.png",
      "buildings": [
        {
          "id": 0,
          "bbox": [
            180,
            125,
            22,
            35
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 1,
          "bbox": [
            62,
            62,
            30,
            28
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 2,
          "bbox": [
            99,
            58,
            29,
            26
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            68,
            108,
            29,
            20
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 4,
          "bbox": [
            94,
            58,
            20,
            34
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 5,
          "bbox": [
            23,
            72,
            21,
            20
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 6,
          "bbox": [
            86,
            14,
            36,
            35
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 7,
          "bbox": [
            122,
            61,
            22,
            37
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 8,
          "bbox": [
            49,
            199,
            24,
            37
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 9,
          "bbox": [
            86,
            173,
            28,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_test_008",
      "split": "test",
      "pre_image": "data/test/images/disaster_test_008_pre_disaster.png",
      "post_image": "data/test/images/disaster_test_008_post_disaster.png",
      "loc_target": "data/test/targets/disaster_test_008_target_loc.png",
      "dmg_target": "data/test/targets/disaster_test_008_target_dmg.png",
      "comparison": "../outputs/predictions/disaster_test_008_comparison.png",
      "buildings": [
        {
          "id": 0,
          "bbox": [
            26,
            90,
            31,
            27
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 1,
          "bbox": [
            163,
            151,
            34,
            24
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            64,
            196,
            27,
            19
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 3,
          "bbox": [
            53,
            53,
            33,
            33
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            198,
            139,
            32,
            37
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 5,
          "bbox": [
            12,
            190,
            35,
            36
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            138,
            156,
            35,
            31
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            75,
            76,
            22,
            24
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 8,
          "bbox": [
            118,
            94,
            28,
            29
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 9,
          "bbox": [
            194,
            106,
            18,
            37
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        }
      ]
    },
    {
      "id": "disaster_test_009",
      "split": "test",
      "pre_image": "data/test/images/disaster_test_009_pre_disaster.png",
      "post_image": "data/test/images/disaster_test_009_post_disaster.png",
      "loc_target": "data/test/targets/disaster_test_009_target_loc.png",
      "dmg_target": "data/test/targets/disaster_test_009_target_dmg.png",
      "comparison": "../outputs/predictions/disaster_test_009_comparison.png",
      "buildings": [
        {
          "id": 0,
          "bbox": [
            215,
            147,
            21,
            27
          ],
          "damage_level": 4,
          "damage_name": "Destroyed"
        },
        {
          "id": 1,
          "bbox": [
            89,
            107,
            29,
            31
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 2,
          "bbox": [
            39,
            156,
            34,
            27
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 3,
          "bbox": [
            126,
            45,
            34,
            26
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        },
        {
          "id": 4,
          "bbox": [
            106,
            10,
            26,
            21
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 5,
          "bbox": [
            191,
            58,
            23,
            19
          ],
          "damage_level": 2,
          "damage_name": "Minor damage"
        },
        {
          "id": 6,
          "bbox": [
            172,
            190,
            33,
            19
          ],
          "damage_level": 1,
          "damage_name": "No damage"
        },
        {
          "id": 7,
          "bbox": [
            218,
            41,
            20,
            20
          ],
          "damage_level": 3,
          "damage_name": "Major damage"
        }
      ]
    }
  ]
};
